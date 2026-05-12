import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import Link from "next/link";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const items = [
  { href: "/time-converter", label: "Time" },
  { href: "/log-reader", label: "Logs Reader" },
  { href: "/rule-checker", label: "Rules Checker" },
  { href: "/holiday-checker", label: "Holiday Checker" },
  { href: "/xapi-server", label: "xAPI Server" },
  { href: "/network-tests", label: "Network Tests" },
  { href: "/validation-check", label: "Validation Checker" },
  { href: "/link-converter", label: "Link Converter" },
  { href: "/fix-decoder", label: "FIX Decoder" },
];

const NavbarSidebar = ({ open, onOpenChange }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          <Link
            href="/"
            className="w-full text-left p-4 flex items-center text-base font-medium border-b"
            onClick={() => onOpenChange(false)}
          >
            EMS Tool Suite
          </Link>

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full text-left p-4 hover:bg-blue-950 hover:text-white flex items-center text-base font-medium"
              onClick={() => onOpenChange(false)}
            >
              {item.label}
            </Link>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSidebar;
