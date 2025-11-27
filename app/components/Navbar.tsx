import Link from "next/link";
import NavButton from "./NavButton";
import MenuButton from "./MenuButton";

const Navbar = () => {
  return (
    <nav className="bg-white text-blue-950 p-8 font-bold text-lg shadow-xl flex flex-row items-center">
      <Link
        href="/"
        className="cursor-pointer md:text-2xl sm:text-lg font-bold"
      >
        EMS Tool Suite
      </Link>

      <div className="invisible sm:visible sm:flex grow md:justify-center gap-2 justify-end">
        <NavButton href="/time-converter" title="Time Converter" />
        <NavButton href="/log-reader" title="Log Reader" />
      </div>

      <div className="flex justify-end">
        <MenuButton />
      </div>
    </nav>
  );
};

export default Navbar;
