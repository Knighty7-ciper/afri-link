import { CountryRepository } from "@/lib/repositories/country.repository"
import type { CreateCountryDto, UpdateCountryDto } from "@/lib/dto/country.dto"

export class CountryService {
  private repository: CountryRepository

  constructor() {
    this.repository = new CountryRepository()
  }

  async getAllCountries(limit = 200, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getActiveCountries() {
    return await this.repository.findActive()
  }

  async getCountryById(id: string) {
    const country = await this.repository.findById(id)
    if (!country) {
      throw new Error("Country not found")
    }
    return country
  }

  async getCountryByCode(code: string) {
    const country = await this.repository.findByCode(code)
    if (!country) {
      throw new Error("Country not found")
    }
    return country
  }

  async createCountry(countryData: CreateCountryDto) {
    const existing = await this.repository.findByCode(countryData.code)
    if (existing) {
      throw new Error("Country with this code already exists")
    }
    return await this.repository.create(countryData)
  }

  async updateCountry(id: string, countryData: UpdateCountryDto) {
    const country = await this.repository.findById(id)
    if (!country) {
      throw new Error("Country not found")
    }
    return await this.repository.update(id, countryData)
  }

  async deleteCountry(id: string) {
    const country = await this.repository.findById(id)
    if (!country) {
      throw new Error("Country not found")
    }
    await this.repository.delete(id)
  }
}
