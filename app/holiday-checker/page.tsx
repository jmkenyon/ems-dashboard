"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { parseHolidayFile } from "@/lib/parseFile";
import { sendHolidaysToBackend } from "./sendToBackend";
import { cn } from "../libs/utils";
import PageSkeleton from "../components/PageSkeleton";

const Page = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<
    { market: string; date: string, is_holiday: boolean, error: string }[]
  >([]);

  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const file = event.target.files?.[0];
    inputRef.current?.click();
    if (file) {
      // Handle the uploaded file here
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          const rows = parseHolidayFile(content);
          

          const results = await sendHolidaysToBackend(rows);
          setResults(results);
          console.log(results);
        } else {
          alert("Unable to read file content");
        }
      };

      reader.readAsText(file);
    }
    setIsLoading(false)
  };

  return (
    <PageSkeleton title="Holiday Checker" subtitle="Upload a CSV or Excel file with market holidays to check if the dates are holidays." size="lg">

        <Button
          variant="elevated"
          className={cn("rounded-full border-transparent px-3.5 text-lg bg-blue-950 text-white hover:bg-white hover:text-blue-950  hover:border-blue-950",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            inputRef.current?.click();

          }}
        >
          {isLoading ? "Checking holidays" : "Upload File"}
        </Button>
        <input
          type="file"
          accept=".csv,.xlsx,.xls,.xlsm,.xlsb,.xltx,.xltm"
          className="hidden"
          ref={inputRef}
          onChange={handleFileUpload}
        />
        {results.length > 0 && (
          <div className="border border-gray-200 bg-gray-50 p-2 rounded mt-6">
            <h2 className="text-2xl font-semibold mb-4">Results:</h2>
            <ul className="list-none list-inside">
              {results.map((results, index) => (
                <li key={index} className={cn(
                  "mb-2",
                  results.is_holiday === true && "bg-green-400",
                  results.is_holiday === false && "bg-red-400",
                  results.is_holiday === null && "bg-gray-200"

                )} >

                  <span className="font-medium">{results.market}{" "}</span>
                  <span className="font-medium">{results.date}{" "}{" "}</span>
                  <span className="font-light text-sm text-gray-600 ml-2">{results.error && "Error - Market not found"}{" "}</span>
                 

                </li>
              ))}
            </ul>
          </div>
        )}
      </PageSkeleton>
    
  );
};

export default Page;
