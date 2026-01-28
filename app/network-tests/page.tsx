"use client";

import PageSkeleton from "../components/PageSkeleton";
import FormButton from "../components/FormButton";
import { Download } from "lucide-react";

export default function Page() {
  function downloadNetworkTool() {
    // direct download link (S3, CDN, etc.)
    window.location.href = "/network_test.zip";
  }

  return (
    <PageSkeleton
      title="Network Checker"
      subtitle="Download and run the network diagnostic tool from your machine"
      size="md"
    >
      <div className="space-y-4 text-sm">
        <p>
          This tool must be run <strong>locally on your machine</strong> to
          accurately test your network connectivity.
        </p>

        <FormButton onClick={downloadNetworkTool}>
          <Download className="h-4 w-4 mr-2" />
          Download Network Checker
        </FormButton>

        <div className="rounded border bg-slate-50 p-4 text-xs font-mono">
          <p>Steps:</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Download the tool</li>
            <li>Run it locally (double-click or via terminal)</li>
            <li>Wait for completion</li>
            <li>Send us the generated JSON results file</li>
          </ol>
        </div>
      </div>
    </PageSkeleton>
  );
}