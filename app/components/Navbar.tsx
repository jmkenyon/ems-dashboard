import Link from "next/link";
import NavButton from "./NavButton";

const Navbar = () => {
  return (
    <nav className="bg-white text-blue-950 p-8 font-bold text-lg shadow-xl flex flex-row items-center">
      <Link href="/" className="cursor-pointer text-2xl font-bold">
        EMS Tool Suite
      </Link>
      <div className="flex grow justify-center gap-2">
        <NavButton href="/time-converter" title="Time Converter" />
        <NavButton href="/log-reader" title="Log Reader" />
      </div>
    </nav>
  );
};

export default Navbar;
