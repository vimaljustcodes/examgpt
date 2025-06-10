export interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  duration: "monthly" | "lifetime"
  features: string[]
  popular?: boolean
}

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: "monthly",
    name: "Monthly Pro",
    price: 2,
    currency: "USD",
    duration: "monthly",
    features: [
      "Unlimited messages",
      "Chat history & memory",
      "All 14 personas",
      "Priority support",
      "Advanced AI features",
      "Sarcastic Gen Z responses",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime Pro",
    price: 10,
    currency: "USD",
    duration: "lifetime",
    popular: true,
    features: [
      "Unlimited messages",
      "Chat history & memory",
      "All 14 personas",
      "Priority support",
      "Advanced AI features",
      "Sarcastic Gen Z responses",
      "Future updates",
      "No recurring charges",
      "Best value!",
    ],
  },
]

export async function createPaymentLink(planId: string, userId: string, promoCode?: string) {
  const plan = PAYMENT_PLANS.find((p) => p.id === planId)
  if (!plan) throw new Error("Invalid plan")

  if (!process.env.DODO_PAYMENTS_API_KEY) {
    throw new Error("DodoPayments API key not configured")
  }

  let finalPrice = plan.price

  // Apply promo code discounts
  if (promoCode) {
    const discounts = {
      STUDENT50: 0.5,
      LAUNCH25: 0.25,
      EXAMGPT: 0.3,
    }

    if (discounts[promoCode.toUpperCase()]) {
      finalPrice = plan.price * (1 - discounts[promoCode.toUpperCase()])
    }
  }

  try {
    const response = await fetch("https://api.dodopayments.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(finalPrice * 100), // Convert to cents
        currency: plan.currency,
        description: `ExamGPT ${plan.name} - Your Sarcastic AI Study Bestie`,
        customer_id: userId,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?plan=${planId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        metadata: {
          plan_id: planId,
          user_id: userId,
          product: "examgpt_subscription",
          promo_code: promoCode || "",
          original_price: plan.price,
          final_price: finalPrice,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("DodoPayments API error:", response.status, errorData)
      throw new Error(`Payment service error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Payment creation error:", error)
    throw new Error("Failed to create payment link. Please try again.")
  }
}

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function calculateSavings(monthlyPrice: number, lifetimePrice: number): number {
  const yearlyEquivalent = monthlyPrice * 12
  return yearlyEquivalent - lifetimePrice
}
