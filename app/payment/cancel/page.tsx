"use client"

import Link from "next/link"
import { XCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <XCircle size={64} className="text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">No worries! You can still use ExamGPT with your free messages.</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-black mb-2">Still want to upgrade?</h2>
          <p className="text-sm text-gray-700 mb-4">Get unlimited access to your sarcastic AI study bestie anytime.</p>
          <p className="text-xs text-blue-600">💡 Use code STUDENT50 for 50% off your first month!</p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              <ArrowLeft size={16} className="mr-2" />
              Back to ExamGPT
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full">
              Try Upgrading Again
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-4">Questions? Contact us at support@examgpt.com</p>
      </div>
    </div>
  )
}
