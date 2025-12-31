import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'

// Set environment variables directly for this script
process.env.DATABASE_URL = 'file:./dev.db'
process.env.ENCRYPTION_KEY = 'S3cur3VaultKey2024Protect1234'

const prisma = new PrismaClient()

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY || 'S3cur3VaultKey2024Protect1234'
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
  console.log('🔐 Importing bank data for user...')

  const userEmail = 'mishraluv99@gmail.com'
  const userPassword = '@smile100years'

  // Find or create the user
  let user = await prisma.user.findUnique({
    where: { email: userEmail }
  })

  if (!user) {
    console.log('📝 Creating new user...')
    const hashedPassword = await bcrypt.hash(userPassword, 12)
    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: 'Love Mishra',
        password: hashedPassword,
      }
    })
    console.log('✅ Created user:', user.email)
  } else {
    console.log('✅ Found existing user:', user.email)
  }

  // Create categories
  const bankCategory = await prisma.category.upsert({
    where: { name_userId: { name: 'Bank Accounts', userId: user.id } },
    update: {},
    create: { name: 'Bank Accounts', icon: 'building-columns', color: '#22c55e', userId: user.id },
  })

  const extraDocsCategory = await prisma.category.upsert({
    where: { name_userId: { name: 'Extra Documents', userId: user.id } },
    update: {},
    create: { name: 'Extra Documents', icon: 'file-lines', color: '#3b82f6', userId: user.id },
  })

  console.log('✅ Created categories')

  // Bank Accounts Data from HTML
  const bankCredentials = [
    {
      title: 'HDFC Bank',
      description: 'HDFC Netbanking',
      website: 'https://netbanking.hdfcbank.com/netbanking/',
      customerId: '137396971',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Securemishr@137',
      }),
      notes: 'HDFC Bank Netbanking Account',
    },
    {
      title: 'SBI Bank',
      description: 'SBI Netbanking',
      website: 'https://retail.onlinesbi.sbi/retail/login.htm',
      username: 'Securesheshamni82',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Mishra@137',
        alternatePassword: 'Sheshmani@#1982',
      }),
      notes: 'SBI Bank Netbanking - Has alternate password',
    },
    {
      title: 'PNB [Sheshmani Mishra]',
      description: 'Punjab National Bank - Sheshmani Mishra',
      website: 'https://netbanking.netpnb.com/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&__FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=024',
      customerId: 'R02090532',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Love@2004',
        transactionPassword: 'sheshmani@1982',
      }),
      notes: 'PNB Netbanking - Sheshmani Mishra Account',
    },
    {
      title: 'PNB [Sunila Mishra]',
      description: 'Punjab National Bank - Sunila Mishra',
      website: 'https://netbanking.netpnb.com/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&__FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=024',
      customerId: 'R34542280',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Janvi@2008',
        transactionPassword: 'Love@2004',
        smsPassword: '1983',
        tpin: '2005',
      }),
      notes: 'PNB Netbanking - Sunila Mishra Account',
    },
    {
      title: 'Canara Bank [Sunila Mishra]',
      description: 'Canara Bank - Sunila Mishra',
      website: 'https://online.canarabank.in/?module=login',
      customerId: '90113341',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Secure@1983',
        transactionPassword: 'Secure@500',
        atmPin: '0764',
      }),
      notes: 'Canara Bank - Sunila Mishra Account',
    },
    {
      title: 'Canara Bank [Sheshmani Mishra]',
      description: 'Canara Bank - Sheshmani Mishra',
      website: 'https://online.canarabank.in/?module=login',
      username: '28143397',
      customerId: '28143397',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Secure@m1982',
        transactionPassword: 'NewSecure18',
      }),
      notes: 'Canara Bank - Sheshmani Mishra Account (User ID same as Customer ID)',
    },
    {
      title: 'PNB [Love Mishra]',
      description: 'Punjab National Bank - Love Mishra',
      website: 'https://netbanking.netpnb.com/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&__FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=1&BANK_ID=024',
      customerId: 'R47579989',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Dream@100',
        transactionPassword: 'Lovemishra@16',
        smsPassword: '2004',
        tpin: '2005',
        mpin: '1604',
      }),
      notes: 'PNB Netbanking - Love Mishra Account',
    },
    {
      title: 'SBI [Love Mishra]',
      description: 'SBI Bank - Love Mishra',
      website: 'https://retail.onlinesbi.sbi/retail/login.htm',
      username: 'UserLove2005',
      categoryId: bankCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'SecureLove@2005',
        profilePassword: 'Lovemishra@2004',
        mpin: '162005',
      }),
      notes: 'SBI Bank - Love Mishra Personal Account',
    },
  ]

  // Extra Documents Data from HTML
  const extraDocsCredentials = [
    {
      title: 'EPF Portal',
      description: 'Employee Provident Fund Portal',
      website: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/',
      username: '101188302068',
      categoryId: extraDocsCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Sheshmani@#1982',
        customFields: [
          { key: 'UAN', value: '101188302068' },
        ],
      }),
      notes: 'EPF/UAN Portal Login',
    },
    {
      title: 'IRCTC',
      description: 'Indian Railways Ticket Booking',
      website: 'https://www.irctc.co.in/nget/train-search',
      username: 'Lovemishra16',
      categoryId: extraDocsCategory.id,
      userId: user.id,
      encryptedData: encryptObject({
        loginPassword: 'Irctc@Love1605',
      }),
      notes: 'IRCTC Train Booking Account',
    },
  ]

  // Delete existing credentials for this user (to avoid duplicates on re-run)
  await prisma.credential.deleteMany({
    where: { userId: user.id }
  })
  console.log('🗑️  Cleared existing credentials')

  // Insert all bank credentials
  for (const cred of bankCredentials) {
    await prisma.credential.create({ data: cred })
    console.log(`✅ Added: ${cred.title}`)
  }

  // Insert all extra docs credentials
  for (const cred of extraDocsCredentials) {
    await prisma.credential.create({ data: cred })
    console.log(`✅ Added: ${cred.title}`)
  }

  console.log('\n🎉 Successfully imported all data!')
  console.log(`📊 Total credentials added: ${bankCredentials.length + extraDocsCredentials.length}`)
  console.log(`   - Bank Accounts: ${bankCredentials.length}`)
  console.log(`   - Extra Documents: ${extraDocsCredentials.length}`)
  console.log(`\n🔐 Login with:`)
  console.log(`   Email: ${userEmail}`)
  console.log(`   Password: ${userPassword}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
