"use client"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import ItemForm from "./NewItem"



export function TableDrawer({itemId, name}:{itemId: string, name:string}) {
  return (
    <Drawer>
      <DrawerTrigger>
        <p className="text-xs cursor-pointer hover:text-green-700">{name}</p>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Inventory</DrawerTitle>
          </DrawerHeader>

          <DrawerFooter>
            <ItemForm itemId={itemId}/>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
