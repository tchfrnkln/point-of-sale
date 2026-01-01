"use client";

import { useEffect, useState } from "react";
import { useAuditLogStore } from "@/store/audit.store";
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

import type { PaymentType } from "@/store/audit.store";

export default function AuditLogsPage() {
  const {
    filteredLogs,
    fetchLogs,
    setUsernameFilter,
    setPaymentFilter,
    setDateRange,
    resetFilters
  } = useAuditLogStore();

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
              setPaymentType(value as PaymentType);
              setPaymentFilter(value as PaymentType);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
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
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.productName}</TableCell>
                  <TableCell>{log.quantity}</TableCell>
                  <TableCell>₦{log.pricePerUnit}</TableCell>
                  <TableCell>₦{log.totalPrice}</TableCell>
                  <TableCell className="capitalize">
                    {log.paymentType}
                  </TableCell>
                  <TableCell>{log.soldBy}</TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}

              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
