"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Loader2, X, Zap, Crown, Tag } from "lucide-react"
import { PAYMENT_PLANS, createPaymentLink } from "@/lib/payments"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function UpgradeModal({ isOpen, onClose, userId }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  const handlePromoCode = () => {
    const validCodes = {
      STUDENT50: 50,
      LAUNCH25: 25,
      EXAMGPT: 30,
    }

    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()])
      setPromoApplied(true)
    } else {
      alert("Invalid promo code")
    }
  }

  const handleUpgrade = async (planId: string) => {
    setLoading(planId)
    try {
      const paymentLink = await createPaymentLink(planId, userId, promoCode)
      window.location.href = paymentLink.url
    } catch (error) {
      console.error("Payment error:", error)
      alert("Failed to create payment. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const calculateDiscountedPrice = (price: number) => {
    return price - (price * discount) / 100
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Upgrade to ExamGPT Pro</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">Your sarcastic AI bestie with unlimited access</p>
        </DialogHeader>

        {/* Promo Code Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Have a promo code?</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1"
              disabled={promoApplied}
            />
            <Button onClick={handlePromoCode} disabled={!promoCode || promoApplied} variant="outline" size="sm">
              Apply
            </Button>
          </div>
          {promoApplied && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <Check size={14} />
              {discount}% discount applied!
            </p>
          )}
        </div>

        {/* Mobile-Optimized Pricing Cards */}
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 py-6">
          {PAYMENT_PLANS.map((plan) => {
            const finalPrice = promoApplied ? calculateDiscountedPrice(plan.price) : plan.price

            return (
              <div
                key={plan.id}
                className={`relative border rounded-2xl p-6 transition-all duration-300 ${
                  plan.id === "lifetime"
                    ? "border-black bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Popular Badge */}
                {plan.id === "lifetime" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Crown size={12} />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    {promoApplied && <div className="text-sm text-gray-500 line-through">${plan.price}</div>}
                    <span className="text-3xl font-bold">${finalPrice.toFixed(2)}</span>
                    {plan.duration === "monthly" && <span className="text-gray-600 text-sm">/month</span>}
                  </div>

                  {plan.duration === "lifetime" && (
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full inline-block mb-4">
                      Save ${2 * 12 - plan.price} vs Monthly
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full transition-all duration-300 ${
                    plan.id === "lifetime"
                      ? "bg-black text-white hover:bg-gray-800 shadow-lg"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  {loading === plan.id ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : plan.id === "lifetime" ? (
                    <Zap size={16} className="mr-2" />
                  ) : null}
                  {loading === plan.id
                    ? "Processing..."
                    : plan.id === "lifetime"
                      ? "Get Lifetime Access"
                      : "Choose Monthly"}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="border-t pt-6 space-y-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-3">Trusted by 10,000+ students worldwide</p>
            <div className="flex justify-center items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Secure Payment
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Instant Access
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                24/7 Support
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500">
            Secure payment powered by DodoPayments • Cancel anytime
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
