import { TransactionRepository } from "@/lib/repositories/transaction.repository"
import { WalletRepository } from "@/lib/repositories/wallet.repository"
import type { CreateTransactionDto, UpdateTransactionDto, TransactionHistoryDto } from "@/lib/dto/transaction.dto"
import { v4 as uuidv4 } from "crypto"

export class TransactionService {
  private repository: TransactionRepository
  private walletRepository: WalletRepository

  constructor() {
    this.repository = new TransactionRepository()
    this.walletRepository = new WalletRepository()
  }

  async getAllTransactions(limit = 100, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getTransactionById(id: string) {
    const transaction = await this.repository.findById(id)
    if (!transaction) {
      throw new Error("Transaction not found")
    }
    return transaction
  }

  async getTransactionsByUserId(userId: string, limit = 50, offset = 0) {
    return await this.repository.findByUserId(userId, limit, offset)
  }

  async getTransactionsByWalletId(walletId: string, limit = 50, offset = 0) {
    return await this.repository.findByWalletId(walletId, limit, offset)
  }

  async getTransactionsByStatus(status: "pending" | "completed" | "failed", limit = 100, offset = 0) {
    return await this.repository.findByStatus(status, limit, offset)
  }

  async createTransaction(transactionData: CreateTransactionDto) {
    if (transactionData.from_wallet_id) {
      const fromWallet = await this.walletRepository.findById(transactionData.from_wallet_id)
      if (!fromWallet) {
        throw new Error("Source wallet not found")
      }

      if (fromWallet.balance < transactionData.amount + transactionData.fee) {
        throw new Error("Insufficient balance")
      }
    }

    if (transactionData.to_wallet_id) {
      const toWallet = await this.walletRepository.findById(transactionData.to_wallet_id)
      if (!toWallet) {
        throw new Error("Destination wallet not found")
      }
    }

    const transactionHash = this.generateTransactionHash()

    return await this.repository.create({
      ...transactionData,
      transaction_hash: transactionHash,
    })
  }

  async updateTransaction(id: string, transactionData: UpdateTransactionDto) {
    const transaction = await this.repository.findById(id)
    if (!transaction) {
      throw new Error("Transaction not found")
    }
    return await this.repository.update(id, transactionData)
  }

  async updateTransactionStatus(id: string, status: "pending" | "completed" | "failed") {
    return await this.updateTransaction(id, { status })
  }

  async deleteTransaction(id: string) {
    const transaction = await this.repository.findById(id)
    if (!transaction) {
      throw new Error("Transaction not found")
    }
    await this.repository.delete(id)
  }

  async getUserTransactionHistory(userId: string, page = 1, limit = 50): Promise<TransactionHistoryDto> {
    const offset = (page - 1) * limit
    const transactions = await this.repository.findByUserId(userId, limit, offset)
    const total = await this.repository.countByUserId(userId)

    return {
      transactions,
      total,
      page,
      limit,
    }
  }

  private generateTransactionHash(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  async processTransaction(id: string): Promise<void> {
    const transaction = await this.getTransactionById(id)

    if (transaction.status !== "pending") {
      throw new Error("Transaction is not pending")
    }

    try {
      if (transaction.from_wallet_id && transaction.to_wallet_id) {
        const fromWallet = await this.walletRepository.findById(transaction.from_wallet_id)
        const toWallet = await this.walletRepository.findById(transaction.to_wallet_id)

        if (!fromWallet || !toWallet) {
          throw new Error("Invalid wallet")
        }

        const newFromBalance = fromWallet.balance - transaction.amount - transaction.fee
        const newToBalance = toWallet.balance + transaction.amount

        await this.walletRepository.updateBalance(fromWallet.id, newFromBalance)
        await this.walletRepository.updateBalance(toWallet.id, newToBalance)
      }

      await this.updateTransactionStatus(id, "completed")
    } catch (error) {
      await this.updateTransactionStatus(id, "failed")
      throw error
    }
  }
}
