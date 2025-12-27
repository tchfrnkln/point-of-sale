import { supabase } from "../supabase/client"

export async function findProduct(query: string) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .or(`barcode.eq.${query},product_name.ilike.%${query}%`)
    .limit(1)
    .single()

  if (error) return null
  return data
}
