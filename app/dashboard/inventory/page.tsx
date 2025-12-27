"use client"

import { useEffect } from "react"
import { TableDrawer } from "@/components/features/dashboard/inventory/Drawer"
import { InventoryTable } from "@/components/features/dashboard/inventory/Table"
import { useInventoryStore } from "@/store/inventory.store"

export default function Page() {
  const fetchInventory = useInventoryStore(s => s.fetchInventory)

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  return (
    <div className="p-6"> 
        <div className="w-full flex justify-between items-center"> 
            <h1 className="text-4xl font-bold py-6">Inventory</h1> 
            <TableDrawer itemId="createNew" name="Add New Item"/> 
        </div> 
        <InventoryTable/> 
    </div>
  )
}
