import { createClient } from "@/lib/supabase/server"
import type { CreateNewsDto, UpdateNewsDto, NewsResponseDto } from "@/lib/dto/news.dto"

export class NewsRepository {
  async findAll(limit = 50, offset = 0): Promise<NewsResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as NewsResponseDto[]
  }

  async findById(id: string): Promise<NewsResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as NewsResponseDto | null
  }

  async findPublished(limit = 50, offset = 0): Promise<NewsResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as NewsResponseDto[]
  }

  async findByCategory(categoryId: string, limit = 50, offset = 0): Promise<NewsResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("category_id", categoryId)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as NewsResponseDto[]
  }

  async findByAuthor(authorId: string, limit = 50, offset = 0): Promise<NewsResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("author_id", authorId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as NewsResponseDto[]
  }

  async create(newsData: CreateNewsDto): Promise<NewsResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news")
      .insert(newsData)
      .select()
      .single()

    if (error) throw error
    return data as NewsResponseDto
  }

  async update(id: string, newsData: UpdateNewsDto): Promise<NewsResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news")
      .update(newsData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as NewsResponseDto
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  async count(): Promise<number> {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from("news")
      .select("*", { count: "exact", head: true })

    if (error) throw error
    return count || 0
  }
}
