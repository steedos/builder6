import { NextRequest, NextResponse } from 'next/server'

import { revalidatePath } from 'next/cache'



export function POST(request: NextRequest) {
    
  revalidatePath("/interfaces");
  return Response.json({});
}

export function GET(request: NextRequest) {
    revalidatePath("/interfaces");
    return Response.json({});
}