
import { nanoid } from '../../_lib/utils'
import { Chat } from '../../_components/chat'
import { auth } from '@/auth'
import { Session } from '../../_lib/types'
import { getMissingKeys } from '../../_lib/chat/actions'
import { AI } from '../../_lib/chat/actions'
import { getChatBot } from '../../_lib/chat/appActions'
import { redirect } from 'next/navigation'

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
  const chatbot = await getChatBot(params.slug)
  // console.log(`set messages chatbot.defaultMessage`, params.slug, chatbot)
  const defaultMessage : any =  chatbot.defaultMessageMode === 'static'  ? [
    {
      id: nanoid(),
      role: 'assistant',
      content: chatbot.defaultMessage
    }] : []
  console.log(`in /chatbots/${params.slug}/page.tsx`)
  return (
    <AI initialAIState={{ chatbot: chatbot, chatId: id, messages: defaultMessage }}>
      <Chat id={id} missingKeys={missingKeys} /> 
    </AI>
  )
}
