export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  meta?: PaginationMeta
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}
