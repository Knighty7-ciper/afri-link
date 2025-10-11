import { NextRequest } from "next/server"
import { TransactionService } from "@/lib/services/transaction.service"
import { UpdateTransactionSchema } from "@/lib/dto/transaction.dto"
import { requireAuth } from "@/lib/guards/auth.guard"
import { requireAdmin } from "@/lib/guards/admin.guard"
import { successResponse, validationErrorResponse, noContentResponse } from "@/lib/utils/response.util"
import { validateRequest } from "@/lib/utils/validation.util"
import { handleException } from "@/lib/filters/http-exception.filter"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const transactionId = params.id

    const transactionService = new TransactionService()
    const transaction = await transactionService.getTransactionById(transactionId)

    if (transaction.from_user_id !== user.id && transaction.to_user_id !== user.id) {
      await requireAdmin()
    }

    return successResponse(transaction)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const transactionId = params.id
    const body = await request.json()

    const validation = await validateRequest(UpdateTransactionSchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const transactionService = new TransactionService()
    const updatedTransaction = await transactionService.updateTransaction(transactionId, validation.data)

    return successResponse(updatedTransaction, "Transaction updated successfully")
  } catch (error: any) {
    return handleException(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const transactionId = params.id
    const transactionService = new TransactionService()
    await transactionService.deleteTransaction(transactionId)

    return noContentResponse()
  } catch (error: any) {
    return handleException(error)
  }
}
