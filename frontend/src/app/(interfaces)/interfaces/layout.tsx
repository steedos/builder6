/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-04 00:52:48
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-05 03:41:40
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getMainHeadCss, getMainHeadJs } from '../_lib/amis-sdk';
import { auth } from '@/auth';

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const user = session && session.user || {};
  return (
    <>
      {getMainHeadCss()}
      {getMainHeadJs()}
      {
        children
      }
    </>
  )
}