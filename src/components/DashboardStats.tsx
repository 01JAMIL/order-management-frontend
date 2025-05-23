"use client"

import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    AlertTriangle,
    CheckCircle2,
    ClipboardList,
    Clock,
    Cog,
    Package,
    Users
} from "lucide-react";
import useGetAllEmployees from "@/hooks/employee/useGetAllEmployees";
import useGetAllMachines from "@/hooks/machine/useGetAllMachines";
import useGetAllProducts from "@/hooks/product/useGetAllProducts";
import useGetManufacturingOrders from "@/hooks/order/useGetManufacturingOrders";
import {format} from "date-fns";

const DashboardStats = () => {
    const {
        data: employees = []
    } = useGetAllEmployees();

    const {
        data: machines = []
    } = useGetAllMachines();

    const {
        data: products = []
    } = useGetAllProducts();

    const {
        data: orders = []
    } = useGetManufacturingOrders();

    const activeMachines = machines.filter(machine => machine.status === "OPERATIONAL");
    const underMaintenance = machines.filter(machine => machine.status === "UNDER_MAINTENANCE").length;

    const activeOrders = orders.filter(order => order.status === "IN_PROGRESS").length;
    const pendingOrders = orders.filter(order => order.status === "PENDING").length;

    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-violet-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{employees.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Machines</CardTitle>
                        <Cog className="h-4 w-4 text-pink-700"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeMachines.length}</div>
                        <p className="text-xs text-muted-foreground">{underMaintenance} under maintenance</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-orange-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <ClipboardList className="h-4 w-4 text-emerald-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeOrders}</div>
                        <p className="text-xs text-muted-foreground">{pendingOrders} pending approval</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Overview of the latest manufacturing orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map(order => (
                                <div key={order.id} className="flex items-center">
                                    <div className="mr-4">
                                        {order.status === "COMPLETED" &&
                                            <CheckCircle2 className="h-8 w-8 text-green-500"/>}
                                        {order.status === "IN_PROGRESS" && <Clock className="h-8 w-8 text-blue-500"/>}
                                        {order.status === "PENDING" &&
                                            <AlertTriangle className="h-8 w-8 text-yellow-500"/>}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{order.project}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.id} • {format(new Date(order.createdAt), "yyyy/MM/dd")}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {order.status === "COMPLETED" &&
                                            <span className="text-green-500">Completed</span>}
                                        {order.status === "IN_PROGRESS" &&
                                            <span className="text-blue-500">In Progress</span>}
                                        {order.status === "PENDING" && <span className="text-yellow-500">Pending</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Machine Status</CardTitle>
                        <CardDescription>Current status of production machines</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {machines.slice(0, 4).map(machine => (
                                <div key={machine.id} className="flex items-center">
                                    <div className="mr-4">
                                        {machine.status === "OPERATIONAL" &&
                                            <div className="h-3 w-3 rounded-full bg-green-500"/>}
                                        {machine.status === "UNDER_MAINTENANCE" &&
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"/>}
                                        {machine.status === "OUT_OF_ORDER" &&
                                            <div className="h-3 w-3 rounded-full bg-red-500"/>}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{machine.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Last
                                            maintenance: {format(new Date(machine.lastMaintenanceDate), "yyyy/MM/dd")}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {machine.status === "OPERATIONAL" &&
                                            <span className="text-green-500">Operational</span>}
                                        {machine.status === "UNDER_MAINTENANCE" &&
                                            <span className="text-yellow-500">Maintenance</span>}
                                        {machine.status === "OUT_OF_ORDER" &&
                                            <span className="text-red-500">Out of Order</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default DashboardStats;