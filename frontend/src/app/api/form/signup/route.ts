import { NextRequest, NextResponse } from 'next/server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const signupUrl = "https://id.steedos.cn/realms/master/protocol/openid-connect/registrations?client_id=builder6&scope=openid%20profile&redirect_uri=https://builder6.com/app/dashboard&response_type=code";


export function GET(request: NextRequest) {
  return redirect(signupUrl) // Navigate to the new post page
}