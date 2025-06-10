"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface UpgradeBannerProps {
  messageCount: number
  maxMessages: number
  onUpgrade: () => void
  isSubscribed?: boolean
}

export function UpgradeBanner({ messageCount, maxMessages, onUpgrade, isSubscribed }: UpgradeBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Don't show banner if user is subscribed or hasn't used many messages yet
  if (isSubscribed || messageCount < maxMessages - 3 || !isVisible) {
    return null
  }

  const isAtLimit = messageCount >= maxMessages
  const remainingMessages = Math.max(0, maxMessages - messageCount)

  const getResetDate = () => {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            {isAtLimit ? (
              <>You've reached your free limit. Your limit will reset on {getResetDate()}.</>
            ) : (
              <>
                You are running low on credits ({remainingMessages} left). Your limit will reset on {getResetDate()}.
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button onClick={onUpgrade} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 h-auto">
            Upgrade Plan
          </Button>
          <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-gray-200 rounded transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
