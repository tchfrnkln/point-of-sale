import { isValidUUID } from "@/store/inventory.store"
import { supabase } from "../supabase/client"

export async function findProduct(query: string, id:string | undefined) {

  if(id == undefined) return
  if(!isValidUUID(id)) return

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq('store_id', id)
    .or(`barcode.eq.${query},product_name.ilike.%${query}%`)
    .limit(1)
    .single()

  if (error) return null
  return data
}
