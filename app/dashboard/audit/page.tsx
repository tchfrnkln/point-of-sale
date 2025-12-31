"use client";

import { useEffect, useState } from "react";
// import { useAuditLogStore } from "@/store/audit-log-store";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuditLogStore } from "@/store/audit.store";
import { UserInfo } from "@/components/features/dashboard/UserInfo";

export default function AuditLogsPage() {
  const {
    filteredLogs,
    filterByUser,
    resetFilter,
    seedMockData
  } = useAuditLogStore();

  const [usernameFilter, setUsernameFilter] = useState("");

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  const totalSales = filteredLogs.reduce((sum, l) => sum + l.totalPrice, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <UserInfo name="Audit Logs"/>
        <p className="text-muted-foreground">
          Track all sales and generate daily financial summary
        </p>
      </div>

      {/* FILTER */}
      <Card>
        <CardContent className="flex items-center space-x-2">
          <Input
            placeholder="Filter by username"
            value={usernameFilter}
            onChange={e => setUsernameFilter(e.target.value)}
          />
          <Button
            onClick={() => filterByUser(usernameFilter)}
          >
            Filter
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              resetFilter();
              setUsernameFilter("");
            }}
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      {/* SUMMARY */}
      <Card>
        <CardContent className="flex justify-between">
          <p className="font-semibold">Total Transactions: {filteredLogs.length}</p>
          <p className="font-semibold">Total Sales: ₦{totalSales}</p>
        </CardContent>
      </Card>

      {/* LOG TABLE */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price/Unit</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Sold By</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.productName}</TableCell>
                  <TableCell>{log.quantity}</TableCell>
                  <TableCell>₦{log.pricePerUnit}</TableCell>
                  <TableCell>₦{log.totalPrice}</TableCell>
                  <TableCell>{log.soldBy}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
