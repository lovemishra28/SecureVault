import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY || 'S3cur3VaultKey2024Protect1234'
  // Ensure exactly 32 bytes for AES-256
  const keyBuffer = Buffer.alloc(32)
  Buffer.from(key, 'utf-8').copy(keyBuffer)
  return keyBuffer
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = getKey()
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const tag = cipher.getAuthTag()
  
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
}

function encryptObject(obj: Record<string, unknown>): string {
  return encrypt(JSON.stringify(obj))
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo@123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@securevault.com' },
    update: {},
    create: {
      email: 'demo@securevault.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name_userId: { name: 'Bank Accounts', userId: user.id } },
      update: {},
      create: { name: 'Bank Accounts', icon: 'building-columns', color: '#22c55e', userId: user.id },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Extra Documents', userId: user.id } },
      update: {},
      create: { name: 'Extra Documents', icon: 'file-lines', color: '#3b82f6', userId: user.id },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Social Media', userId: user.id } },
      update: {},
      create: { name: 'Social Media', icon: 'share-nodes', color: '#8b5cf6', userId: user.id },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Email Accounts', userId: user.id } },
      update: {},
      create: { name: 'Email Accounts', icon: 'envelope', color: '#ef4444', userId: user.id },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Government IDs', userId: user.id } },
      update: {},
      create: { name: 'Government IDs', icon: 'id-card', color: '#f59e0b', userId: user.id },
    }),
  ])

  console.log('✅ Created', categories.length, 'categories')

  const bankCategory = categories[0]
  const extraDocsCategory = categories[1]
  const socialCategory = categories[2]
  const emailCategory = categories[3]
  const govCategory = categories[4]

  // Create sample credentials
  const credentials = [
    // Bank Accounts
    {
      title: 'HDFC Bank',
      description: 'Primary savings account',
      website: 'https://netbanking.hdfcbank.com',
      username: 'hdfc_user123',
      customerId: 'CUST123456789',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'SecurePass@123',
        transactionPassword: 'TxnPass@456',
        atmPin: '1234',
        mpin: '567890',
        secretQuestion: 'What is your pet name?',
        secretAnswer: 'Buddy',
      }),
      notes: 'Main salary account',
    },
    {
      title: 'SBI Bank',
      description: 'Secondary savings account',
      website: 'https://onlinesbi.sbi',
      username: 'sbi_user456',
      customerId: 'SBI987654321',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'SBIPass@789',
        transactionPassword: 'SBITxn@321',
        atmPin: '5678',
        upiPin: '123456',
      }),
      notes: 'Joint account with spouse',
    },
    {
      title: 'ICICI Bank',
      description: 'Credit card account',
      website: 'https://infinity.icicibank.com',
      username: 'icici_card_user',
      customerId: 'ICICI456789',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'ICICI@Pass123',
        pin: '9876',
        customFields: [
          { key: 'Card Number', value: '**** **** **** 1234' },
          { key: 'CVV', value: '***' },
        ],
      }),
      notes: 'Amazon Pay credit card',
    },
    // Extra Documents
    {
      title: 'IRCTC',
      description: 'Indian Railways ticket booking',
      website: 'https://www.irctc.co.in',
      username: 'train_traveler',
      categoryId: extraDocsCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'TrainPass@2024',
      }),
      notes: 'Use for Tatkal bookings',
    },
    {
      title: 'EPF Portal',
      description: 'Employee Provident Fund',
      website: 'https://unifiedportal-mem.epfindia.gov.in',
      username: 'UAN123456789',
      categoryId: extraDocsCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'EPF@Secure123',
        customFields: [
          { key: 'UAN', value: '123456789012' },
          { key: 'PF Number', value: 'MH/12345/67890' },
        ],
      }),
    },
    {
      title: 'DigiLocker',
      description: 'Digital document storage',
      website: 'https://digilocker.gov.in',
      username: 'digilocker_user',
      categoryId: extraDocsCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Digi@Lock2024',
        pin: '1234',
      }),
      notes: 'Linked with Aadhaar',
    },
    // Social Media
    {
      title: 'LinkedIn',
      description: 'Professional networking',
      website: 'https://linkedin.com',
      username: 'professional.email@gmail.com',
      categoryId: socialCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'LinkedIn@Pro2024',
      }),
    },
    {
      title: 'Twitter/X',
      description: 'Social media',
      website: 'https://twitter.com',
      username: '@myhandle',
      categoryId: socialCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Tweet@Secure123',
      }),
    },
    // Email
    {
      title: 'Gmail - Primary',
      description: 'Primary email account',
      website: 'https://gmail.com',
      username: 'myemail@gmail.com',
      categoryId: emailCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Gmail@Primary2024',
        customFields: [
          { key: 'Recovery Email', value: 'recovery@email.com' },
          { key: 'Recovery Phone', value: '+91-XXXXXXXXXX' },
        ],
      }),
      notes: '2FA enabled with authenticator app',
    },
    // Government IDs
    {
      title: 'Aadhaar',
      description: 'UIDAI Aadhaar card',
      website: 'https://uidai.gov.in',
      customerId: 'XXXX XXXX 1234',
      categoryId: govCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        customFields: [
          { key: 'Aadhaar Number', value: '**** **** 1234' },
          { key: 'VID', value: '**** **** **** 5678' },
        ],
      }),
    },
    {
      title: 'PAN Card',
      description: 'Income Tax PAN',
      website: 'https://incometax.gov.in',
      customerId: 'ABCDE1234F',
      categoryId: govCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'ITR@Portal2024',
        customFields: [
          { key: 'PAN Number', value: 'ABCDE1234F' },
        ],
      }),
      notes: 'Linked with Aadhaar',
    },
  ]

  for (const cred of credentials) {
    await prisma.credential.create({
      data: cred,
    })
  }

  console.log('✅ Created', credentials.length, 'sample credentials')
  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('📧 Demo Login Credentials:')
  console.log('   Email: demo@securevault.com')
  console.log('   Password: Demo@123')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
