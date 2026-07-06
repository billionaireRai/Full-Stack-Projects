import asyncErrorHandler from "../middleware/errorMiddleware";
import { CheckHasAlreadySubscribed } from "../db/services/stripe";
import { stripe } from '@/lib/stripeinstance';
import { handleCheckoutCompleted , handleCustomerPaidInvoice } from "../db/services/stripe";
import { getStripePriceId } from "@/lib/utils";
import { NextRequest , NextResponse } from "next/server";
import Stripe from "stripe";

interface checkingSubsReturnType {
    email:string ;
    accid:string ;
}

export const CreateSubscriptionSessionURLController = asyncErrorHandler( async(request:NextRequest) => {
    const { plan , term , clienturl } = await request.json() ; // getting the priceId from request data...

    const specificPriceId = getStripePriceId(plan,term) ;
    const { email , accid } = await CheckHasAlreadySubscribed(specificPriceId) as checkingSubsReturnType ;

    // creating checkout session...
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email: email,

        line_items: [{ price: specificPriceId, quantity: 1 }],

        success_url:`${clienturl}/payment-success?session_id={CHECKOUT_SESSION_ID}`, // redirected from stripe...
        
        cancel_url:`${clienturl}/subscription`,
        
        metadata: { accountId: accid.toString() }
        
        
    })
    
    return NextResponse.json({ message:'Checkout session URL generated...' , url:session.url },{ status:200 });
})

export const CancelSubscriptionController = asyncErrorHandler( async(request:NextRequest) => {
    // get stripeSubscriptionId from a service funtion...;
    // await stripe.subscriptions.update( subscriptionId ,{ cancel_at_period_end:true });
    return NextResponse.json({ message:'Subscription cancelled successfully...' },{ status:200 });
})

export const StripeWebhookResponseController = asyncErrorHandler( async(request: NextRequest) => {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.log("Stripe signature is unavailable !!");
      return NextResponse.json({ error: "Missing Stripe signature" },{ status: 400 });
    }

    let event: Stripe.Event ;

    try {
      event = stripe.webhooks.constructEvent(body,signature,process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error("Webhook Signature Error :", err);
      return NextResponse.json({ error: "Invalid signature" },{ status: 400 });
    }

    try {

      switch (event.type) {
        case "checkout.session.completed": {

          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutCompleted(session);

          break;
        }

        case "invoice.paid": {

          const invoice = event.data.object as Stripe.Invoice;
          await handleCustomerPaidInvoice(invoice);

          break;
        }

        case "invoice.payment_failed": {

          const invoice = event.data.object as Stripe.Invoice;

          // Mark subscription as past_due
          // Notify user (optional)

          break;
        }

        case "customer.subscription.updated": {

          const subscription = event.data.object as Stripe.Subscription;

          // Update:
          // status
          // cancelAtPeriodEnd
          // currentPeriodEnd
          // latest priceId

          break;
        }

        case "customer.subscription.deleted": {

          const subscription = event.data.object as Stripe.Subscription;

          // Downgrade user to Free
          // Remove premium privileges

          break;
        }

        default:
          console.log(`Unhandled Event: ${event.type}`);
      }

      return NextResponse.json({ received: true },{ status: 200 });
    } catch (err) {
      console.error("Webhook Processing Error:", err);
      return NextResponse.json({ error: "Webhook processing failed" },{ status: 500 });
    }

  }
);

