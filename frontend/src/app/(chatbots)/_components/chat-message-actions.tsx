/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-03 19:47:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-04 16:08:54
 * @Description: 
 */
'use client'

import { type Message } from 'ai'

import { Button } from '../_components/ui/button'
import { IconCheck, IconCopy } from '../_components/ui/icons'
import { useCopyToClipboard } from '../_lib/hooks/use-copy-to-clipboard'
import { cn } from '../_lib/utils'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0',
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy}>
        {isCopied ? <IconCheck /> : <IconCopy />}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  )
}
