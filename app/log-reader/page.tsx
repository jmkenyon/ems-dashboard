"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const Page = () => {
  const keyWords = ["SOAP", "I/O completion error", "bb failed to connect"];
  const [output, setOutput] = React.useState<string>("");
  const [errorLines, setErrorLines] = React.useState<string[]>([]);
  const [clearLog, setClearLog] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setClearLog(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;

      analyseFile(text as string);
    };
    reader.readAsText(file);
  };

  const analyseFile = (fileContent: string) => {
    const lines = fileContent.split("\n");

    const results = lines
      .flatMap((line) => {
        const foundKeywords = keyWords.filter((keyword) =>
          line.includes(keyword)
        );
        return foundKeywords.length > 0
          ? { line, keywords: foundKeywords }
          : [];
      })
      .filter(Boolean);

    const uniqueKeywords = [...new Set(results.flatMap((r) => r.keywords))];
    setErrorLines(results.map((r) => r.line));



    if (uniqueKeywords.length === 0) {
      setOutput(
        "No issues found in the log. Please escalate to Product Solutions"
      );
    }

    if (uniqueKeywords.includes("SOAP")) {
      setOutput(
        "SOAP errors found, suggesting network issues on the client side. Please have client's IT check firewall and network configuration. Port 43, 880, 1240 must be open"
      );
    }
    if (uniqueKeywords.includes("I/O completion error")) {
      setOutput(
        "I/O completion errors found, suggesting network issues on the client side. Please have client's IT check firewall and network configuration. Port 43, 880, 1240 must be open"
      );
    }
    if (uniqueKeywords.includes("bb failed to connect")) {
      setOutput(
        "Bloomberg errors found in the logs. Have the user restart the EMS and Bloomberg, open up Bloomberg first and then the EMS."
      );
    }


  };

  const handleClearLog = () => {
    setOutput("");
    setClearLog(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-10 mt-20">
      <div className="bg-white shadow-2xl rounded-2xl p-15 flex flex-col justify-center shadow-black/50">
        <h1 className="text-3xl font-bold text-blue-950 mb-6">
          TAL Log Reader
        </h1>
        <p className="pb-20 text-gray-500 text-base">
          Upload a TAL log for analysis
        </p>
        <Button
          variant="elevated"
          className="rounded-full border-transparent px-3.5 text-lg bg-blue-950 text-white hover:bg-white hover:text-blue-950  hover:border-blue-950"
          onClick={() => {
            if (clearLog) {
              handleClearLog();
            } else {
              inputRef.current?.click();
            }
          }}
        >
          {clearLog ? "Upload Another Log" : "Upload TAL log"}
        </Button>

        <input
          type="file"
          accept=".txt, .log"
          className="hidden"
          ref={inputRef}
          onChange={handleFileUpload}
        />
        {output && (
          <div className="mt-10 p-4 border border-gray-300 rounded max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">Analysis Results:</h2>
            <p>{output}</p>
            {errorLines.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Error Lines:</h3>
                <div className="overflow-y-auto border border-gray-200 p-2 rounded bg-gray-50">
                  {errorLines.map((line, index) => (
                    <p
                      key={index}
                      className="text-sm font-mono whitespace-pre-wrap"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
