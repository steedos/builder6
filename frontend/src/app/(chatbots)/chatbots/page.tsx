import { IconOpenAI } from "../_components/ui/icons"
import { getChats, getChatBots } from "../_lib/chat/appActions"
import { format, parseISO } from 'date-fns'
import { auth } from "@/auth"
import { Session } from '../_lib/types'
import { redirect } from "next/navigation"
export const metadata = {
  title: 'AI Chatbot'
}

export interface ChatPageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: ChatPageProps) {

  const session = (await auth()) as Session
  if (!session?.user) {
    redirect(`/login`)
  }


  const chatbots = await getChatBots()
  const chats = await getChats()
  console.log(`chatbots=-`, chatbots)
  // 循环显示chats

return (
    <div className="m-4">
      <h1>Chatbot List</h1>
      <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {chatbots.map((chatbot: any, index) => (
            <a href={`/chatbots/${chatbot._id}`}>
              <div
                key={chatbot._id}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                // onClick={async () => {
                //   // setMessages(currentMessages => [
                //   //   ...currentMessages,
                //   //   {
                //   //     id: nanoid(),
                //   //     display: <UserMessage>{example.message}</UserMessage>
                //   //   }
                //   // ])

                //   // const responseMessage = await submitUserMessage(
                //   //   example.message
                //   // )

                //   // setMessages(currentMessages => [
                //   //   ...currentMessages,
                //   //   responseMessage
                //   // ])
                // }}
              >

              <div className="flex min-w-0 gap-x-4">
                {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={chatbot.avatarUrl} alt="" /> */}
                <IconOpenAI className="h-12 w-12 flex-none rounded-full bg-gray-50" />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{chatbot.name}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">{chatbot.model}</p>
                </div>chatbot
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">{chatbot.placeholderl}</p>
              </div>
                
              </div>
              </a>
            ))}
        </div>  
    <h1>Chat List</h1>
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
    </div>
  )
}