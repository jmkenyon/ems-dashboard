"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import React, { useState } from "react";

type Results = {
  soap: React.ReactNode | null;
  io: React.ReactNode | null;
  bbg: string;
  restart: string;
  noIssues: string;
  ssm: string;
  connect: React.ReactNode | null;
  bandwidth: string;
  refused: string;
};

const Page = () => {
  const keyWords = [
    "soap",
    "io completion error",
    "failed to open bb connection",
    "rt364.exe: analysis:  request has timed out",
    "ssm: connection to @recombiner!ta_srv has been nacked",
    "unable to connect, invalid host name 255.255.255.255:0",
    "outbound data buffer from reco108.taltrade.com, 100%% full, 500k of 500k, 11964 messages dropped",
    "unable to connect to 63.75.60.219:1838: no connection could be made because the target machine actively refused it.",
  ];

  const [results, setResults] = useState<Results>({
    soap: null,
    io: null,
    bbg: "",
    restart: "",
    noIssues: "",
    ssm: "",
    connect: null,
    bandwidth: "",
    refused: "",
  });

  const defaultResults: Results = {
    soap: null,
    io: null,
    bbg: "",
    restart: "",
    noIssues: "",
    ssm: "",
    connect: null,
    bandwidth: "",
    refused: "",
  };

  const [errorLines, setErrorLines] = React.useState<Record<string, string[]>>(
    {}
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [clearLog, setClearLog] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("Something went wrong!");
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
    setResults(defaultResults);
    setErrorLines({});
    const lines = fileContent.split("\n");

    const results = lines
      .flatMap((line) => {
        const lower = line.toLowerCase();
        const foundKeywords = keyWords.filter((kw) => lower.includes(kw));
        return foundKeywords.length > 0
          ? { line, keywords: foundKeywords }
          : [];
      })
      .filter(Boolean);

    const uniqueKeywords = [...new Set(results.flatMap((r) => r.keywords))];

    const grouped: Record<string, string[]> = {};
    uniqueKeywords.forEach((keyword) => {
      grouped[keyword] = results
        .filter((r) => r.keywords.includes(keyword))
        .map((r) => r.line)
        .slice(0, 5);
    });
    setErrorLines(grouped);

    if (uniqueKeywords.length === 0) {
      setResults((prev) => ({
        ...prev,
        noIssues:
          "No known issues found in the log. Please escalate to Product Solutions",
      }));
    }

    if (
      uniqueKeywords.includes("soap") &&
      uniqueKeywords.includes("io completion error")
    ) {
      setResults((prev) => ({
        ...prev,
        soap: (
          <>
            SOAP and I/O completion errors found, suggesting network issues on
            the client side. Please have client&apos;s IT check firewall and
            network configuration. Ports 80, 443, and 1838 must be open.
            <br />
            <br />
            <a
              href="/networkGuide.pdf"
              download="/networkGuide.pdf"
              className="text-blue-950 underline"
            >
              Download Network Guide
            </a>
          </>
        ),
        io: null,
      }));
    } else if (uniqueKeywords.includes("soap")) {
      setResults((prev) => ({
        ...prev,
        soap: (
          <>
            SOAP and I/O completion errors found, suggesting network issues on
            the client side. Please have client&apos;s IT check firewall and
            network configuration. Ports 80, 443, and 1838 must be open.
            <br />
            <br />
            <a
              href="/networkGuide.pdf"
              download="/networkGuide.pdf"
              className="text-blue-950 underline"
            >
              Download Network Guide
            </a>
          </>
        ),
      }));
    } else if (uniqueKeywords.includes("io completion error")) {
      setResults((prev) => ({
        ...prev,
        io: (
          <>
            I/O completion errors found, suggesting unspecified network issues
            on the client side. Please have client&apos;s IT check firewall and
            network configuration. Ports 80, 443, and 1838 must be open.
            <br />
            <br />
            <a
              href="/networkGuide.pdf"
              download="/networkGuide.pdf"
              className="text-blue-950 underline"
            >
              Download Network Guide
            </a>
          </>
        ),
      }));
    }

    if (
      uniqueKeywords.includes(
        "unable to connect, invalid host name 255.255.255.255:0"
      )
    ) {
      setResults((prev) => ({
        ...prev,
        connect: (
          <>
            There is a problem with the user’s DNS. This is typically related to
            larger connection problems. Please have client&apos;s IT check
            firewall and network configuration. Ports 80, 443, and 1838 must be
            open.
            <br />
            <br />
            <a
              href="/networkGuide.pdf"
              download="/networkGuide.pdf"
              className="text-blue-950 underline"
            >
              Download Network Guide
            </a>
          </>
        ),
      }));
    }

    if (uniqueKeywords.includes("failed to open bb connection")) {
      setResults((prev) => ({
        ...prev,
        bbg: "Failed to open BB connection errors found in the logs. Have the user restart the EMS and Bloomberg, open up Bloomberg first and then the EMS.",
      }));
    }
    if (
      uniqueKeywords.includes("rt364.exe: analysis:  request has timed out")
    ) {
      setResults((prev) => ({
        ...prev,
        restart:
          "rt364.exe: Analysis:  Request has timed out... errors found in the logs. The resolution is to have the user restart their entire machine.",
      }));
    }
    if (
      uniqueKeywords.includes(
        "ssm: connection to @recombiner!ta_srv has been nacked"
      )
    ) {
      setResults((prev) => ({
        ...prev,
        ssm: "SSM connection nacked errors found in the logs. This Indicates that the user has authenticated and returned a reco list (ports 80 and 443 are open and working), but that port 1838 is blocked. This is typically a firewall problem. It may also be related to the user’s internal gateway routing.",
      }));
    }

    if (
      uniqueKeywords.includes(
        "outbound data buffer from reco108.taltrade.com, 100%% full, 500k of 500k, 11964 messages dropped"
      )
    ) {
      setResults((prev) => ({
        ...prev,
        bandwidth:
          "Bandwidth issue detected. The outbound data buffer is full, indicating that the current network bandwidth may be insufficient for the required data transfer. Please check the network connection and consider upgrading the bandwidth to ensure smooth operation.",
      }));
    }

    if (
      uniqueKeywords.includes(
        "unable to connect to 63.75.60.219:1838: no connection could be made because the target machine actively refused it."
      )
    ) {
      setResults((prev) => ({
        ...prev,
        refused:
          "Connection refused errors found in the logs. This typically indicates that the target server is not accepting connections on the specified port. Please verify that there are no firewall rules blocking access to port 1838.",
      }));
    }

    setIsLoading(false);
  };

  const handleClearLog = () => {
    setClearLog(false);
    setErrorLines({});
    setResults(defaultResults);
    inputRef.current?.click();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="bg-white shadow-2xl rounded-2xl sm:p-15 p-10 flex flex-col justify-center shadow-black/50">
        <h1 className="text-3xl font-bold text-blue-950 mb-6">
          TAL Log Reader
        </h1>
        <p className="pb-20 text-gray-500 text-base">
          Upload a TAL log for analysis
        </p>

        {isLoading ? (
          <Button
            variant="outline"
            className="rounded-full border-transparent px-3.5 text-lg bg-gray-500 text-black"
            disabled
          >
            Analysing...
          </Button>
        ) : (
          <Button
            variant="elevated"
            className={cn(
              "rounded-full border-transparent px-3.5 text-lg bg-blue-950 text-white hover:bg-white hover:text-blue-950  hover:border-blue-950",
              clearLog
                ? "bg-white hover:bg-blue-950 text-blue-950 border-blue-950 hover:text-white"
                : ""
            )}
            onClick={() => {
              if (clearLog) {
                handleClearLog();
              } else {
                setIsLoading(true);
                inputRef.current?.click();
              }
            }}
          >
            {clearLog ? "Upload new log" : "Upload TAL log"}
          </Button>
        )}

        <input
          type="file"
          accept=".txt, .log"
          className="hidden"
          ref={inputRef}
          onChange={handleFileUpload}
        />
        {Object.keys(errorLines).length > 0 ? (
          <div className="mt-10 p-4 border border-gray-300 rounded max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">Analysis Results:</h2>
            <div className="flex flex-col gap-2 mb-6">
              <p> {results.soap}</p>
              <p> {results.io}</p>
              <p> {results.bbg}</p>
              <p> {results.restart}</p>
              <p> {results.ssm}</p>
              <p> {results.connect}</p>
              <p> {results.bandwidth}</p>
              <p> {results.refused}</p>
            </div>

            {Object.entries(errorLines).map(([keyword, lines]) => (
              <div key={keyword} className="mb-6">
                <h3 className="text-lg font-bold text-blue-950 mb-2">
                  {keyword.toUpperCase()}
                </h3>

                <div className="border border-gray-200 bg-gray-50 p-2 rounded">
                  {lines.map((line, index) => (
                    <p
                      key={index}
                      className="text-sm font-mono whitespace-pre-wrap"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : results.noIssues ? (
          <div className="mt-10 p-4 border border-gray-300 rounded max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">Analysis Results:</h2>
            <p>{results.noIssues}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
