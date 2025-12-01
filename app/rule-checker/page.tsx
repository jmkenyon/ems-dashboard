"use client";

import { useState } from "react";
import FormButton from "../components/FormButton";

type Results = {
  parentheses: string;
  whitespace: string;
  brackets: string;
  emptyBrackets: string;
};

const Page = () => {
  const [rule, setRule] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState<Results>({
    parentheses: "",
    whitespace: "",
    brackets: "",
    emptyBrackets: "",
  });

  const defaultResults: Results = {
    parentheses: "",
    whitespace: "",
    brackets: "",
    emptyBrackets: "",
  };

  const isValid = Object.values(results).every((msg) => msg === "");

  const handleSubmit = (e: React.FormEvent) => {
    setResults(defaultResults);
    e.preventDefault();
    setHasSubmitted(true);
    setResults(validateRule(rule));
  };

  function validateRule(rule: string): Results {
    const trimmedRule = rule.trim();

    const leftParens = (rule.match(/\(/g) || []).length;
    const rightParens = (rule.match(/\)/g) || []).length;

    const whitespaceChars = trimmedRule.match(/\s/g)

    return {
      parentheses:
        leftParens !== rightParens
          ? `Missing ${Math.abs(leftParens - rightParens)} ${
              leftParens > rightParens ? "closing" : "opening"
            } parentheses`
          : "",

      whitespace: whitespaceChars ? 
       `Contains ${
              whitespaceChars.length
            } whitespace character(s).`
          : "",

      brackets:
        (rule.match(/\[/g) || []).length !== (rule.match(/\]/g) || []).length
          ? "Brackets [] are not balanced."
          : "",

      emptyBrackets:
        (rule.match(/\[\s*\]/g) || []).length > 0
          ? "Rule contains empty brackets []."
          : "",
    };
  }

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
              className="border rounded border-gray-500 bg-gray-50 p-1 "
              onChange={(e) => setRule(e.target.value)}
            />
          </label>
        
          <FormButton>
          Check Rule
          </FormButton>
        </form>
        {hasSubmitted && (
          <div className="mt-10 p-4 border border-gray-300 rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Results:</h2>
            <div className="flex flex-col gap-2">
              {Object.values(results).map(
                (msg, i) =>
                  msg && (
                    <p key={i} className="text-base">
                      {msg}
                    </p>
                  )
              )}
              {isValid && <p className="text-base">Rule passed checks.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
