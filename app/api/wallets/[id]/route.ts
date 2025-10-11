import { NextRequest } from "next/server"
import { WalletService } from "@/lib/services/wallet.service"
import { UpdateWalletSchema } from "@/lib/dto/wallet.dto"
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
    const walletId = params.id

    const walletService = new WalletService()
    const wallet = await walletService.getWalletById(walletId)

    if (wallet.user_id !== user.id) {
      await requireAdmin()
    }

    return successResponse(wallet)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const walletId = params.id

    const walletService = new WalletService()
    const wallet = await walletService.getWalletById(walletId)

    if (wallet.user_id !== user.id) {
      await requireAdmin()
    }

    const body = await request.json()
    const validation = await validateRequest(UpdateWalletSchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const updatedWallet = await walletService.updateWallet(walletId, validation.data)

    return successResponse(updatedWallet, "Wallet updated successfully")
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

    const walletId = params.id
    const walletService = new WalletService()
    await walletService.deleteWallet(walletId)

    return noContentResponse()
  } catch (error: any) {
    return handleException(error)
  }
}
