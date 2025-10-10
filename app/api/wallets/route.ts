import { NextRequest } from "next/server"
import { WalletService } from "@/lib/services/wallet.service"
import { CreateWalletSchema } from "@/lib/dto/wallet.dto"
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

    const walletService = new WalletService()

    if (userId) {
      if (user.id !== userId) {
        await requireAdmin()
      }
      const wallets = await walletService.getWalletsByUserId(userId)
      return successResponse(wallets)
    }

    await requireAdmin()
    const { page, limit, offset } = getPaginationParams(
      searchParams.get("page") || undefined,
      searchParams.get("limit") || undefined
    )

    const wallets = await walletService.getAllWallets(limit, offset)
    return successResponse(wallets)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    if (!body.user_id) {
      body.user_id = user.id
    }

    if (body.user_id !== user.id) {
      await requireAdmin()
    }

    const validation = await validateRequest(CreateWalletSchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const walletService = new WalletService()
    const wallet = await walletService.createWallet(validation.data)

    return successResponse(wallet, "Wallet created successfully", 201)
  } catch (error: any) {
    return handleException(error)
  }
}
