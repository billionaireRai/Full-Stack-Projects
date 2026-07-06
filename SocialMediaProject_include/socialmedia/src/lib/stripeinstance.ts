import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    console.log("Stripe secret key mising !!");
    throw new Error("Missing STRIPE_SECRET_KEY environment variable !!");
}

export const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-10-29.clover" });

export const createStripeCustomer = async (email: string) => {
    return await stripe.customers.create({ email });
};