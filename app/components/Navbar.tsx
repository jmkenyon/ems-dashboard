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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-blue-800 px-4 lg:px-8 h-16 flex items-center gap-3">
      <NavbarSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      <Link
        href="/"
        className="font-semibold tracking-tight text-blue-950 min-w-0 truncate"
      >
        <span className="hidden sm:inline text-xl">EMS Tool Suite</span>
        <span className="sm:hidden text-lg">EMS</span>
      </Link>

      <div className="hidden lg:flex gap-2 ml-auto">
        <NavButton href="/time-converter" title="Time" />
        <NavButton href="/log-reader" title="Logs" />
        <NavButton href="/rule-checker" title="Rules" />
        <NavButton href="/holiday-checker" title="Holidays" />
        <NavButton href="/xapi-server" title="xAPI" />
        <NavButton href="/network-tests" title="Network" />
        <NavButton href="/validation-check" title="Validation" />
        <NavButton href="/link-converter" title="Links" />
      </div>

      <div className="flex lg:hidden ml-auto">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon className="text-blue-950" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
