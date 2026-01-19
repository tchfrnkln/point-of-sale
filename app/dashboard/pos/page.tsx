"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessInfo, businessInfo, CartItem, PaymentType, usePOSStore } from "@/store/pos.store";
import { toast } from "sonner";
import { findProduct } from "@/lib/inventory/inventory";
import { useEffect, useRef } from "react";
import { useInventoryStore } from "@/store/inventory.store";
import { UserInfo } from "@/components/features/dashboard/UserInfo";
import { useUserStore } from "@/store/user.store";
import { useAuditLogStore } from "@/store/audit.store";

export default function POSPage() {

    const fetchInventory = useInventoryStore(s => s.fetchInventory)
    
      useEffect(() => {
        fetchInventory()
      }, [fetchInventory])

  const {
    cart, addItem, updateQty, removeItem,
    suspendSale, resumeSale, clearSale,
    payments, addPayment, suspendedSales
  } = usePOSStore();

  const {reduceStock} = useInventoryStore();
  const { session } = useUserStore();
  const { addLog } = useAuditLogStore();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const paid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = total - paid;

  const inputRef = useRef<HTMLInputElement>(null);


  function printReceipt(cart: CartItem[], businessInfo: BusinessInfo) {
    if (cart.length === 0) return;

    const lastPayment = payments[payments.length - 1]

    const paymentType: PaymentType = lastPayment?.type ?? "CARD";
  
    // Prepare receipt text
    let receipt = "";
  
    // Business logo and name
    if (businessInfo.logoUrl) {
      receipt += `[LOGO: ${businessInfo.logoUrl}]\n`;
    }
    receipt += `*** ${businessInfo.name} ***\n\n`;
  
    // Cart items
    cart.forEach(item => {
      receipt += `${item.name} x${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });
  
    // Total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    receipt += `\nTOTAL: ₦${total.toLocaleString()}\n`;
    receipt += "-----------------------\n";
    receipt += "Thank you for your purchase!\n";
  
    // In Electron, you can send this string to the main process for printing
    // Example:

    
    if (window.electron) {
      window.electron.print(receipt);
      cart.forEach(item => {
        addLog({
          productName: item.name,
          quantity: item.quantity,
          pricePerUnit: item.price,
          totalPrice: item.price * item.quantity,
          soldBy: session?.username ?? "unknown",
          paymentType: paymentType
        });
      });
      reduceStock(cart);
      clearSale();
      toast.success("Stock updated!");
    } else {
      toast.error("Electron not ready!");
      console.log("Print output (Electron not ready):\n", receipt);
    }
  }


  return (
    <div className="min-h-screen w-full p-4">
      <UserInfo name="Point Of Sale"/>

      <div className="grid grid-cols-3 gap-4">
        {/* LEFT — SCAN & CART */}
        <div className="col-span-2 space-y-4">
          <Input
            ref={inputRef}
            autoFocus
            placeholder="Scan barcode or enter product name"
            onKeyDown={async e => {
              if (e.key !== "Enter") return;
              const query = inputRef.current?.value.trim();
              if (!query) return;

              const product = await findProduct(query);
              if (!product) return toast.error("Product not found");
              if (product.stockAmount <= 0) return toast.error("Out of stock");

              addItem({
                id: crypto.randomUUID(),
                productId: product.id,
                name: product.product_name,
                price: product.cost,
                quantity: 1,
                stockLeft: product.stock_amount
              });

                if (inputRef.current) inputRef.current.value = "";
            }}
          />

          {/* CART TABLE */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>₦{item.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="w-24"
                      value={item.quantity}
                      onChange={e =>
                        updateQty(item.id, Number(e.target.value))
                      }
                    />
                  </TableCell>
                  <TableCell>₦{(item.price * item.quantity).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* RIGHT — SUMMARY & PAYMENTS */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Checkout</h2>
          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Paid</span>
            <span>₦{paid.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Balance</span>
            <span>₦{balance.toLocaleString()}</span>
          </div>

          <Separator />

          <Select onValueChange={(value: PaymentType) => addPayment({ type: value, amount: balance })}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="TRANSFER">Transfer</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
            </SelectContent>
          </Select>

          <Separator />

            <Button
                className="w-full bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
                disabled={cart.length === 0 || balance > 0}
                onClick={() => printReceipt(cart, businessInfo)}
                >
                Print Receipt
            </Button>

          <Button className="w-full" onClick={suspendSale}>Suspend Sale</Button>
          {suspendedSales.length > 0 && 
            suspendedSales.map(sale => (
                <Button
                    key={sale.id}
                    className="w-full"
                    variant="outline"
                    onClick={() => resumeSale(sale.id)}
                >
                    Resume Sale #{sale.id}
                </Button>
            ))}

          <Button className="w-full" variant="destructive" onClick={clearSale}>Cancel Sale</Button>
        </div>
      </div>
    </div>
  );
}
