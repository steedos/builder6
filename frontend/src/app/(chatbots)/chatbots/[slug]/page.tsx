
import { nanoid } from '../../_lib/utils'
import { Chat } from '../../_components/chat'
import { auth } from '@/auth'
import { Session } from '../../_lib/types'
import { getMissingKeys } from '../../_lib/chat/actions'
import { AI } from '../../_lib/chat/actions'
import { getChatBot } from '../../_lib/chat/appActions'

export const metadata = {
  title: 'AI Chatbot'
}

export interface ChatPageProps {
  params: {
    slug: string
  }
}

export default async function IndexPage({ params }: ChatPageProps) {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()
  const userId = session.user.id as string
const chatbot = await getChatBot(params.slug, userId)

  return (
    <AI initialAIState={{ chatbot: chatbot, chatId: id, messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
