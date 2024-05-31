import { NextRequest, NextResponse } from 'next/server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const url = "https://sp0dtpsxxk.jiandaoyun.com/f/660a2de0b0a76aafa09bde68";


export function GET(request: NextRequest) {
  return redirect(url) // Navigate to the new post page
}