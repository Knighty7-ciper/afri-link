import { KycDocumentRepository } from "@/lib/repositories/kyc-document.repository"
import { UserRepository } from "@/lib/repositories/user.repository"

export class KycService {
  private kycRepository: KycDocumentRepository
  private userRepository: UserRepository

  constructor() {
    this.kycRepository = new KycDocumentRepository()
    this.userRepository = new UserRepository()
  }

  async submitDocument(
    userId: string,
    documentType: "passport" | "national_id" | "drivers_license" | "proof_of_address",
    documentUrl: string
  ) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    return await this.kycRepository.create({
      user_id: userId,
      document_type: documentType,
      document_url: documentUrl,
    })
  }

  async getUserDocuments(userId: string) {
    return await this.kycRepository.findByUserId(userId)
  }

  async getPendingDocuments() {
    return await this.kycRepository.findByStatus("pending")
  }

  async approveDocument(documentId: string, adminUserId: string) {
    const document = await this.kycRepository.findById(documentId)
    if (!document) {
      throw new Error("Document not found")
    }

    const updatedDoc = await this.kycRepository.updateStatus(documentId, "approved")

    const userDocs = await this.kycRepository.findByUserId(document.user_id)
    const allApproved = userDocs.every((doc) => doc.status === "approved")

    if (allApproved) {
      await this.userRepository.updateKycStatus(document.user_id, "approved")
    }

    return updatedDoc
  }

  async rejectDocument(documentId: string, reason: string, adminUserId: string) {
    const document = await this.kycRepository.findById(documentId)
    if (!document) {
      throw new Error("Document not found")
    }

    const updatedDoc = await this.kycRepository.updateStatus(documentId, "rejected", reason)

    await this.userRepository.updateKycStatus(document.user_id, "rejected")

    return updatedDoc
  }

  async getDocumentById(documentId: string) {
    const document = await this.kycRepository.findById(documentId)
    if (!document) {
      throw new Error("Document not found")
    }
    return document
  }

  async getPendingCount() {
    return await this.kycRepository.countByStatus("pending")
  }
}
