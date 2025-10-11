import { NextRequest } from "next/server"

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "20")

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    offset: (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit)),
  }
}

export interface SortParams {
  sortBy: string
  sortOrder: "asc" | "desc"
}

export function getSortParams(request: NextRequest, defaultSortBy = "created_at"): SortParams {
  const url = new URL(request.url)
  const sortBy = url.searchParams.get("sortBy") || defaultSortBy
  const sortOrder = (url.searchParams.get("sortOrder") || "desc") as "asc" | "desc"

  return {
    sortBy,
    sortOrder: sortOrder === "asc" ? "asc" : "desc",
  }
}

export interface FilterParams {
  [key: string]: string | string[]
}

export function getFilterParams(request: NextRequest, allowedFilters: string[]): FilterParams {
  const url = new URL(request.url)
  const filters: FilterParams = {}

  for (const filter of allowedFilters) {
    const value = url.searchParams.get(filter)
    if (value) {
      filters[filter] = value
    }
  }

  return filters
}

export function getSearchParam(request: NextRequest): string | null {
  const url = new URL(request.url)
  return url.searchParams.get("search") || url.searchParams.get("q")
}
