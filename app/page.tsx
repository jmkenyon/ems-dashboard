export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center p-10 sm:p-2 mt-10">
      <div className="bg-white shadow-2xl rounded-2xl max-w-3xl text-center sm:p-15 p-5 shadow-black/50">
        <h1 className="md:text-5xl sm:text-3xl text-lg font-bold text-blue-950 mb-15">
          Welcome to EMS Tool Suite
        </h1>
        <p className="md:text-xl sm:text-lg text-base text-blue-950 mb-4">
          Your one-stop solution for troubleshooting EMS queries faster.
        </p>
        <p className="md:text-lg sm:text-base text-sm text-blue-950">
          Use the navigation bar to access various tools designed to streamline
          your EMS workflow.
        </p>
      </div>
    </div>
  );
}
