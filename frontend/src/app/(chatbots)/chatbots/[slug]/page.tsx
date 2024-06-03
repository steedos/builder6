import { nanoid } from '../../_lib/utils'
import { Chat } from '../../_components/chat'
import { auth } from '@/auth'
import { Session } from '../../_lib/types'
import { getMissingKeys } from '../../_lib/chat/actions'
import { AI } from '../../_lib/chat/actions'

export const metadata = {
  title: 'AI Chatbot'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  return (
    
   <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
