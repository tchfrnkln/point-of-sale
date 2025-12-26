"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
//   TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableDrawer } from "./Drawer"
import { useInventoryStore } from "@/store/inventory.store";


export function InventoryTable() {
    const {inventory} = useInventoryStore();
  
    return (
    <Table>
      <TableCaption className="font-bold">Over {inventory.length-1}+ Total Products inventory.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No.</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Stock Left</TableHead>
          <TableHead>Cost (Naira)</TableHead>
          <TableHead>Expiry Dates</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((invoice, index) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{index+1}.</TableCell>
            <TableCell>{invoice.productName}</TableCell>
            <TableCell>{invoice.stockAmount}</TableCell>
            <TableCell>{Number(invoice.cost).toLocaleString()}</TableCell>
            <TableCell>{invoice.expiryDate?.toLocaleDateString()}</TableCell>
            <TableDrawer itemId={invoice.id} name="edit"/>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">$2,500000</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}
