import Link from "next/link";
import NavButton from "./NavButton";
import MenuButton from "./MenuButton";

const Navbar = () => {
  return (
    <nav className="bg-white text-blue-950 py-8 md:px-8 px-4 font-bold text-base shadow-xl flex flex-row items-center justify-between">
      <Link
        href="/"
        className="cursor-pointer lg:text-2xl text-base font-bold"
      >
        EMS Tool Suite
      </Link>

      <div className="hidden sm:flex grow md:justify-center md:gap-2 justify-end">
        <NavButton href="/time-converter" title="Time Converter" />
        <NavButton href="/log-reader" title="Log Reader" />
        <NavButton href="/rule-checker" title="Rule Checker" />
        <NavButton href="/holiday-checker" title="Holiday Checker" />
        <NavButton href="/xapi-server" title="xAPI Server" />
      </div>

      <div className="flex">
        <MenuButton />
      </div>
    </nav>
  );
};

export default Navbar;
