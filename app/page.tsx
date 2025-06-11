"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Loader2, Menu, X, ArrowUp } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Import components directly instead of lazy loading for faster initial load
import { OnboardingModal, StudentData } from "@/components/onboarding-modal"
import { UpgradeModal } from "@/components/upgrade-modal"
import { ChatHistoryModal } from "@/components/chat-history-modal"
import { UpgradeBanner } from "@/components/upgrade-banner"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  mode: "explain" | "practice"
  subject: string
}

// Simple typewriter component
function SimpleTypewriter() {
  const [text, setText] = useState("")
  const [index, setIndex] = useState(0)

  const phrases = [
    "How to study 30 days syllabus in 3 hours?",
    "How to make my crush fall for me before final sem?",
    "How to not zone out during lectures?",
    "Can I pass using only ExamGPT?",
  ]

  useEffect(() => {
    const currentPhrase = phrases[index % phrases.length]

    if (text.length < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setText(currentPhrase.slice(0, text.length + 1))
      }, 100)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setText("")
        setIndex((prev: number) => prev + 1)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [text, index])

  return (
    <span>
      {text}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Inline sparkle icon
const SparkleIcon = () => (
  <svg width="20" height="20" fill="#000000" viewBox="0 0 256 256">
    <path d="M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"></path>
  </svg>
)

type ErrorState = {
  message: string
  code?: string
}

type UserData = {
  course?: string
  university?: string
  subscription_status?: string
  messages_used?: number
  name?: string
  country?: string
  year?: number
}

export default function ExamGPTLanding() {
  const [selectedMode, setSelectedMode] = useState<"explain" | "practice">("explain")
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false) // Will be used for profile setup
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showChatHistory, setShowChatHistory] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [error, setError] = useState<ErrorState | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simplified initial load - will be adjusted for IP tracking
  useEffect(() => {
    // For now, directly set initialized to true to prevent infinite loading
    setIsInitializing(false)
    // This will be replaced with IP-based tracking later
    const savedCount = localStorage.getItem("examgpt_message_count")
    if (savedCount) {
      setMessageCount(Number.parseInt(savedCount))
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // This function will be heavily refactored for new auth flow
  const fetchUserData = useCallback(async () => {
    try {
      setIsInitializing(true)
      // This will be replaced with anonymous IP tracking or user session check
      // For now, simulate a quick load
      setUserData({ messages_used: 0, subscription_status: "inactive" })
      setMessageCount(0)

      // Temporarily setting showOnboarding to false
      setShowOnboarding(false)

    } catch (error) {
      console.error("Failed to fetch user data:", error)
      setError({
        message: "Failed to load user data. Please try again.",
        code: "USER_DATA_ERROR"
      })
      toast.error("Failed to load user data. Please try again.")
    } finally {
      setIsInitializing(false)
    }
  }, [])

  const handleOnboardingComplete = async (data: StudentData) => {
    // This will be for saving user profile data after OTP signup
    try {
      // This is a placeholder. Actual saving to Supabase will happen here.
      // const response = await fetch("/api/user", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })
      // if (response.ok) {
      setShowOnboarding(false)
      // fetchUserData()
      // }
    } catch (error) {
      console.error("Failed to save user data:", error)
    }
  }

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(messageId)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const hasReachedLimit = messageCount >= 10
  const isSubscribed = userData?.subscription_status === "active"

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    if (hasReachedLimit && !isSubscribed) {
      setShowUpgrade(true) // Trigger paywall
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const userMessage: Message = {
        id: Date.now().toString(),
        content: content,
        sender: "user",
        timestamp: new Date(),
        mode: selectedMode,
        subject: userData?.course || "general" // Use profile course or default
      }
      setMessages((prev: Message[]) => [...prev, userMessage])
      setInputValue("")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          mode: selectedMode,
          subject: userData?.course || "general", // Use profile course or default
          chatId: currentChatId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setMessages((prev: Message[]) => [...prev, {
        id: data.id,
        content: data.content,
        sender: "ai",
        timestamp: new Date(),
        mode: selectedMode,
        subject: userData?.course || "general"
      }])

      setMessageCount((prev: number) => prev + 1)
      localStorage.setItem("examgpt_message_count", String(messageCount + 1))

    } catch (error) {
      console.error("Failed to send message:", error)
      setError({
        message: "Failed to send message. Please try again.",
        code: "MESSAGE_SEND_ERROR"
      })
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, selectedMode, hasReachedLimit, isSubscribed, userData, currentChatId, messageCount])

  const canSend = inputValue.trim() && !isLoading && !hasReachedLimit && !isSubscribed
  const sendButtonClass = canSend
    ? "bg-black text-white hover:bg-gray-800"
    : "bg-gray-300 text-gray-500 cursor-not-allowed"

  // Show loading only briefly
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized experience...</p>
        </div>
      </div>
    )
  }

  // Add error state UI
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => {
              setError(null)
              fetchUserData()
            }}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-black">ExamGPT</h1>

          <div className="flex items-center gap-2">
            <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium">
              {messageCount}/10
            </div>

            {userData && isSubscribed && (
              <div
                className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                  isSubscribed
                    ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Pro
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 space-y-3 z-50">
            {/* These buttons will be replaced by auth buttons */} 
            <Button
              variant="ghost"
              onClick={() => setShowChatHistory(true)}
              className="w-full justify-start text-sm"
            >
              Chat History
            </Button>
          </div>
        )}
      </header>

      {/* Upgrade Banner */}
      <UpgradeBanner
        messageCount={messageCount}
        maxMessages={10}
        onUpgrade={() => setShowUpgrade(true)}
        isSubscribed={isSubscribed}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pb-32 sm:pb-40">
          {messages.length === 0 ? (
            <div className="px-4 py-6 sm:py-8">
              <div className="text-center mb-8 sm:mb-12">
                <p className="text-gray-600 text-base sm:text-lg mb-2">Ask your sarcastic AI bestie,</p>
                <h2 className="text-lg sm:text-xl font-medium text-black leading-tight px-2 min-h-[3rem] flex items-center justify-center">
                  <SimpleTypewriter />
                </h2>
                {userData && userData.course && userData.university && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-3 px-2">
                    Personalized for {userData.course} at {userData.university}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-blue-600 mt-2 px-2">
                  💡 10 free messages/month • No signup required
                </p>
              </div>

              <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 max-w-2xl mx-auto">
                {/* These will be static for now, as promptCards removed. */} 
                <div
                  className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 active:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => setInputValue("Explain the most important legal maxims I need to know for my law exam")}
                >
                  <h3 className="font-medium text-black mb-2 text-sm sm:text-base leading-tight">Legal Maxims Cheat Sheet</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Those Latin things? Explain fast</p>
                </div>
                <div
                  className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 active:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => setInputValue("I'm a 3rd year medical student with a viva in 2 hours. Explain enteric fever case presentation and key points")}
                >
                  <h3 className="font-medium text-black mb-2 text-sm sm:text-base leading-tight">Explain enteric fever case</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">I'm 3rd year medico, zero sleep & viva in 2 hours</p>
                </div>
                <div
                  className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 active:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => setInputValue("How do I validate my startup MVP idea without spending too much money?")}
                >
                  <h3 className="font-medium text-black mb-2 text-sm sm:text-base leading-tight">Startup MVP validation</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">How do I know if my idea is actually good?</p>
                </div>
                <div
                  className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 active:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => setInputValue("What makes ExamGPT different from ChatGPT for students?")}
                >
                  <h3 className="font-medium text-black mb-2 text-sm sm:text-base leading-tight">What the fuck is ExamGPT</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">and how it is different from ChatGPT</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-3 sm:px-4 py-4 max-w-4xl mx-auto">
              <div className="space-y-4 sm:space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[80%] ${message.sender === "user" ? "" : "flex"}`}>
                      {message.sender === "ai" && (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-1">
                          <SparkleIcon />
                        </div>
                      )}

                      <div className="flex-1">
                        <div
                          className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                            message.sender === "user"
                              ? "bg-black text-white"
                              : "bg-gray-50 text-black border border-gray-200"
                          }`}
                        >
                          <div
                            className="text-sm sm:text-base leading-relaxed"
                            style={{ whiteSpace: "pre-wrap" }}
                            dangerouslySetInnerHTML={{
                              __html: message.content
                                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                            }}
                          />
                        </div>

                        {message.sender === "ai" && (
                          <div className="flex mt-2 space-x-1">
                            <button
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                              onClick={() => handleCopy(message.content, message.id)}
                            >
                              <Copy size={14} className="text-gray-500" />
                              {copySuccess === message.id && (
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                                  Copied!
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <SparkleIcon />
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-gray-500 text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(hasReachedLimit && !isSubscribed) && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center">
                    <h3 className="font-semibold text-orange-800 mb-2">
                      Free limit reached! Upgrade to continue
                    </h3>
                    <p className="text-orange-700 text-sm mb-3">
                      You've used all 10 free messages this month. Upgrade to Pro for unlimited conversations.
                    </p>
                    <Button
                      onClick={() => setShowUpgrade(true)}
                      className="bg-orange-600 text-white hover:bg-orange-700"
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 resize-none"
              rows={1}
              disabled={isLoading}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  if (canSend) {
                    sendMessage(inputValue)
                    setInputValue("")
                  }
                }
              }}
            />
            <Button
              onClick={() => {
                if (canSend) {
                  sendMessage(inputValue)
                  setInputValue("")
                }
              }}
              disabled={!canSend || isLoading}
              className={cn(
                "shrink-0",
                sendButtonClass,
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* OnboardingModal will be repurposed for Profile Setup */}
      {showOnboarding && <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />}
      {showUpgrade && (
        <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} userId={null} />
      )}
      {showChatHistory && <ChatHistoryModal isOpen={showChatHistory} onClose={() => setShowChatHistory(false)} />}
    </div>
  )
}
