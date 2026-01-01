"use client";

import { useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExpiryStore } from "@/store/expiry.store";
import { UserInfo } from "@/components/features/dashboard/UserInfo";

export default function ExpiredProductsPage() {
  const {
    expiredProducts,
    fetchInventory,
    deleteExpiredProduct
  } = useExpiryStore();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <UserInfo name="Expired Products" />
        <p className="text-muted-foreground">
          Products past their expiry date (locked from sale)
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          {expiredProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No expired products found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {expiredProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.expiryDate}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">EXPIRED</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteExpiredProduct(p.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
