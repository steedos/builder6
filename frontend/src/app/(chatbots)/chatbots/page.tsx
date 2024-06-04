import { IconOpenAI } from "../_components/ui/icons"
import { getChats } from "../_lib/chat/appActions"
import { format, parseISO } from 'date-fns'
export const metadata = {
  title: 'AI Chatbot'
}

export interface ChatPageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: ChatPageProps) {
  const chats = await getChats()
  console.log(`chats=-`, chats)
  // 循环显示chats

return (
    <ul role="list" className="divide-y divide-gray-100">
      {chats.map((chat: any) => (
        <a href={`/chatbots/${chat.chatbotId}/${chat.id}`}>
        <li key={chat.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={chat.avatarUrl} alt="" /> */}
            <IconOpenAI className="h-12 w-12 flex-none rounded-full bg-gray-50" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{chat.title}</p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">{chat.model}</p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-gray-900">{chat.model}</p>
            <div className="mt-1 flex items-center gap-x-1.5">
                <p className="text-xs leading-5 text-gray-500">{format(parseISO(chat.createdAt), 'dd LLL, yyyy')}</p>
              </div>
          </div>
        </li>
        </a>
      ))}
    </ul>
  )
}
