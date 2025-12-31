import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encryptObject, decryptObject } from '@/lib/encryption'
import { EncryptedData } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const where: { userId: string; categoryId?: string } = {
      userId: session.user.id
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const credentials = await prisma.credential.findMany({
      where,
      include: { category: true },
      orderBy: { title: 'asc' },
    })

    // Decrypt sensitive data for each credential
    const decryptedCredentials = credentials.map((cred) => {
      try {
        const sensitiveData = decryptObject<EncryptedData>(cred.encryptedData)
        return {
          ...cred,
          sensitiveData,
          encryptedData: undefined, // Don't send encrypted string to client
        }
      } catch {
        return {
          ...cred,
          sensitiveData: {},
          encryptedData: undefined,
        }
      }
    })

    return NextResponse.json(decryptedCredentials)
  } catch (error) {
    console.error('Error fetching credentials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credentials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, website, username, customerId, categoryId, notes, sensitiveData } = body

    if (!title || !categoryId) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      )
    }

    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: session.user.id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Encrypt sensitive data
    const encryptedData = encryptObject(sensitiveData || {})

    const credential = await prisma.credential.create({
      data: {
        title,
        description,
        website,
        username,
        customerId,
        encryptedData,
        notes,
        categoryId,
        userId: session.user.id,
      },
      include: { category: true },
    })

    return NextResponse.json(credential, { status: 201 })
  } catch (error) {
    console.error('Error creating credential:', error)
    return NextResponse.json(
      { error: 'Failed to create credential' },
      { status: 500 }
    )
  }
}
