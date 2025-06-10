"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, ArrowUp, Lightbulb, Edit3, Copy, Loader2, Menu, X, Crown, History, Zap } from "lucide-react"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"

// Import components directly instead of lazy loading for faster initial load
import { OnboardingModal } from "@/components/onboarding-modal"
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
        setIndex((prev) => prev + 1)
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

export default function ExamGPTLanding() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [selectedMode, setSelectedMode] = useState<"explain" | "practice">("explain")
  const [selectedSubject, setSelectedSubject] = useState("law-india")
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showChatHistory, setShowChatHistory] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simplified initial load
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchUserData()
    } else if (isLoaded && !isSignedIn) {
      const savedCount = localStorage.getItem("examgpt_message_count")
      if (savedCount) {
        setMessageCount(Number.parseInt(savedCount))
      }
    }
  }, [isLoaded, isSignedIn, user])

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user")
      const data = await response.json()
      if (!data.user) {
        setShowOnboarding(true)
      } else {
        setUserData(data.user)
        setMessageCount(data.user.messages_used || 0)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  const handleOnboardingComplete = async (data: any) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.emailAddresses[0]?.emailAddress,
          ...data,
        }),
      })
      if (response.ok) {
        setShowOnboarding(false)
        fetchUserData()
      }
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

  const hasReachedLimit = !isSignedIn && messageCount >= 10
  const isSubscribed = userData?.subscription_status === "active"
  const freeUserReachedLimit = isSignedIn && !isSubscribed && messageCount >= 10

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    if (hasReachedLimit || freeUserReachedLimit) {
      setShowUpgrade(true)
      return
    }

    let chatId = currentChatId
    if (isSignedIn && !chatId) {
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: inputValue.slice(0, 50) }),
        })
        const data = await response.json()
        chatId = data.chat?.id
        setCurrentChatId(chatId)
      } catch (error) {
        console.error("Failed to create chat:", error)
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      mode: selectedMode,
      subject: selectedSubject,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    if (!isSignedIn) {
      const newCount = messageCount + 1
      setMessageCount(newCount)
      localStorage.setItem("examgpt_message_count", newCount.toString())
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          mode: selectedMode,
          subject: selectedSubject,
          chatId,
        }),
      })

      if (response.status === 429 || response.status === 402) {
        setShowUpgrade(true)
        return
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        mode: selectedMode,
        subject: selectedSubject,
      }

      setMessages((prev) => [...prev, aiMessage])

      if (isSignedIn) {
        setMessageCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        mode: selectedMode,
        subject: selectedSubject,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const promptCards = [
    {
      title: "Legal Maxims Cheat Sheet",
      subtitle: "Those Latin things? Explain fast",
      onClick: () => setInputValue("Explain the most important legal maxims I need to know for my law exam"),
    },
    {
      title: "Explain enteric fever case",
      subtitle: "I'm 3rd year medico, zero sleep & viva in 2 hours",
      onClick: () =>
        setInputValue(
          "I'm a 3rd year medical student with a viva in 2 hours. Explain enteric fever case presentation and key points",
        ),
    },
    {
      title: "Startup MVP validation",
      subtitle: "How do I know if my idea is actually good?",
      onClick: () => setInputValue("How do I validate my startup MVP idea without spending too much money?"),
    },
    {
      title: "What the fuck is ExamGPT",
      subtitle: "and how it is different from ChatGPT",
      onClick: () => setInputValue("What makes ExamGPT different from ChatGPT for students?"),
    },
  ]

  const subjects = [
    { value: "law-india", label: "🧑‍⚖️ Indian Law" },
    { value: "law-usa", label: "🇺🇸 USA Law" },
    { value: "engineering-india", label: "🧑‍💻 Engineering India" },
    { value: "engineering-usa", label: "🇺🇸 Engineering USA" },
    { value: "medicine-india", label: "🧑‍⚕️ Medicine India" },
    { value: "medicine-usa", label: "🇺🇸 Medicine USA" },
    { value: "business-india", label: "💼 Business India" },
    { value: "business-usa", label: "🇺🇸 Business USA" },
    { value: "startup-india", label: "🚀 Startup India" },
    { value: "startup-usa", label: "🇺🇸 Startup USA" },
    { value: "finance-india", label: "💰 Finance India" },
    { value: "finance-usa", label: "💵 Finance USA" },
    { value: "lifestyle", label: "💛 Lifestyle" },
    { value: "sex-education", label: "🍑 Sex Education" },
  ]

  const canSend = inputValue.trim() && !isLoading && !hasReachedLimit && !freeUserReachedLimit
  const sendButtonClass = canSend
    ? "bg-black text-white hover:bg-gray-800"
    : "bg-gray-300 text-gray-500 cursor-not-allowed"

  // Show loading only briefly
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            {!isSignedIn && (
              <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium">
                {messageCount}/10
              </div>
            )}

            {isSignedIn && userData && (
              <div
                className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                  isSubscribed
                    ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Crown size={12} />
                    Pro
                  </>
                ) : (
                  `${messageCount}/10`
                )}
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="text-sm">
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-black text-white rounded-full px-3 py-1.5 flex items-center gap-1.5 hover:bg-gray-800 text-sm">
                      <User size={14} />
                      Sign up
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>

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
            {isSignedIn ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Signed in as {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                  </span>
                  <UserButton />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowChatHistory(true)}
                  className="w-full justify-start text-sm"
                >
                  <History size={16} className="mr-2" />
                  Chat History
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 text-sm">
                    <User size={16} className="mr-2" />
                    Sign up
                  </Button>
                </SignUpButton>
              </div>
            )}
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
                {userData && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-3 px-2">
                    Personalized for {userData.course} at {userData.university}
                  </p>
                )}
                {!isSignedIn && (
                  <p className="text-xs sm:text-sm text-blue-600 mt-2 px-2">
                    💡 10 free messages/month • No signup required
                  </p>
                )}
              </div>

              <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 max-w-2xl mx-auto">
                {promptCards.map((card, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 active:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                    onClick={card.onClick}
                  >
                    <h3 className="font-medium text-black mb-2 text-sm sm:text-base leading-tight">{card.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{card.subtitle}</p>
                  </div>
                ))}
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
                          <Loader2 size={14} className="animate-spin text-gray-500" />
                          <span className="text-gray-500 text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(hasReachedLimit || freeUserReachedLimit) && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center">
                    <h3 className="font-semibold text-orange-800 mb-2">
                      {hasReachedLimit ? "Free limit reached!" : "Upgrade to continue"}
                    </h3>
                    <p className="text-orange-700 text-sm mb-3">
                      {hasReachedLimit
                        ? "You've used all 10 free messages this month. Sign up for unlimited access!"
                        : "You've reached your free limit. Upgrade to Pro for unlimited conversations."}
                    </p>
                    <Button
                      onClick={() => setShowUpgrade(true)}
                      className="bg-orange-600 text-white hover:bg-orange-700"
                    >
                      <Zap size={16} className="mr-2" />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:pb-4 space-y-3 sm:space-y-2">
            <Textarea
              placeholder={
                hasReachedLimit || freeUserReachedLimit
                  ? "Upgrade to Pro to continue..."
                  : "Ask anything from your syllabus, exams, startups, or even relationships"
              }
              className="w-full border-0 bg-transparent text-sm sm:text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 pb-0 mb-0 resize-none min-h-[40px] sm:min-h-[50px] font-normal"
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={hasReachedLimit || freeUserReachedLimit}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
                <button
                  onClick={() => setSelectedMode("explain")}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all font-medium whitespace-nowrap ${
                    selectedMode === "explain"
                      ? "bg-white text-black shadow-sm border border-gray-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                  disabled={hasReachedLimit || freeUserReachedLimit}
                >
                  <Lightbulb size={14} />
                  Explain
                </button>
                <button
                  onClick={() => setSelectedMode("practice")}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all font-medium whitespace-nowrap ${
                    selectedMode === "practice"
                      ? "bg-white text-black shadow-sm border border-gray-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                  disabled={hasReachedLimit || freeUserReachedLimit}
                >
                  <Edit3 size={14} />
                  Practice
                </button>
              </div>

              <div className="flex items-center justify-between sm:gap-3">
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  disabled={hasReachedLimit || freeUserReachedLimit}
                >
                  <SelectTrigger className="w-auto border-0 bg-transparent px-3 py-2 sm:px-4 sm:py-2.5 h-auto text-xs sm:text-sm font-medium hover:bg-white/50 rounded-full">
                    <SelectValue>{subjects.find((s) => s.value === selectedSubject)?.label}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-[180px] max-h-[300px] overflow-y-auto">
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  size="icon"
                  className={`rounded-full h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 transition-all shadow-sm ${sendButtonClass}`}
                  onClick={handleSendMessage}
                  disabled={!canSend}
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} />}
                </Button>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 sm:mt-4 px-2 leading-relaxed">
            By messaging <span className="font-medium text-gray-700">ExamGPT</span>, you agree to our{" "}
            <Link href="/terms" className="underline cursor-pointer hover:text-gray-700">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline cursor-pointer hover:text-gray-700">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Modals */}
      {showOnboarding && <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />}
      {showUpgrade && (
        <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} userId={user?.id || ""} />
      )}
      {showChatHistory && <ChatHistoryModal isOpen={showChatHistory} onClose={() => setShowChatHistory(false)} />}
    </div>
  )
}
