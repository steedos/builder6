import { nanoid } from '../../_lib/utils'
import { Chat } from '../../_components/chat'
import { auth } from '@/auth'
import { Session } from '../../_lib/types'
import { getMissingKeys } from '../../_lib/chat/actions'
import { AI } from '../../_lib/chat/actions'
import { notFound, redirect } from 'next/navigation'

import { getChat } from '../../_lib/chat/appActions'

export const metadata = {
  title: 'AI Chatbot'
}
export interface ChatPageProps {
  params: {
    slug: string
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

  console.log(`params===>`, params)

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.slug}`)
  }

  const userId = session.user.id as string
  const chat = await getChat(params.slug, userId)

  if (!chat) {
    redirect('/chatbots')
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat
        id={chat.id}
        session={session}
        initialMessages={chat.messages}
        missingKeys={missingKeys}
      />
    </AI>
  )
}