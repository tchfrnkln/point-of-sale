"use client"

import { useEffect } from "react"
import { TableDrawer } from "@/components/features/dashboard/inventory/Drawer"
import { InventoryTable } from "@/components/features/dashboard/inventory/Table"
import { useInventoryStore } from "@/store/inventory.store"
import { UserInfo } from "@/components/features/dashboard/UserInfo"

export default function Page() {
  const fetchInventory = useInventoryStore(s => s.fetchInventory)

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  return (
    <div className="p-6"> 
        <div className="w-full flex flex-col justify-between items-end ">
            <UserInfo name="Inventory"/> 

            <TableDrawer itemId="createNew" name="Add New Item"/> 
        </div> 
        <InventoryTable/> 
    </div>
  )
}
