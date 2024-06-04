'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { type Chat } from '../../_lib/types'

import { getRecord, updateRecord, getRecords } from '@/lib/b6CloudDB'

const kv: any = {}

const CHATBOT_OBJECT = "b6_chatbots"

const CHATBOT_MESSAGES_OBJECT = "b6_chatbots_sessions";

export async function getChatBot(id: string, userId: string) {
  const chatBot = await getRecord(CHATBOT_OBJECT, id);
  if (!chatBot || (userId && chatBot.userId !== userId)) {
    return null
  }

  return chatBot
}

export async function getChats(userId?: string | null) {
  // TODO
  // if (!userId) {
  //   return []
  // }
  try {
    const chats: string[] = await getRecords(CHATBOT_MESSAGES_OBJECT);
    return chats
  } catch (error) {
    console.log(`error`, error)
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await getRecord(CHATBOT_MESSAGES_OBJECT, id);
  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  //Convert uid to string for consistent comparison with session.user.id
  const uid = String(await kv.hget(`chat:${id}`, 'userId'))

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${session.user.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  // const chat = await kv.hgetall<Chat>(`chat:${id}`)

  // if (!chat || !chat.sharePath) {
  //   return null
  // }

  // return chat
}

export async function shareChat(id: string) {
  // const session = await auth()

  // if (!session?.user?.id) {
  //   return {
  //     error: 'Unauthorized'
  //   }
  // }

  // const chat = await kv.hgetall<Chat>(`chat:${id}`)

  // if (!chat || chat.userId !== session.user.id) {
  //   return {
  //     error: 'Something went wrong'
  //   }
  // }

  // const payload = {
  //   ...chat,
  //   sharePath: `/share/${chat.id}`
  // }

  // await kv.hmset(`chat:${chat.id}`, payload)

  // return payload
}

export async function saveChat(chat: Chat) {
  const session = await auth()

  if (session && session.user) {
    await updateRecord(CHATBOT_MESSAGES_OBJECT, chat.id, chat as any)
  } else {
    return
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}
