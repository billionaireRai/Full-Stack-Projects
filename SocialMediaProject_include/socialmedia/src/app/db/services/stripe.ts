import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { createStripeCustomer } from "@/lib/stripeinstance";
import accounts from "../models/accounts";
import { sendSubscriptionNotificationEmail } from "@/components/subcriptionemail";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import subscriptions from "../models/subscriptions";
import Stripe from "stripe";
import users from "../models/users";

export const CheckHasAlreadySubscribed = async (priceId:String) => {
  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

  await connectWithMongoDB() ; // connecting to Database...

  // getting the active account...
  const activeAcc = await accounts.findOne({ userId:user.id ,'account.Active':true , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] }}) ; 
  if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

  const subscriptiondoc = await subscriptions.findOne({ accountId:activeAcc._id }) ;

  if (!subscriptiondoc) {
    const subs = await subscriptions.create({ accountId:activeAcc._id , priceId:priceId  }) ;
    
    const StripeCustomer = await createStripeCustomer(user.email) ;
    const customerEmail = StripeCustomer?.email ?? user.email ;

    return { email:customerEmail , accid:activeAcc._id , sub:subs } ;
  }
  
  await subscriptions.updateOne({ accountId:activeAcc._id },{ priceId:priceId , status:'trialing' },{ upsert:true })

  return { email:user.email , accid:activeAcc._id , subs:subscriptiondoc } ;
}


export const handleCheckoutCompleted = async (Session:Stripe.Checkout.Session) => {
  // using metadata for account specific info...
  const accountId = Session?.metadata?.accountId ;
  const plan = Session?.metadata?.plan ;

  if (!accountId || !plan) {
    console.error("Any of checkout metadata is missing !!") ;
    return ;
  }

  await connectWithMongoDB(); // connecting to Database...

  // getting the account involved in subscription...
  const activeAcc = await accounts.findOne({ _id: accountId, "account.Active": true, "account.status": { $in: ["ACTIVE", "DEACTIVATED"] }});
  const accountOwner = await users.findById(activeAcc.userId) ;

  if (!activeAcc) {
    console.error("Account not found for checkout completion :", accountId) ;
    return ;
  }
  if (!accountOwner) {
    console.error("Account owner not found for checkout completion :", accountOwner._id) ;
    return ;
  }

  // Extract Stripe fields...
  const stripeCustomerId = Session.customer ? (typeof Session.customer === "string" ? Session.customer : Session.customer.id) : null ;
  const stripeSubscriptionId = Session.subscription ?? null ;

  // Checkout session not neccessarily have data...
  const currentCycleEnd = Session.expires_at ? new Date(Session.expires_at * 1000) : '' ;
  const priceId = Session?.line_items?.data?.[0]?.price?.id ?? null ;
  const currency = Session.currency?.toUpperCase?.() ?? "USD" ;

  // Update existing subscription doc for this account, or create one if missing...
  const updatedData : Record<string, any> = {
    priceId,
    status: "active",
    plan,
    stripeCustomerId,
    stripeSubscriptionId,
    currentCycleEnd,
    currency: currency
  };

  // checking existence of returned data obj...
  if (!priceId) delete updatedData.priceId;
  if (!stripeCustomerId) delete updatedData.stripeCustomerId;
  if (!stripeSubscriptionId) delete updatedData.stripeSubscriptionId;
  if (!currentCycleEnd) delete updatedData.currentCycleEnd;

  await subscriptions.updateOne({ accountId: activeAcc._id , status:'trialing' },{ $set: updatedData },
    { upsert: true } // for creating new doc , if not present...
  );

  const StripeEmailDetails = {
    planName:plan,
    currency:currency,
    billingPeriodStart:new Date(),
    billingPeriodEnd:currentCycleEnd,
    customerEmail:accountOwner.email
  };

  await sendSubscriptionNotificationEmail("checkout.session.completed",StripeEmailDetails);

};

export const handleInvoicePaidService = async (invoice: Stripe.Invoice) => {

  const stripeCustomerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? null;
  const stripeSubscriptionId = (invoice as any).subscription ?? (invoice as any).subscription_id ?? (invoice as any).subscriptionId ?? null;

  if (!stripeSubscriptionId) throw new Error("Missing stripeSubscriptionId on invoice."); // debug log...

  await connectWithMongoDB();

  // Update the subscription doc with this stripe invoice...
  const subscription = await subscriptions.findOne({ stripeSubscriptionId });
  if (!subscription) throw new Error("Subscription not found.");

  // updating subscription status...
  subscription.status = "active";

  // Stripe provides current period via lines...
  const period = invoice.lines?.data?.[0]?.period ;

  if (period?.start) subscription.currentCycleStart = new Date(period.start * 1000);
  if (period?.end) subscription.currentCycleEnd = new Date(period.end * 1000);

  // updating customerid and currency...
  if (stripeCustomerId) subscription.stripeCustomerId = stripeCustomerId ;
  if (invoice.currency) subscription.currency = invoice.currency.toUpperCase();

  await subscription.save();

  // getting account and owner user...
  const activeAcc = await accounts.findOne({ _id: subscription.accountId, "account.Active": true, "account.status": { $in: ["ACTIVE", "DEACTIVATED"] } });
  if (!activeAcc) {
    console.error("Account not found for checkout completion :", activeAcc._id) ;
    return ;
  }

  const accountOwner = await users.findById(activeAcc.userId) ;
  if (!accountOwner) {
    console.error("Account owner not found for checkout completion :", accountOwner._id) ;
    return ;
  }

  const StripeEmailDetails = {
    planName:subscription.plan,
    currency:subscription.currency,
    billingPeriodStart:subscription.currentCycleStart,
    billingPeriodEnd:subscription.currentCycleEnd,
    customerEmail:accountOwner.email
  };

  await sendSubscriptionNotificationEmail("invoice.paid",StripeEmailDetails);
}


export const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {

  const stripeSubscriptionId = (invoice as any).subscription ?? (invoice as any).subscription_id ?? (invoice as any).subscriptionId ?? null;

  if (!stripeSubscriptionId) throw new Error("Missing stripeSubscriptionId on invoice."); // debug log...

  await connectWithMongoDB();

  // Update the subscription doc with this stripe invoice...
  const subscription = await subscriptions.findOne({ stripeSubscriptionId });
  if (!subscription) throw new Error("Subscription not found.");

  // updating subscription status...
  subscription.status = "past_due";

  await subscription.save();

  // getting account and owner user...
  const activeAcc = await accounts.findOne({ _id: subscription.accountId, "account.Active": true, "account.status": { $in: ["ACTIVE", "DEACTIVATED"] } });
  if (!activeAcc) {
    console.error("Account not found for checkout completion :", activeAcc._id) ;
    return ;
  }

  const accountOwner = await users.findById(activeAcc.userId) ;
  if (!accountOwner) {
    console.error("Account owner not found for checkout completion :", accountOwner._id) ;
    return ;
  }

  const StripeEmailDetails = {
    planName:subscription.plan,
    currency:subscription.currency,
    billingPeriodStart:subscription.currentCycleStart,
    billingPeriodEnd:subscription.currentCycleEnd,
    customerEmail:accountOwner.email
  };

  await sendSubscriptionNotificationEmail("invoice.payment_failed",StripeEmailDetails);
}

export const handleCustomerSubscriptionUpgrade = async (subscpn:Stripe.Subscription) => {

  const stripeCustomerId = typeof subscpn.customer === "string" ? subscpn.customer : subscpn.customer?.id ?? null;
  const stripeSubscriptionId = (subscpn as any).subscription ?? (subscpn as any).subscription_id ?? (subscpn as any).subscriptionId ?? null;

  if (!stripeSubscriptionId) throw new Error("Missing stripeSubscriptionId on invoice."); // debug log...

  await connectWithMongoDB();

  // Update the subscription doc with this stripe invoice...
  const subscription = await subscriptions.findOne({ stripeSubscriptionId });
  if (!subscription) throw new Error("Subscription not found.");

  // updating subscription status...
  subscription.status = "active";

  // period can be in items OR lines depends on response type...
  const period = (subscpn as any).items?.data?.[0]?.period ?? (subscpn as any).lines?.data?.[0]?.period ;

  if (period?.start) subscription.currentCycleStart = new Date(period.start * 1000);
  if (period?.end) subscription.currentCycleEnd = new Date(period.end * 1000);

  // updating customerId, currency & priceId...
  if (stripeCustomerId) subscription.stripeCustomerId = stripeCustomerId ;
  if (subscpn.currency) subscription.currency = subscpn.currency.toUpperCase();

  const newPriceId = subscpn.items?.data?.[0]?.price?.id ?? subscpn.items?.data?.[0]?.price?.id ?? null;
  if (newPriceId) subscription.priceId = newPriceId ;

  await subscription.save();

  // getting account and owner user...
  const activeAcc = await accounts.findOne({ _id: subscription.accountId, "account.Active": true, "account.status": { $in: ["ACTIVE", "DEACTIVATED"] } });
  if (!activeAcc) {
    console.error("Account not found for checkout completion :", activeAcc._id) ;
    return ;
  }

  const accountOwner = await users.findById(activeAcc.userId) ;
  if (!accountOwner) {
    console.error("Account owner not found for checkout completion :", accountOwner._id) ;
    return ;
  }

  const StripeEmailDetails = {
    planName:subscription.plan,
    currency:subscription.currency,
    billingPeriodStart:subscription.currentCycleStart,
    billingPeriodEnd:subscription.currentCycleEnd,
    customerEmail:accountOwner.email
  };

  await sendSubscriptionNotificationEmail("customer.subscription.updated",StripeEmailDetails);
}

export const handleCustomerSubscriptionDeletion = async (subs:Stripe.Subscription) => {
  const stripeSubscriptionId = subs?.id ?? null ;
  if (!stripeSubscriptionId) throw new Error("Missing stripeSubscriptionId on subscription deletion.");

  await connectWithMongoDB();

  // Update the subscription doc with this stripe subscription...
  const subscription = await subscriptions.findOne({ stripeSubscriptionId });
  if (!subscription) throw new Error("Subscription not found.");

  // Subscription deleted => move user to Free
  subscription.status = "active";
  subscription.plan = "Free";
  subscription.priceId = null;

  const period = (subs as any).items?.data?.[0]?.period ?? (subs as any).lines?.data?.[0]?.period;

  if (period?.start) subscription.currentCycleStart = new Date(period.start * 1000);
  if (period?.end) subscription.currentCycleEnd = new Date(period.end * 1000);

  if (subs.currency) subscription.currency = subs.currency.toUpperCase();

  await subscription.save();

  // getting account and owner user...
  const activeAcc = await accounts.findOne({ _id: subscription.accountId, "account.Active": true, "account.status": { $in: ["ACTIVE", "DEACTIVATED"] } });
  if (!activeAcc) {
    console.error("Account not found for subscription deletion :", subscription.accountId);
    return;
  }

  const accountOwner = await users.findById(activeAcc.userId);
  if (!accountOwner) {
    console.error("Account owner not found for subscription deletion :", activeAcc.userId);
    return;
  }

  const StripeEmailDetails = {
    planName: subscription.plan,
    currency: subscription.currency,
    billingPeriodStart: subscription.currentCycleStart,
    billingPeriodEnd: subscription.currentCycleEnd,
    customerEmail: accountOwner.email
  };

  await sendSubscriptionNotificationEmail("customer.subscription.deleted", StripeEmailDetails);
}
