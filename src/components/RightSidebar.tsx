"use client"

import { LucideLanguages } from "lucide-react"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ui/conversation"
import { Message, MessageContent } from "@/components/ui/message"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cleanText } from "@/lib/utils"
import SidebarHeader from "./SidebarHeader"
import { useAudioStore } from "@/store/useAudioStore"

function RightSidebar() {
  const { transcript: items } = useAudioStore()
  // const items: { text: string; isPartial: boolean; sender: string }[] = [
  //   { text: "Hii", isPartial: false, sender: "user" },
  //   { text: "I'm Vanni AI Assistant", isPartial: false, sender: "assistant" },
  // ];

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <SidebarHeader icon={LucideLanguages} title="Transcript" />

      <div className="relative flex-1 overflow-hidden">
        <Conversation className="h-full overflow-y-auto px-3 py-3">
          <ConversationContent className="gap-3">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center opacity-50">
                <ConversationEmptyState
                  title=""
                  description="Start speaking..."
                  className="text-center text-xs"
                />
              </div>
            ) : (
              items.map((message, i) => {
                const cleanedText = cleanText(message.text)
                if (!cleanedText && !message.isPartial) return null
                const isUser = message.sender === "user"
                return (
                  <Message key={i} from={isUser ? "user" : "assistant"}>
                    <MessageContent
                      className={
                        !isUser
                          ? "rounded-lg bg-primary px-4 py-3 text-primary-foreground"
                          : undefined
                      }
                    >
                      {cleanedText}
                      {message.isPartial && !isUser && (
                        <span className="ml-1 inline-block h-1.5 w-1.5 animate-bounce rounded-full align-baseline opacity-60" />
                      )}
                    </MessageContent>

                    {!isUser && (
                      <Avatar className="size-7 ring-1 ring-border">
                        <AvatarImage src="/logo.png" alt="Vanni" />
                        <AvatarFallback>Va</AvatarFallback>
                      </Avatar>
                    )}
                  </Message>
                )
              })
            )}
          </ConversationContent>
        </Conversation>
      </div>
    </aside>
  )
}

export default RightSidebar
