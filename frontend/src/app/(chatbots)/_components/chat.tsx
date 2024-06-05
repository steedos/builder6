'use client'

import { cn } from '../_lib/utils'
import { ChatList } from '../_components/chat-list'
import { ChatPanel } from '../_components/chat-panel'
import { EmptyScreen } from '../_components/empty-screen'
import { useLocalStorage } from '../_lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { useUIState, useAIState } from 'ai/rsc'
import { Message, Session } from '../_lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '../_lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({ id, className, session, missingKeys }: ChatProps) {
  // const router = useRouter()
  // const path = usePathname()
  const [input, setInput] = useState('')
  const [messages] = useUIState()
  // const [aiState] = useAIState()

  console.log(`Chat messages===>`, messages)

  // useEffect(() => {
  //   const messagesLength = aiState.messages?.length
  //   if (messagesLength === 2) {
  //     router.refresh()
  //   }
  // }, [aiState.messages, router])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn('pb-[200px] pt-4 md:pt-10', className)}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList messages={messages} isShared={false} session={session} />
        ) : (
          <EmptyScreen />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  )
}
