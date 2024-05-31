/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-31 02:59:06
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-31 06:09:26
 * @FilePath: /builder6/frontend/src/app/api/revalidate/route.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NextRequest, NextResponse } from 'next/server'

import { revalidatePath } from 'next/cache'



export function POST(request: NextRequest) {
  revalidatePath("/");
  return NextResponse.json({});
}

export function GET(request: NextRequest) {
  revalidatePath("/");
  return NextResponse.json({});
}