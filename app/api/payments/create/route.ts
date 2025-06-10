import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createPaymentLink } from "@/lib/payments"

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId } = await req.json()

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const paymentLink = await createPaymentLink(planId, userId)

    return NextResponse.json({
      url: paymentLink.url,
      paymentId: paymentLink.id,
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 })
  }
}
