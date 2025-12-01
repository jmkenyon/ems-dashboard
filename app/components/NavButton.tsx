import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavButtonProps {
    href: string;
    title: string;
}

const NavButton = ({href, title}: NavButtonProps) => {
  return (
    <Button
      asChild
      variant="elevated"
      className="rounded-full border-transparent px-2 lg:px-3.5 lg:text-lg text-sm  bg-white text-blue-950 hover:bg-white hover:text-blue-950  hover:border-blue-950"
    >
      <Link href={href} className="cursor-pointer">
        {title}
      </Link>
    </Button>
  );
};

export default NavButton;
