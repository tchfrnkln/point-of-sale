"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Box, TrendingUp, Calendar, FileText, CreditCard } from "lucide-react";
import { UserInfo } from "@/components/features/dashboard/UserInfo";

const dashboardItems = [
  { title: "Point of Sale", icon: CreditCard, href: "/dashboard/pos", color: "bg-purple-500" },
  { title: "Inventory", icon: Box, href: "/dashboard/inventory", color: "bg-blue-500" },
  { title: "Top Selling Product", icon: TrendingUp, href: "/dashboard/sales", color: "bg-green-500" },
  { title: "Close to Expiration", icon: Calendar, href: "/dashboard/expiry", color: "bg-orange-500" },
  { title: "Create New User", icon: Users, href: "/auth/new", color: "bg-teal-500" },
  { title: "Audits", icon: FileText, href: "/dashboard/audit", color: "bg-pink-500" },
  // { title: "Settings & Configs", icon: Settings, href: "/dashboard/settings", color: "bg-gray-700" },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      <UserInfo name="Dashboard"/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href}>
              <Card className={`cursor-pointer hover:scale-105 transform transition-all ${item.color} text-white`}>
                <CardHeader className="flex items-center gap-4">
                  <Icon size={32} />
                  <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <ArrowRight size={24} />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
