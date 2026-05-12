// Cases where the team URL segment differs in casing from the Confluence space key.
// Defaults to the space key as-is.
const TEAM_SEGMENT_OVERRIDES: Record<string, string> = {
  OMS: "oms",
};

const CONFLUENCE_RE =
  /^https?:\/\/confluence\.ssnc-corp\.cloud\/spaces\/([^/]+)\/pages\/(\d+)\/([^/?#\s]+)/;

export type ConvertResult =
  | { ok: true; original: string; converted: string }
  | { ok: false; original: string; reason: string };

export function convertConfluenceUrl(url: string): ConvertResult {
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, original: url, reason: "Empty line" };
  const match = trimmed.match(CONFLUENCE_RE);
  if (!match) {
    return { ok: false, original: trimmed, reason: "Not a Confluence page URL" };
  }
  const [, space, pageId, rawTitle] = match;
  const teamSegment = TEAM_SEGMENT_OVERRIDES[space] ?? space;
  const title = rawTitle.replace(/\+/g, "-");
  const converted = `https://ssctechnologiesinc.sharepoint.com/teams/ssc-conf-${teamSegment}/sitepages/${space}-${title}-${pageId}.aspx`;
  return { ok: true, original: trimmed, converted };
}

const URL_RE = /https?:\/\/\S+/g;

export function extractUrls(input: string): string[] {
  return input.match(URL_RE) ?? [];
}

export function convertMany(input: string): ConvertResult[] {
  return extractUrls(input).map(convertConfluenceUrl);
}

export function rewriteBookmarkHtml(html: string): {
  rewritten: string;
  converted: number;
  matched: number;
} {
  let converted = 0;
  let matched = 0;
  const rewritten = html.replace(
    /href="(https?:\/\/confluence\.ssnc-corp\.cloud\/spaces\/[^"]+)"/g,
    (full, url) => {
      matched++;
      const result = convertConfluenceUrl(url);
      if (result.ok) {
        converted++;
        return `href="${result.converted}"`;
      }
      return full;
    }
  );
  return { rewritten, converted, matched };
}
