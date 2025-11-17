export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'MANAGER'
  createdAt: Date
  updatedAt: Date
}

export interface AuthenticatedRequest extends Request {
  user?: User
}