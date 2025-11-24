import Link from 'next/link'


const Navbar = () => {
  return (
    <nav className="bg-white text-blue-900 p-8 font-bold text-lg shadow-xl">
    <Link href="/">EMS Dashboard</Link>
  </nav>
  )
}

export default Navbar