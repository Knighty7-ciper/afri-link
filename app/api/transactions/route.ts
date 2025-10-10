import { NextRequest } from "next/server"
import { TransactionService } from "@/lib/services/transaction.service"
import { CreateTransactionSchema } from "@/lib/dto/transaction.dto"
import { requireAuth } from "@/lib/guards/auth.guard"
import { requireAdmin } from "@/lib/guards/admin.guard"
import { successResponse, validationErrorResponse } from "@/lib/utils/response.util"
import { validateRequest } from "@/lib/utils/validation.util"
import { getPaginationParams } from "@/lib/utils/pagination.util"
import { handleException } from "@/lib/filters/http-exception.filter"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")
    const walletId = searchParams.get("wallet_id")
    const status = searchParams.get("status")

    const { page, limit, offset } = getPaginationParams(
      searchParams.get("page") || undefined,
      searchParams.get("limit") || undefined
    )

    const transactionService = new TransactionService()

    if (userId) {
      if (user.id !== userId) {
        await requireAdmin()
      }
      const transactions = await transactionService.getTransactionsByUserId(userId, limit, offset)
      return successResponse(transactions)
    }

    if (walletId) {
      const transactions = await transactionService.getTransactionsByWalletId(walletId, limit, offset)
      return successResponse(transactions)
    }

    if (status) {
      await requireAdmin()
      const transactions = await transactionService.getTransactionsByStatus(
        status as "pending" | "completed" | "failed",
        limit,
        offset
      )
      return successResponse(transactions)
    }

    await requireAdmin()
    const transactions = await transactionService.getAllTransactions(limit, offset)
    return successResponse(transactions)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const validation = await validateRequest(CreateTransactionSchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const transactionService = new TransactionService()
    const transaction = await transactionService.createTransaction(validation.data)

    return successResponse(transaction, "Transaction created successfully", 201)
  } catch (error: any) {
    return handleException(error)
  }
}
