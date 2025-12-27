'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useInventoryStore } from '@/store/inventory.store'
import { TableDrawer } from './Drawer'

export function InventoryTable() {
  const { inventory, searchQuery, setSearchQuery } = useInventoryStore()

  const filteredInventory = inventory.filter(item => {
    const q = searchQuery.toLowerCase()
    return (
      item.productName.toLowerCase().includes(q) ||
      item.barcode.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">

      {/* Search Field */}
      <Input
        placeholder="Search by product name or barcode..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableCaption className="font-bold">
          {filteredInventory.length} product(s) found
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Stock Left</TableHead>
            <TableHead>Cost (₦)</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredInventory.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {index + 1}.
              </TableCell>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.stockAmount}</TableCell>
              <TableCell>
                {item.cost.toLocaleString()}
              </TableCell>
              <TableCell>
                {item.expiryDate
                  ? item.expiryDate.toLocaleDateString()
                  : '—'}
              </TableCell>
              <TableDrawer itemId={item.id} name="edit" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
