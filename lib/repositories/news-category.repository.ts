import { createClient } from "@/lib/supabase/server"
import type { CreateNewsCategoryDto, UpdateNewsCategoryDto, NewsCategoryResponseDto } from "@/lib/dto/news-category.dto"

export class NewsCategoryRepository {
  async findAll(limit = 50, offset = 0): Promise<NewsCategoryResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news_categories")
      .select("*")
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as NewsCategoryResponseDto[]
  }

  async findById(id: string): Promise<NewsCategoryResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news_categories")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as NewsCategoryResponseDto | null
  }

  async findBySlug(slug: string): Promise<NewsCategoryResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news_categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()

    if (error) throw error
    return data as NewsCategoryResponseDto | null
  }

  async create(categoryData: CreateNewsCategoryDto): Promise<NewsCategoryResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news_categories")
      .insert(categoryData)
      .select()
      .single()

    if (error) throw error
    return data as NewsCategoryResponseDto
  }

  async update(id: string, categoryData: UpdateNewsCategoryDto): Promise<NewsCategoryResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("news_categories")
      .update(categoryData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as NewsCategoryResponseDto
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("news_categories")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
