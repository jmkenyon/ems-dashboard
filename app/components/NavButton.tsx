import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavButtonProps {
    href: string;
    title: string;
}

const NavButton = ({ href, title }: NavButtonProps) => {
  return (
    <Button
      asChild
      variant="elevated"
      className="
        rounded-full
        px-3 py-1.5
        text-sm md:text-base
        text-blue-900
        transition-all

        hover:text-blue-950
        hover:scale-[1.03]
        active:scale-100
      "
    >
      <Link href={href}>{title}</Link>
    </Button>
  );
};

export default NavButton;
