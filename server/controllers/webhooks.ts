import Stripe from "stripe";
import type { Request, Response } from "express"
import Transaction from "../models/Transaction";
import User from "../models/User";

export const stripeWebhooks = async (req: Request, res: Response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');
    const sig = req.headers['stripe-signature'] ?? '';

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPLE_WEBHOOK_SECRET_KEY || '');
    } catch (error) {
        return res.status(400).send(`Webhook Error : ${(error as Error).message}`)
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });
                const session = sessionList.data[0];
                const { transactionId, appId } = session?.metadata as { transactionId: string; appId: string } | undefined || {};

                if (appId === "quickgpt") {
                    const transaction = await Transaction.findOne({
                        _id: transactionId,
                        isPaid: false
                    });

                    if (transaction) {
                        await User.updateOne({ _id: transaction.userId }, {
                            $inc: { credits: transaction.credits }
                        })

                        transaction.isPaid = true;
                        await transaction.save();
                    }
                } else {
                    return res.json({
                        received: true,
                        message: "Ignored event: Invalid app"
                    })
                }
            }
            default:
                console.log("Unhandled event type : ", event.type)
                break;
        }

        res.json({ received: true })
    } catch (error) {
        console.log(error)
        return res.status(500).send(`Internal Server Error`)
    }
}