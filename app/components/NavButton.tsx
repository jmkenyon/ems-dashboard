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
      className="rounded-full border-transparent md:px-3.5  md:text-lg text-base bg-white text-blue-950 hover:bg-white hover:text-blue-950  hover:border-blue-950"
    >
      <Link href={href} className="cursor-pointer">
        {title}
      </Link>
    </Button>
  );
};

export default NavButton;
