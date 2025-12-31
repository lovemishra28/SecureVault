export interface EncryptedData {
  loginPassword?: string
  transactionPassword?: string
  smsPassword?: string
  pin?: string
  atmPin?: string
  upiPin?: string
  mpin?: string
  secretQuestion?: string
  secretAnswer?: string
  customFields?: { key: string; value: string }[]
}

export interface Credential {
  id: string
  title: string
  description?: string | null
  website?: string | null
  username?: string | null
  customerId?: string | null
  encryptedData?: string
  sensitiveData: EncryptedData
  notes?: string | null
  categoryId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  category?: Category
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  userId: string
  createdAt: Date
  updatedAt: Date
  credentials?: Credential[]
}

export interface CredentialFormData {
  title: string
  description?: string
  website?: string
  username?: string
  customerId?: string
  categoryId: string
  notes?: string
  sensitiveData: EncryptedData
}
