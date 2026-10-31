import api from './api'
import type { ApiResponse } from '../types/common'
import type { Unit, CreateUnitInput, UpdateUnitInput, UnitStatus } from '../types/unit'

export const unitService = {
  async getAll(params?: {
    page?: number
    limit?: number
    propertyId?: number
    status?: UnitStatus
    search?: string
  }) {
    const res = await api.get<ApiResponse<Unit[]>>('/units', { params })
    return res.data
  },

  async getById(id: number) {
    const res = await api.get<ApiResponse<Unit>>(`/units/${id}`)
    return res.data
  },

  async create(data: CreateUnitInput) {
    const res = await api.post<ApiResponse<Unit>>('/units', data)
    return res.data
  },

  async update(id: number, data: UpdateUnitInput) {
    const res = await api.put<ApiResponse<Unit>>(`/units/${id}`, data)
    return res.data
  },

  async delete(id: number) {
    const res = await api.delete<ApiResponse<null>>(`/units/${id}`)
    return res.data
  },
}
