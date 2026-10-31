import api from './api'
import type { ApiResponse } from '../types/common'
import type { LoginCredentials, AuthData, User } from '../types/auth'

export const authService = {
  async login(credentials: LoginCredentials) {
    const res = await api.post<ApiResponse<AuthData>>('/auth/login', credentials)
    return res.data
  },

  async logout() {
    const res = await api.post<ApiResponse<null>>('/auth/logout')
    return res.data
  },

  async getMe() {
    const res = await api.get<ApiResponse<User>>('/auth/me')
    return res.data
  },
}
