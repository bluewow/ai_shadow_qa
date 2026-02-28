import type { SessionRecord } from "@/types/session";

const STORAGE_KEY = "shadow-qa-sessions";

// Auto-clear on page refresh (for testing)
if (typeof window !== "undefined") {
  localStorage.removeItem(STORAGE_KEY);
}

// In-memory screenshot store (too large for localStorage, cleared on refresh)
const screenshotStore = new Map<string, string[]>();

export function saveSession(record: SessionRecord): void {
  if (typeof window === "undefined") return;

  // Store screenshots in memory only
  if (record.screenshots?.length) {
    screenshotStore.set(record.id, record.screenshots);
  }

  // Save to localStorage without screenshots
  const { screenshots: _screenshots, ...textOnly } = record;
  const sessions = getSessions();
  sessions.unshift(textOnly as SessionRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessions(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const sessions = raw ? (JSON.parse(raw) as SessionRecord[]) : [];
    // Merge in-memory screenshots back
    return sessions.map((s) => {
      const imgs = screenshotStore.get(s.id);
      return imgs ? { ...s, screenshots: imgs } : s;
    });
  } catch {
    return [];
  }
}

export function clearSessions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
