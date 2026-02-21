import type { Request, Response } from "express";
import Stripe from "stripe";
import { BadRequestError } from "../errors/customErrors.ts";
const stripe = new Stripe(process.env.STRIPE_API_SECRET as string, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});
export const payment = async (req: Request, res: Response) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "USD",
    });
    return res.status(200).json({
      message: "Payment intent created.",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    throw new BadRequestError(`Request error. ${error}`);
  }
};
