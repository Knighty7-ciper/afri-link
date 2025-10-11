import { CurrencyRepository } from "@/lib/repositories/currency.repository"
import type { CreateCurrencyDto, UpdateCurrencyDto } from "@/lib/dto/currency.dto"

export class CurrencyService {
  private repository: CurrencyRepository

  constructor() {
    this.repository = new CurrencyRepository()
  }

  async getAllCurrencies(limit = 100, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getActiveCurrencies() {
    return await this.repository.findActive()
  }

  async getCurrencyById(id: string) {
    const currency = await this.repository.findById(id)
    if (!currency) {
      throw new Error("Currency not found")
    }
    return currency
  }

  async getCurrencyByCode(code: string) {
    const currency = await this.repository.findByCode(code)
    if (!currency) {
      throw new Error("Currency not found")
    }
    return currency
  }

  async createCurrency(currencyData: CreateCurrencyDto) {
    const existing = await this.repository.findByCode(currencyData.code)
    if (existing) {
      throw new Error("Currency with this code already exists")
    }
    return await this.repository.create(currencyData)
  }

  async updateCurrency(id: string, currencyData: UpdateCurrencyDto) {
    const currency = await this.repository.findById(id)
    if (!currency) {
      throw new Error("Currency not found")
    }
    return await this.repository.update(id, currencyData)
  }

  async deleteCurrency(id: string) {
    const currency = await this.repository.findById(id)
    if (!currency) {
      throw new Error("Currency not found")
    }
    await this.repository.delete(id)
  }
}
