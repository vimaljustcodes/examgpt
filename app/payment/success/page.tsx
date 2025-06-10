"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")

  useEffect(() => {
    // Confetti effect or celebration animation could go here
    console.log("Payment successful for plan:", plan)
  }, [plan])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Payment Successful! 🎉</h1>
          <p className="text-gray-600">Welcome to ExamGPT Pro! Your sarcastic AI bestie is now unlimited.</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-black mb-4">What's unlocked:</h2>
          <ul className="text-left space-y-2 text-sm text-gray-700">
            <li>✅ Unlimited AI conversations</li>
            <li>✅ Chat history & memory</li>
            <li>✅ All 14 subject personas</li>
            <li>✅ Priority support</li>
            <li>✅ Advanced features</li>
          </ul>
        </div>

        <Link href="/">
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            Start Chatting with ExamGPT
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>

        <p className="text-xs text-gray-500 mt-4">Need help? Contact us at support@examgpt.com</p>
      </div>
    </div>
  )
}
