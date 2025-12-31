import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encryptObject, decryptObject } from '@/lib/encryption'
import { EncryptedData } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const credential = await prisma.credential.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { category: true },
    })

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    // Decrypt sensitive data
    const sensitiveData = decryptObject<EncryptedData>(credential.encryptedData)

    return NextResponse.json({
      ...credential,
      sensitiveData,
      encryptedData: undefined,
    })
  } catch (error) {
    console.error('Error fetching credential:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credential' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const existingCredential = await prisma.credential.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!existingCredential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, website, username, customerId, categoryId, notes, sensitiveData } = body

    // If category is being changed, verify new category belongs to user
    if (categoryId && categoryId !== existingCredential.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId: session.user.id },
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
    }

    // Encrypt sensitive data
    const encryptedData = encryptObject(sensitiveData || {})

    const credential = await prisma.credential.update({
      where: { id: params.id },
      data: {
        title,
        description,
        website,
        username,
        customerId,
        encryptedData,
        notes,
        categoryId,
      },
      include: { category: true },
    })

    return NextResponse.json(credential)
  } catch (error) {
    console.error('Error updating credential:', error)
    return NextResponse.json(
      { error: 'Failed to update credential' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const existingCredential = await prisma.credential.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!existingCredential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    await prisma.credential.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Credential deleted successfully' })
  } catch (error) {
    console.error('Error deleting credential:', error)
    return NextResponse.json(
      { error: 'Failed to delete credential' },
      { status: 500 }
    )
  }
}
