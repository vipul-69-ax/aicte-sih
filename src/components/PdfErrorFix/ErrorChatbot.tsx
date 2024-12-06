"use client"

import { useState } from 'react'
import { Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number
  role: 'user' | 'ai'
  content: string
}

export default function ErrorChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', content: 'Hello! I can help you understand the errors in your document. What would you like to know?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      const newUserMessage = { id: Date.now(), role: 'user' as const, content: input }
      setMessages(prev => [...prev, newUserMessage])
      setInput('')
      // Simulate AI response
      setTimeout(() => {
        const newAiMessage = { id: Date.now(), role: 'ai' as const, content: 'I understand your concern. Let me check the errors for you.' }
        setMessages(prev => [...prev, newAiMessage])
      }, 1000)
    }
  }

  return (
    <div className="container w-full mx-auto p-4 flex justify-center items-center min-h-screen">
      <Card className="w-full shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-medium">Error Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[50vh] p-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div 
                    className={`rounded-lg p-2 max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </motion.div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
