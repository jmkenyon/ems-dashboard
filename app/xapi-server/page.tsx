"use client";

import { useState } from "react";
import FormButton from "../components/FormButton";
import PageSkeleton from "../components/PageSkeleton";
import { cn } from "../libs/utils";
import { Loader2 } from "lucide-react";

interface ConnectResults {
  logs: string[];
}

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ConnectResults | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND;
  async function connectServer() {
    setIsLoading(true);
    try {
      console.log("attempt");
      const response = await fetch(`${API_URL}/connect-servers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("API_URL =", API_URL);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageSkeleton
      title="xAPI Server Checker"
      subtitle="Press run test to attempt to connect to the Chicago and New Jersey xapi servers"
      size="md"
    >
      <FormButton onClick={connectServer} disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Connecting..." : "Run test"}
      </FormButton>
      {results && (
        <ul className="mt-6 list-none border border-gray-200 bg-gray-50 p-4 rounded shadow-sm">
          {results.logs.map((line, index) => (
            <li
              key={index}
              className={cn(
                "font-mono whitespace-pre-wrap mb-1",
                line.toLowerCase().includes("success") && "text-green-600",
                line.toLowerCase().includes("fail") && "text-red-600"
              )}
            >
              {line}
            </li>
          ))}
        </ul>
      )}
    </PageSkeleton>
  );
};

export default Page;
