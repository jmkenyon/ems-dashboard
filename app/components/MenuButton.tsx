"use client"



import Link from "next/link";
import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";

const MenuButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(value => !value);

  return (
    <div className="block sm:hidden">
    <div onClick={toggleOpen} className="cursor-pointer z-50 relative">
      <IoMdMenu size={24} color="navy"/>
    </div>
    {isOpen && (
        <div
        
          className="fixed inset-0 z-50 bg-white text-blue-950 flex flex-col items-center justify-center space-y-8 text-lg"
        >
          <div
            onClick={toggleOpen}
            className="cursor-pointer absolute top-6 right-6"
          >
            <IoMdClose size={24} color="black" />
          </div>
          

          <Link href="/" className="absolute top-30" onClick={() => setIsOpen(false)}>
            EMS Tool Suite
            </Link>
          <Link href="/time-converter" onClick={() => setIsOpen(false)}>
                Time Converter
          </Link>
          <Link href="/log-reader" onClick={() => setIsOpen(false)}>
                Log Reader
          </Link>
          <Link href="/rule-checker" onClick={() => setIsOpen(false)}>
                Rule Checker
          </Link>
         
        </div>
      )}
    </div>
  )
}

export default MenuButton