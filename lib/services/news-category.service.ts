import { NewsCategoryRepository } from "@/lib/repositories/news-category.repository"
import type { CreateNewsCategoryDto, UpdateNewsCategoryDto } from "@/lib/dto/news-category.dto"

export class NewsCategoryService {
  private repository: NewsCategoryRepository

  constructor() {
    this.repository = new NewsCategoryRepository()
  }

  async getAllCategories(limit = 50, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getCategoryById(id: string) {
    const category = await this.repository.findById(id)
    if (!category) {
      throw new Error("News category not found")
    }
    return category
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.repository.findBySlug(slug)
    if (!category) {
      throw new Error("News category not found")
    }
    return category
  }

  async createCategory(categoryData: CreateNewsCategoryDto) {
    const existing = await this.repository.findBySlug(categoryData.slug)
    if (existing) {
      throw new Error("Category with this slug already exists")
    }
    return await this.repository.create(categoryData)
  }

  async updateCategory(id: string, categoryData: UpdateNewsCategoryDto) {
    const category = await this.repository.findById(id)
    if (!category) {
      throw new Error("News category not found")
    }

    if (categoryData.slug) {
      const existing = await this.repository.findBySlug(categoryData.slug)
      if (existing && existing.id !== id) {
        throw new Error("Slug already in use")
      }
    }

    return await this.repository.update(id, categoryData)
  }

  async deleteCategory(id: string) {
    const category = await this.repository.findById(id)
    if (!category) {
      throw new Error("News category not found")
    }
    await this.repository.delete(id)
  }
}
