import { AdminRepository } from "@/lib/repositories/admin.repository"
import { UserRepository } from "@/lib/repositories/user.repository"
import { WalletRepository } from "@/lib/repositories/wallet.repository"
import { TransactionRepository } from "@/lib/repositories/transaction.repository"
import { KycDocumentRepository } from "@/lib/repositories/kyc-document.repository"

export class AdminService {
  private adminRepository: AdminRepository
  private userRepository: UserRepository
  private walletRepository: WalletRepository
  private transactionRepository: TransactionRepository
  private kycRepository: KycDocumentRepository

  constructor() {
    this.adminRepository = new AdminRepository()
    this.userRepository = new UserRepository()
    this.walletRepository = new WalletRepository()
    this.transactionRepository = new TransactionRepository()
    this.kycRepository = new KycDocumentRepository()
  }

  async getAllAdmins(limit = 100, offset = 0) {
    return await this.adminRepository.findAllAdmins(limit, offset)
  }

  async getAdminById(id: string) {
    const admin = await this.adminRepository.findAdminById(id)
    if (!admin) {
      throw new Error("Admin not found")
    }
    return admin
  }

  async getPlatformStatistics() {
    const totalUsers = (await this.userRepository.findAll(1000)).length
    const totalWallets = (await this.walletRepository.findAll(1000)).length
    const totalTransactions = (await this.transactionRepository.findAll(1000)).length
    const pendingKyc = await this.kycRepository.countByStatus("pending")

    return {
      totalUsers,
      totalWallets,
      totalTransactions,
      pendingKyc,
    }
  }

  async updateAdminPermissions(adminId: string, permissions: string[]) {
    return await this.adminRepository.updateAdminPermissions(adminId, permissions)
  }

  async suspendAdmin(adminId: string) {
    return await this.adminRepository.toggleAdminStatus(adminId, false)
  }

  async activateAdmin(adminId: string) {
    return await this.adminRepository.toggleAdminStatus(adminId, true)
  }

  async getUserActivity(userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    const wallets = await this.walletRepository.findByUserId(userId)
    const transactions = await this.transactionRepository.findByUserId(userId)
    const kycDocuments = await this.kycRepository.findByUserId(userId)

    return {
      user,
      wallets,
      transactions,
      kycDocuments,
    }
  }

  async suspendUser(userId: string, reason: string) {
    const wallets = await this.walletRepository.findByUserId(userId)

    for (const wallet of wallets) {
      await this.walletRepository.update(wallet.id, { is_active: false })
    }

    return await this.userRepository.update(userId, {
      is_active: false,
      suspension_reason: reason,
    })
  }

  async activateUser(userId: string) {
    const wallets = await this.walletRepository.findByUserId(userId)

    for (const wallet of wallets) {
      await this.walletRepository.update(wallet.id, { is_active: true })
    }

    return await this.userRepository.update(userId, {
      is_active: true,
      suspension_reason: null,
    })
  }
}
