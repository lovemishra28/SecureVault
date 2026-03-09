# SecureVault - Personal Password Manager

A secure, modern Next.js application for storing and managing sensitive information like bank credentials, passwords, and personal documents.

Deployment Link: https://secure-vault-one-phi.vercel.app

## Features

- 🔒 **Secure Authentication** - User authentication with NextAuth.js and bcrypt password hashing
- 🔐 **End-to-End Encryption** - All sensitive data encrypted using AES-256-GCM
- 📂 **Category Organization** - Organize credentials into custom categories
- 🌓 **Dark/Light Theme** - Toggle between themes for comfortable viewing
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- 🔍 **Search Functionality** - Quickly find credentials
- 📋 **Copy to Clipboard** - One-click copy for usernames and passwords
- 👁️ **Password Visibility Toggle** - Show/hide passwords securely

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Encryption**: Node.js Crypto (AES-256-GCM)
- **Icons**: Font Awesome
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project folder)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The `.env.local` file is already created with default values. For production, update:
   - `NEXTAUTH_SECRET` - A secure random string (min 32 characters)
   - `ENCRYPTION_KEY` - A 32-character encryption key
   - `NEXTAUTH_URL` - Your production URL

4. **Initialize the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed with demo data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

After running the seed command, you can log in with:
- **Email**: demo@securevault.com
- **Password**: Demo@123

## Project Structure

```
SecureVault/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   ├── categories/     # Category CRUD
│   │   └── credentials/    # Credentials CRUD
│   ├── auth/
│   │   ├── signin/         # Sign in page
│   │   └── register/       # Registration page
│   ├── dashboard/          # Main dashboard
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── CategoryModal.tsx   # Add category modal
│   ├── CredentialCard.tsx  # Credential display card
│   ├── CredentialModal.tsx # Add/edit credential modal
│   ├── Header.tsx          # App header
│   ├── Providers.tsx       # Context providers
│   ├── Sidebar.tsx         # Category sidebar
│   └── ThemeToggle.tsx     # Theme switcher
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── encryption.ts       # Encryption utilities
│   └── prisma.ts           # Prisma client
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeder
├── types/
│   ├── index.ts            # Type definitions
│   └── next-auth.d.ts      # NextAuth type extensions
└── ...config files
```

## Security Features

### Encryption

All sensitive data (passwords, PINs, etc.) is encrypted using:
- **Algorithm**: AES-256-GCM
- **Key Derivation**: 32-byte key from environment variable
- **IV**: Random 16-byte initialization vector per encryption
- **Authentication Tag**: Ensures data integrity

### Password Hashing

User passwords are hashed using bcrypt with a cost factor of 12.

### Session Management

- JWT-based sessions via NextAuth.js
- 30-day session expiry
- Secure cookie handling

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/[...nextauth] | NextAuth authentication |
| GET | /api/categories | List user categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/[id] | Update category |
| DELETE | /api/categories/[id] | Delete category |
| GET | /api/credentials | List credentials |
| POST | /api/credentials | Create credential |
| GET | /api/credentials/[id] | Get single credential |
| PUT | /api/credentials/[id] | Update credential |
| DELETE | /api/credentials/[id] | Delete credential |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
```

## Production Deployment

1. Update environment variables for production
2. Use a production database (PostgreSQL recommended)
3. Update `DATABASE_URL` in `.env`
4. Run database migrations
5. Build and deploy

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Security Notice

⚠️ **Important**: 
- Never commit `.env.local` to version control
- Use strong, unique values for `NEXTAUTH_SECRET` and `ENCRYPTION_KEY`
- Regularly backup your database
- Enable 2FA when possible
