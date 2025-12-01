"use client";

import { useState } from "react";
import FormButton from "../components/FormButton";
import PageSkeleton from "../components/PageSkeleton";

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
    <PageSkeleton title="Rule Checker" subtitle="Check your rules for common syntax issues." size="md">
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
    </PageSkeleton>
  );
};

export default Page;
