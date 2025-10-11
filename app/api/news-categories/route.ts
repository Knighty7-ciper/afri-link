import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { NewsCategoryService } from "@/lib/services/news-category.service"

const newsCategoryService = new NewsCategoryService()

export async function GET(request: NextRequest) {
  try {
    const categories = await newsCategoryService.getAllNewsCategories()
    return NextResponse.json({ categories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const newCategory = await newsCategoryService.createNewsCategory(body)

    return NextResponse.json({ category: newCategory }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
