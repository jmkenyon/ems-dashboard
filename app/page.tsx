import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileSearch,
  Link2,
  ListChecks,
  Network,
  Server,
  Terminal,
} from "lucide-react";

const tools = [
  {
    href: "/time-converter",
    icon: Clock,
    title: "Time Converter",
    description: "Convert server timestamps between time zones.",
  },
  {
    href: "/log-reader",
    icon: FileSearch,
    title: "TAL Log Reader",
    description: "Upload TAL logs to identify common issues and resolutions.",
  },
  {
    href: "/rule-checker",
    icon: ListChecks,
    title: "Rule Checker",
    description: "Check your rules for common syntax issues.",
  },
  {
    href: "/holiday-checker",
    icon: CalendarDays,
    title: "Holiday Checker",
    description: "Verify market holidays from a CSV or Excel file.",
  },
  {
    href: "/xapi-server",
    icon: Server,
    title: "xAPI Server Checker",
    description: "Test connectivity to the Chicago and NJ xAPI servers.",
  },
  {
    href: "/network-tests",
    icon: Network,
    title: "Network Checker",
    description: "Run the network diagnostic tool from your machine.",
  },
  {
    href: "/validation-check",
    icon: CheckCircle2,
    title: "Validation Rule Editor",
    description: "Add symbols to a validation rule.",
  },
  {
    href: "/link-converter",
    icon: Link2,
    title: "Link Converter",
    description: "Convert Confluence URLs to their SharePoint equivalents.",
  },
  {
    href: "/fix-decoder",
    icon: Terminal,
    title: "FIX Decoder",
    description: "Paste a FIX message, get an instant plain-English breakdown.",
  },
];

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <header className="text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-950">
          EMS Tool Suite
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          A collection of utilities for troubleshooting EMS queries faster.
          Pick a tool to get started.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-900 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 size-11 rounded-xl bg-blue-50 text-blue-950 flex items-center justify-center group-hover:bg-blue-950 group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-blue-950 leading-tight">
                    {tool.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
