import { WalletRepository } from "@/lib/repositories/wallet.repository"
import { createWallet } from "@/lib/stellar/wallet"
import { encrypt } from "@/lib/utils/crypto.util"
import type { CreateWalletDto, UpdateWalletDto, WalletBalanceDto } from "@/lib/dto/wallet.dto"

export class WalletService {
  private repository: WalletRepository

  constructor() {
    this.repository = new WalletRepository()
  }

  async getAllWallets(limit = 100, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getWalletById(id: string) {
    const wallet = await this.repository.findById(id)
    if (!wallet) {
      throw new Error("Wallet not found")
    }
    return wallet
  }

  async getWalletsByUserId(userId: string) {
    return await this.repository.findByUserId(userId)
  }

  async getWalletByPublicKey(publicKey: string) {
    const wallet = await this.repository.findByPublicKey(publicKey)
    if (!wallet) {
      throw new Error("Wallet not found")
    }
    return wallet
  }

  async createWallet(walletData: CreateWalletDto) {
    const existingWallets = await this.repository.findByUserId(walletData.user_id)

    let stellarPublicKey: string
    let stellarSecretKeyEncrypted: string

    if (walletData.stellar_public_key) {
      stellarPublicKey = walletData.stellar_public_key
      stellarSecretKeyEncrypted = ""
    } else {
      const wallet = await createWallet()
      stellarPublicKey = wallet.publicKey
      const encryptionKey = process.env.ENCRYPTION_KEY || ""
      stellarSecretKeyEncrypted = encrypt(wallet.secretKey, encryptionKey)
    }

    return await this.repository.create({
      user_id: walletData.user_id,
      stellar_public_key: stellarPublicKey,
      stellar_secret_key_encrypted: stellarSecretKeyEncrypted,
    })
  }

  async updateWallet(id: string, walletData: UpdateWalletDto) {
    const wallet = await this.repository.findById(id)
    if (!wallet) {
      throw new Error("Wallet not found")
    }
    return await this.repository.update(id, walletData)
  }

  async updateWalletBalance(id: string, balance: number) {
    const wallet = await this.repository.findById(id)
    if (!wallet) {
      throw new Error("Wallet not found")
    }

    if (balance < 0) {
      throw new Error("Balance cannot be negative")
    }

    return await this.repository.updateBalance(id, balance)
  }

  async deleteWallet(id: string) {
    const wallet = await this.repository.findById(id)
    if (!wallet) {
      throw new Error("Wallet not found")
    }
    await this.repository.delete(id)
  }

  async getWalletBalance(id: string): Promise<WalletBalanceDto> {
    const wallet = await this.getWalletById(id)
    return {
      balance: wallet.balance,
      currency: "ACT",
      locked_balance: 0,
    }
  }
}
