import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any
      const userId = session.metadata.userId

      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(session.subscription)

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeSubId: subscription.id,
          plan: subscription.items.data[0].plan.id === process.env.STRIPE_AGENCY_PRICE_ID ? "agency" : "pro",
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        update: {
          status: subscription.status,
          plan: subscription.items.data[0].plan.id === process.env.STRIPE_AGENCY_PRICE_ID ? "agency" : "pro",
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      })

      await prisma.payment.create({
        data: {
          userId,
          stripePaymentId: session.id,
          amount: session.amount_total,
          currency: session.currency,
          status: "completed",
        },
      })
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as any
      await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: { status: "canceled" },
      })
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as any
      const userId = invoice.metadata?.userId

      if (userId) {
        await prisma.subscription.updateMany({
          where: { userId },
          data: { status: "past_due" },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
