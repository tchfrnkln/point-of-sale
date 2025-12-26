"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
// import { useInventoryStore } from "@/store/inventory.store"
import ItemForm from "./NewItem"



export function TableDrawer({itemId, name}:{itemId: string, name:string}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <p className="text-xs cursor-pointer hover:text-green-700">{name}</p>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Inventory</DrawerTitle>
            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>

          <DrawerFooter>
            <ItemForm itemId={itemId}/>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
