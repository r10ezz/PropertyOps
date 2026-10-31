import api from './api'
import type { ApiResponse } from '../types/common'
import type { Property, CreatePropertyInput, UpdatePropertyInput } from '../types/property'

export const propertyService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }) {
    const res = await api.get<ApiResponse<Property[]>>('/properties', { params })
    return res.data
  },

  async getById(id: number) {
    const res = await api.get<ApiResponse<Property>>(`/properties/${id}`)
    return res.data
  },

  async create(data: CreatePropertyInput) {
    const res = await api.post<ApiResponse<Property>>('/properties', data)
    return res.data
  },

  async update(id: number, data: UpdatePropertyInput) {
    const res = await api.put<ApiResponse<Property>>(`/properties/${id}`, data)
    return res.data
  },

  async delete(id: number) {
    const res = await api.delete<ApiResponse<null>>(`/properties/${id}`)
    return res.data
  },
}
