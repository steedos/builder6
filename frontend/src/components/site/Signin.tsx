"use client";

import { useEffect, useState, Fragment } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import { signIn, signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'


import { Button } from "./Button";

const signupUrl = "/api/form/signup";

function classNames(...classes : any[]) {
  return classes.filter(Boolean).join(' ')
}

const Loading = () => {
  return (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  )
}
export function SignIn() {
  const session = useSession();
  const authencated = session?.data?.user ? true : false;
  const name = session?.data?.user?.name;
  const avatarName = name?.charAt(0);
  return (
    <div className="flex justify-center gap-x-3">
      {authencated && (
        <>
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-sm font-medium leading-none text-white">{avatarName}</span>
                </span>
              </MenuButton>
            </div>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  {({ focus }) => (
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {session?.data?.user?.name} <br/>
                    {session?.data?.user?.email} 
                    </div>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <a
                      href="https://id.steedos.cn/realms/master/account/"
                      target="_blank"
                      className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                    >
                      我的账户
                    </a>
                  )}
                </MenuItem>
                {/* <MenuItem>
                  {({ focus }) => (
                    <a
                      href="#"
                      className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                    >
                      Settings
                    </a>
                  )}
                </MenuItem> */}
                <MenuItem>
                  {({ focus }) => (
                    <a
                      onClick={() => signOut()}
                      className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                    >
                      注销
                    </a>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </>
      )}
      {!authencated && session.status === 'unauthenticated' && (
        <>
        <Button onClick={() => signIn('keycloak', { redirectTo: "/app/dashboard" })} color="white">
          <span className="mx-2">
            登录
          </span>
        </Button> 
        <Button href={signupUrl} color="blue">
          <span className="mx-2">
            注册
          </span>
        </Button>
        </>
      )}

      {!authencated && session.status === 'loading' && (
        <Loading></Loading>
      )}
    </div>
  )
}