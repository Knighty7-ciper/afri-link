import { NewsRepository } from "@/lib/repositories/news.repository"
import type { CreateNewsDto, UpdateNewsDto } from "@/lib/dto/news.dto"

export class NewsService {
  private repository: NewsRepository

  constructor() {
    this.repository = new NewsRepository()
  }

  async getAllNews(limit = 50, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getPublishedNews(limit = 50, offset = 0) {
    return await this.repository.findPublished(limit, offset)
  }

  async getNewsById(id: string) {
    const news = await this.repository.findById(id)
    if (!news) {
      throw new Error("News not found")
    }
    return news
  }

  async getNewsByCategory(categoryId: string, limit = 50, offset = 0) {
    return await this.repository.findByCategory(categoryId, limit, offset)
  }

  async getNewsByAuthor(authorId: string, limit = 50, offset = 0) {
    return await this.repository.findByAuthor(authorId, limit, offset)
  }

  async createNews(newsData: CreateNewsDto) {
    return await this.repository.create(newsData)
  }

  async updateNews(id: string, newsData: UpdateNewsDto) {
    const news = await this.repository.findById(id)
    if (!news) {
      throw new Error("News not found")
    }
    return await this.repository.update(id, newsData)
  }

  async publishNews(id: string) {
    return await this.updateNews(id, { published: true })
  }

  async unpublishNews(id: string) {
    return await this.updateNews(id, { published: false })
  }

  async deleteNews(id: string) {
    const news = await this.repository.findById(id)
    if (!news) {
      throw new Error("News not found")
    }
    await this.repository.delete(id)
  }

  async getNewsCount() {
    return await this.repository.count()
  }
}
