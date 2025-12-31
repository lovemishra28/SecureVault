import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/encryption'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      },
    })

    // Create default categories for the new user
    await prisma.category.createMany({
      data: [
        { name: 'Bank Accounts', icon: 'building-columns', color: '#22c55e', userId: user.id },
        { name: 'Extra Documents', icon: 'file-lines', color: '#3b82f6', userId: user.id },
        { name: 'Social Media', icon: 'share-nodes', color: '#8b5cf6', userId: user.id },
        { name: 'Email Accounts', icon: 'envelope', color: '#ef4444', userId: user.id },
        { name: 'Government IDs', icon: 'id-card', color: '#f59e0b', userId: user.id },
      ],
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
