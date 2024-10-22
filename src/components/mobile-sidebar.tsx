"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button size='icon' variant='secondary' className="lg:hidden">
                    <MenuIcon className="size-4 text-neutral-500" />
                </Button>
            </SheetTrigger>
            <SheetHeader>
                <SheetTitle />
                <SheetDescription />
            </SheetHeader>
            <SheetContent side='left' className="p-0">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
};