import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white text-blue-950 p-8 font-bold text-lg shadow-xl flex flex-row items-center">
      
      <Link href="/" className="cursor-pointer">EMS Tool Suite</Link>
      <div className="flex grow justify-center">
        <Button
          asChild
          variant="elevated"
          className="rounded-full border-transparent px-3.5 text-lg bg-white text-blue-950 hover:bg-white hover:text-blue-950  hover:border-blue-950"
          >
        <Link href="/time-converter" className="cursor-pointer">
          Time Converter
        </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
