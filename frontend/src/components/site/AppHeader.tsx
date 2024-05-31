"use client";

import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  CurrencyYenIcon,
  InboxArrowDownIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon,  } from '@heroicons/react/20/solid'

import { Logo } from './Logo';
import { SignIn } from '../Signin';
import Icon from './Icon';

const products = [
  { name: 'AI Chat', description: '基于人工智能的聊天系统', href: '/ai-chat', icon: CurrencyYenIcon },
  { name: 'AI 自动化', description: '基于AI的自动化工具，AI与业务系统融合', href: '/ai-automation', icon: BoltIcon },
  { name: 'AI 营销', description: '自动化生成和发送营销短信和邮件', href: '/ai-marketing', icon: BoltIcon },
  { name: 'AI 助手', description: '在线训练、生成你的AI助手', href: '/ai-agents', icon: ArrowTrendingUpIcon },
]

function classNames(...classes:any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-black/5 border-b border-b-black/10">
      <nav className="mx-auto flex items-center justify-between p-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/app/dashboard" className="-m-1.5 p-1.5">
            <Logo className="h-8 w-auto" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center justify-center">
          <a href="/app/dashboard" className="font-semibold leading-6 text-gray-900 mr-4">
            <Icon type="utility" name="apps" className="mt-2 slds-icon_small !fill-gray-700"></Icon>
          </a>
          <SignIn/>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">灵犀</span>
              <Logo className="h-10 w-auto" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="py-6">
                <SignIn/>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

    </header>
  )
}
