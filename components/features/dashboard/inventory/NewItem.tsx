'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useInventoryStore } from '@/store/inventory.store'

export default function ItemForm({ itemId }: { itemId: string }) {
  const {
    activeItem,
    setActiveItem,
    updateActiveItem,
    saveActiveItem,
  } = useInventoryStore()

  useEffect(() => {
    setActiveItem(itemId)
  }, [itemId, setActiveItem])

  if (!activeItem) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!activeItem) return

    if (!activeItem.barcode || !activeItem.productName) {
      toast.error('Barcode and Product Name are required')
      return
    }

    if (
      activeItem.expiryDate &&
      activeItem.expiryDate < new Date()
    ) {
      toast.error('Expiry date cannot be in the past')
      return
    }

    saveActiveItem()
    toast.success('Item saved successfully')
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>
          {activeItem.id ? 'Edit Product' : 'Add Product'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Barcode */}
          {!activeItem.id && (
            <div>
              <Label>Barcode</Label>
              <Input
                value={activeItem.barcode}
                onChange={(e) =>
                  updateActiveItem('barcode', e.target.value)
                }
                autoFocus
              />
            </div>
          )}

          {/* Product Name */}
          <div>
            <Label>Product Name</Label>
            <Input
              value={activeItem.productName}
              onChange={(e) =>
                updateActiveItem('productName', e.target.value)
              }
            />
          </div>

          {/* Quantity */}
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={activeItem.stockAmount}
              onChange={(e) =>
                updateActiveItem(
                  'stockAmount',
                  Number(e.target.value)
                )
              }
            />
          </div>

          {/* Cost */}
          <div>
            <Label>Cost Price (₦)</Label>
            <Input
              type="number"
              value={activeItem.cost}
              onChange={(e) =>
                updateActiveItem('cost', Number(e.target.value))
              }
            />
          </div>

          {/* Expiry Date */}
          <div>
            <Label>Expiry Date</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {activeItem.expiryDate
                    ? format(activeItem.expiryDate, 'PPP')
                    : 'Select expiry date'}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={activeItem.expiryDate ?? undefined}
                  onSelect={(date) =>
                    updateActiveItem('expiryDate', date ?? null)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            {activeItem.id ? 'Update Product' : 'Add Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
