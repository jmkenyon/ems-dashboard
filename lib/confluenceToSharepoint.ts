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

export function convertMany(input: string): ConvertResult[] {
  return input
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(convertConfluenceUrl);
}
