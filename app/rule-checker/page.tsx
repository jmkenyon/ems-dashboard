"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const Page = () => {
  const [rule, setRule] = useState("");
  const [results, setResults] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ((rule.match(/\(/g) || []).length === (rule.match(/\)/g) || []).length) {
      setResults("Rule is valid: Parentheses are balanced.");
    } else if (
      (rule.match(/\(/g) || []).length > (rule.match(/\)/g) || []).length
    ) {
      setResults(
        `Rule is invalid: Missing ${
          (rule.match(/\(/g) || []).length - (rule.match(/\)/g) || []).length
        } closing parentheses.`
      );
    } else {
      setResults(
        `Rule is invalid: Missing ${
          (rule.match(/\)/g) || []).length - (rule.match(/\(/g) || []).length
        } parentheses.`
      );
    }
  };
  return (
    <div className=" flex flex-col justify-center items-center py-20 px-2">
      <div className="bg-white  text-blue-950 md:p-20 sm:p-10 px-5 py-10 flex flex-col rounded-2xl shadow-2xl shadow-black/50 sm:max-w-3xl w-full">
        <h1 className="sm:text-3xl text-2xl font-bold mb-6">Rule Checker</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col gap-3 text-base sm:text-lg">
            Enter a rule:
            <textarea
              name="rule"
              autoFocus
              rows={6}
              value={rule}
              className="border border-w rounded border-gray-500 bg-gray-50 p-1 "
              onChange={(e) => setRule(e.target.value)}
            />
          </label>
          <Button
            type="submit"
            variant="elevated"
            className="rounded-full border-transparent px-3.5 text-lg mt-10 bg-blue-950 text-white hover:bg-white hover:text-blue-950  hover:border-blue-950"
          >
            Check Rule
          </Button>
        </form>
        {results && (
          <div className="mt-10 p-4 border border-gray-300 rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Results:</h2>
            <p className="text-base">{results}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
