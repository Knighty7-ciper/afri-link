import { EconomicIndicatorRepository } from "@/lib/repositories/economic-indicator.repository"
import type { CreateEconomicIndicatorDto, UpdateEconomicIndicatorDto } from "@/lib/dto/economic-indicator.dto"

export class EconomicIndicatorService {
  private repository: EconomicIndicatorRepository

  constructor() {
    this.repository = new EconomicIndicatorRepository()
  }

  async getAllIndicators(limit = 100, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getIndicatorById(id: string) {
    const indicator = await this.repository.findById(id)
    if (!indicator) {
      throw new Error("Economic indicator not found")
    }
    return indicator
  }

  async getIndicatorsByCountry(countryCode: string, limit = 50, offset = 0) {
    return await this.repository.findByCountry(countryCode, limit, offset)
  }

  async getIndicatorsByType(type: string, limit = 50, offset = 0) {
    return await this.repository.findByType(type, limit, offset)
  }

  async getIndicatorsByCountryAndType(countryCode: string, type: string, limit = 50, offset = 0) {
    return await this.repository.findByCountryAndType(countryCode, type, limit, offset)
  }

  async createIndicator(indicatorData: CreateEconomicIndicatorDto) {
    return await this.repository.create(indicatorData)
  }

  async updateIndicator(id: string, indicatorData: UpdateEconomicIndicatorDto) {
    const indicator = await this.repository.findById(id)
    if (!indicator) {
      throw new Error("Economic indicator not found")
    }
    return await this.repository.update(id, indicatorData)
  }

  async deleteIndicator(id: string) {
    const indicator = await this.repository.findById(id)
    if (!indicator) {
      throw new Error("Economic indicator not found")
    }
    await this.repository.delete(id)
  }
}
