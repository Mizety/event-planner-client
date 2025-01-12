"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "./ui/skeleton";

export default function Navbar() {
  const { user, logout, guestLogin, isLoading } = useAuth();

  const NavLinks = ({ className = "", isMobile = false }) => (
    <div
      className={`flex ${
        isMobile ? "flex-col" : "items-center"
      } gap-4 ${className}`}
    >
      {!!isLoading ? (
        <LoadingSkeleton />
      ) : user ? (
        <>
          {/* <Link href="/events/create">
            <Button variant="default" className="w-full">
              Create Event
            </Button>
          </Link> */}
          <span className="text-sm font-medium">{user.name}</span>
          <Button variant="outline" onClick={logout} className="w-full">
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/login" className="w-full">
            <Button variant="ghost" className="w-full">
              Login
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button variant="ghost" className="w-full">
              Register
            </Button>
          </Link>
          <Button onClick={guestLogin} className="w-full">
            Guest Login
          </Button>
        </>
      )}
    </div>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Event Platform
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              asChild
              className="md:hidden"
              aria-description="Open menu"
            >
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent aria-description="Menu">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NavLinks isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="flex flex-row gap-4 ">
      <Skeleton className="h-8 w-[350px]" />
    </div>
  );
}
