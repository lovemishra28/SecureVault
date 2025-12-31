import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, icon, color } = await request.json()

    // Verify ownership
    const existingCategory = await prisma.category.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: { name, icon, color },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
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
    const existingCategory = await prisma.category.findFirst({
      where: { id: params.id, userId: session.user.id },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
