"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Cog, Package, ClipboardList, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Employees",
        icon: Users,
        href: "/employees",
        color: "text-violet-500",
    },
    {
        label: "Machines",
        icon: Cog,
        href: "/machines",
        color: "text-pink-700",
    },
    {
        label: "Products",
        icon: Package,
        href: "/products",
        color: "text-orange-500",
    },
    {
        label: "Manufacturing Orders",
        icon: ClipboardList,
        href: "/orders",
        color: "text-emerald-500",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <>
            <div className="hidden md:flex h-full w-64 flex-col border-r bg-muted/40">
                <div className="p-6">
                    <h1 className="text-xl font-bold">Manufacturing</h1>
                    <p className="text-sm text-muted-foreground">Order Management</p>
                </div>
                <div className="flex flex-col gap-2 px-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                                pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                            )}
                        >
                            <route.icon className={cn("h-5 w-5", route.color)} />
                            {route.label}
                        </Link>
                    ))}
                </div>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <div className="p-6">
                        <h1 className="text-xl font-bold">Manufacturing</h1>
                        <p className="text-sm text-muted-foreground">Order Management</p>
                    </div>
                    <div className="flex flex-col gap-2 px-2">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                                    pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                )}
                            >
                                <route.icon className={cn("h-5 w-5", route.color)} />
                                {route.label}
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
