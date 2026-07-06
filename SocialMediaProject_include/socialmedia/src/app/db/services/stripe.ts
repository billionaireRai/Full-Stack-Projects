import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { createStripeCustomer } from "@/lib/stripeinstance";
import accounts from "../models/accounts";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import subscriptions from "../models/subscriptions";
import Stripe from "stripe";

export const CheckHasAlreadySubscribed = async (priceId:String) => {
  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

  await connectWithMongoDB() ; // connecting to Database...

  // getting the active account...
  const activeAcc = await accounts.findOne({ userId:user.id ,'account.Active':true , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] }}) ; 
  if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

  const subscriptiondoc = await subscriptions.findOne({ accountId:activeAcc._id }) ;

  if (!subscriptiondoc) {
    await subscriptions.create({ accountId:activeAcc._id , priceId:priceId  }) ;
    
    const StripeCustomer = await createStripeCustomer(user.email) ;
    const customerEmail = StripeCustomer?.email ?? user.email ;

    return { email:customerEmail , accid:activeAcc._id  } ;
  }
  
  await subscriptions.updateOne({ accountId:activeAcc._id },{ priceId:priceId , status:'trialing' })

  return { email:user.email , accid:activeAcc._id } ;
}


export const handleCheckoutCompleted = async (Session:Stripe.Checkout.Session) => {
  // using metadata for account specific info...
  const accountId = Session?.metadata?.accountId;
  if (!accountId) {
    console.error("Missing checkout metadata accountId") ;
    return ;
  }

  await connectWithMongoDB(); // connecting to Database...

  // getting the account involved in subscription...
  const activeAcc = await accounts.findOne({ _id: accountId, "account.Active": true, "account.status": { $in: ["ACTIVE", "DEACTIVATED"] }});

  if (!activeAcc) {
    console.error("Account not found for checkout completion :", accountId) ;
    return ;
  }

  // Extract Stripe fields...
  const stripeCustomerId = Session.customer ? (typeof Session.customer === "string" ? Session.customer : Session.customer.id) : null ;
  const stripeSubscriptionId = Session.subscription ?? null ;

  // Checkout session not neccessarily have data...
  const currentCycleEnd = Session.expires_at ? new Date(Session.expires_at * 1000) : null ;
  const priceId = Session?.line_items?.data?.[0]?.price?.id ?? null ;
  const currency = Session.currency?.toUpperCase?.() ?? "USD" ;

  // Update existing subscription doc for this account, or create one if missing...
  const updatedData : Record<string, any> = {
    priceId,
    status: "active",
    stripeCustomerId,
    stripeSubscriptionId,
    currentCycleEnd: currentCycleEnd,
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

};

export const handleCustomerPaidInvoice = async (Session:Stripe.Invoice) => {
            // Update renewal date
          // Mark subscription active if required
}