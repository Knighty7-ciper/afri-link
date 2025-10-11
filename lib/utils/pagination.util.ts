export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export function getPaginationParams(
  page: number | string | undefined,
  limit: number | string | undefined,
  defaultLimit = 20,
  maxLimit = 100
): { page: number; limit: number; offset: number } {
  const parsedPage = Math.max(1, parseInt(String(page || 1)))
  const parsedLimit = Math.min(maxLimit, Math.max(1, parseInt(String(limit || defaultLimit))))
  const offset = (parsedPage - 1) * parsedLimit

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset,
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}
