/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-04 11:01:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-05 14:39:38
 * @Description: 
 */
import { nanoid } from '../../../_lib/utils'
import { Chat } from '../../../_components/chat'
import { auth } from '@/auth'
import { Session } from '../../../_lib/types'
import { getMissingKeys } from '../../../_lib/chat/actions'
import { AI } from '../../../_lib/chat/actions'
import { notFound, redirect } from 'next/navigation'

import { getChat, getChatBot } from '../../../_lib/chat/appActions'

export const metadata = {
  title: 'AI Chatbot'
}
export interface ChatPageProps {
  params: {
    slug: string
    chatId: string
  }
}

// export default async function IndexPage() {
//   const id = nanoid()
//   const session = (await auth()) as Session
//   const missingKeys = await getMissingKeys()

//   return (
    
//    <AI initialAIState={{ chatId: id, messages: [] }}>
//       <Chat id={id} session={session} missingKeys={missingKeys} />
//     </AI>
//   )
// }


export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  const chatbot = await getChatBot(params.slug)
  const chat = await getChat(params.chatId)


  console.log(`set messages ChatPage=========`)

  if (!chat) {
    redirect('/chatbots')
  }

  return (
    <AI initialAIState={{ chatbot: chatbot, chatId: chat.id, messages: chat.messages }}>
      <Chat
        id={chat.id}
        session={session}
        initialMessages={chat.messages}
        missingKeys={missingKeys}
      />
    </AI>
  )
}