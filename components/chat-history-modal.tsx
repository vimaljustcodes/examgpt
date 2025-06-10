"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, MessageCircle, Trash2, Calendar } from "lucide-react"

interface ChatHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Chat {
  id: string
  title: string
  created_at: string
  messageCount: number
  preview: string
}

export function ChatHistoryModal({ isOpen, onClose }: ChatHistoryModalProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchChats()
    }
  }, [isOpen])

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats")
      const data = await response.json()
      setChats(data.chats || [])
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      await fetch(`/api/chats/${chatId}`, { method: "DELETE" })
      setChats(chats.filter((chat) => chat.id !== chatId))
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl mx-4 rounded-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Chat History</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No chat history yet</p>
              <p className="text-sm">Start a conversation to see your chats here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-black text-sm leading-tight line-clamp-2">{chat.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteChat(chat.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{chat.preview}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(chat.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      {chat.messageCount} messages
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
