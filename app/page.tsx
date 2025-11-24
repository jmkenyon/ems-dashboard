import Link from "next/link";

export default function Home() {
  return (
   <div className="bg-blue-400">
    <nav className="bg-white text-blue-900 p-8 font-bold text-lg">
      <Link href="/">EMS Dashboard</Link>
    </nav>
    <div className=" flex flex-col    justify-center items-center py-20">
    <div className="bg-white  text-blue-900 p-20 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Time Stamp Converter</h1>
      <form action="submit" className="flex flex-col gap-6">
          <label>
            Choose a server:
            <select className="ml-4">
              <option value="">-- Select --</option>
              <option value="NJ">NJ</option>
              <option value="OMS">OMS</option>
              <option value="LD6">LD6</option>
            </select>
          </label>
          <label className="flex flex-row gap-3">
            Enter a timestamp:
            <input name="timestamp" className="border border-w border-gray-500 bg-gray-50"/>
          </label>
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer">
            Convert time
          </button>
      </form>
    </div>
    </div>
   </div>

  );
}
