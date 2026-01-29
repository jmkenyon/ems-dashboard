"use client";

import Link from "next/link";
import NavButton from "./NavButton";
import { useState } from "react";
import NavbarSidebar from "./Navbarsidebar";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-blue-800 px-4 md:px-8 h-16 flex items-center justify-between">
      <NavbarSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <Link href="/" className="font-semibold tracking-tight text-blue-950">
        <span className="hidden md:block text-xl">EMS Tool Suite</span>
        <span className="md:hidden">Tool Suite</span>
      </Link>

      <div className="hidden sm:flex gap-2 md:gap-3">
        <NavButton href="/time-converter" title="Time" />
        <NavButton href="/log-reader" title="Logs" />
        <NavButton href="/rule-checker" title="Rules" />
        <NavButton href="/holiday-checker" title="Holidays" />
        <NavButton href="/xapi-server" title="xAPI" />
        <NavButton href="/network-tests" title="Network" />
      </div>
      <div className="flex md:hidden items-center h-full justify-center">
        <Button
          variant="ghost"

          className="size-14 border-transparent h-full text-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon className="text-black"/>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
