"use client";

import { useEffect, useState } from "react";
import { SaleLog, useAuditLogStore } from "@/store/audit.store";
import { UserInfo } from "@/components/features/dashboard/UserInfo";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import { PaymentType } from "@/store/pos.store";
import { useReturnsStore } from "@/store/returns.store";


export default function AuditLogsPage() {
  const {
    filteredLogs,
    fetchLogs,
    setUsernameFilter,
    setPaymentFilter,
    setDateRange,
    resetFilters
  } = useAuditLogStore();

  const { processReturn } = useReturnsStore();

  const [username, setUsername] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalSales = filteredLogs.reduce(
    (sum, log) => sum + log.totalPrice,
    0
  );

  const handleReturn = (log: SaleLog) => {
    if (confirm(`Are you sure you want to mark "${log.productName}" (Qty: ${log.quantity}) as returned?`)) {
        // processReturn(id, returnedQuantity, reason)
      processReturn(log.id, log.quantity, "Customer return")
      // console.log(log.id, log.quantity);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <UserInfo name="Audit Logs" />

      {/* FILTERS */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Input
            placeholder="Filter by staff name"
            value={username}
            onChange={e => {
              setUsername(e.target.value);
              setUsernameFilter(e.target.value || undefined);
            }}
          />

          <Select
            value={paymentType}
            onValueChange={value => {
              const type = value.toUpperCase() as PaymentType;
              setPaymentType(type);
              setPaymentFilter(type);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="TRANSFER">Transfer</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={fromDate}
            onChange={e => {
              setFromDate(e.target.value);
              setDateRange({
                from: e.target.value || undefined,
                to: toDate || undefined
              });
            }}
          />

          <Input
            type="date"
            value={toDate}
            onChange={e => {
              setToDate(e.target.value);
              setDateRange({
                from: fromDate || undefined,
                to: e.target.value || undefined
              });
            }}
          />

          <Button
            variant="secondary"
            onClick={() => {
              setUsername("");
              setPaymentType("");
              setFromDate("");
              setToDate("");
              resetFilters();
            }}
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      {/* SUMMARY */}
      <Card>
        <CardContent className="flex justify-between font-semibold">
          <span>Total Transactions: {filteredLogs.length}</span>
          <span>Total Sales: ₦{totalSales.toLocaleString()}</span>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Sold By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-20 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.productName}</TableCell>
                  <TableCell>{log.quantity}</TableCell>
                  <TableCell>₦{log.pricePerUnit.toLocaleString()}</TableCell>
                  <TableCell>₦{log.totalPrice.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">
                    {log.paymentType}
                  </TableCell>
                  <TableCell>{log.soldBy}</TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full flex items-center gap-1"
                      onClick={() => handleReturn(log)}
                    >
                      {/* <span className="text-xs">↩</span> */}
                      Return
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}