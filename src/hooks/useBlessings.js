import { useCallback, useEffect, useRef, useState } from "react";
import content from "../content";

// How often to re-check for new blessings from other guests. Apps Script
// web apps have a generous free daily quota, so a 10s poll is safe for
// normal guest traffic without needing a real push/websocket backend.
const POLL_INTERVAL_MS = 10000;

function signature(entry) {
  return `${entry.name}||${entry.message}`;
}

// Merges freshly-fetched server data with local state. The server copy is
// always authoritative once it appears (it has the real timestamp), so any
// optimistic local-only entry gets dropped in favor of its server match.
function mergeBlessings(current, fetched) {
  const fetchedSignatures = new Set(fetched.map(signature));
  const stillPending = current.filter(
    (entry) => entry._local && !fetchedSignatures.has(signature(entry))
  );
  return [...stillPending, ...fetched];
}

export function useBlessings() {
  const { integrations } = content;
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | loaded | error
  const [myBlessingKey, setMyBlessingKey] = useState(null);
  const isFetching = useRef(false);

  const fetchBlessings = useCallback(
    (isFirstLoad) => {
      if (!integrations.appsScriptUrl) return;
      if (isFetching.current) return;
      isFetching.current = true;
      if (isFirstLoad) setStatus("loading");

      fetch(integrations.appsScriptUrl)
        .then((res) => {
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const fetched = Array.isArray(data.blessings) ? data.blessings : [];
          setEntries((current) => mergeBlessings(current, fetched));
          setStatus("loaded");
        })
        .catch(() => {
          if (isFirstLoad) setStatus("error");
        })
        .finally(() => {
          isFetching.current = false;
        });
    },
    [integrations.appsScriptUrl]
  );

  useEffect(() => {
    fetchBlessings(true);
    const intervalId = setInterval(() => fetchBlessings(false), POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [fetchBlessings]);

  // Called right after a successful submission so the sender sees their own
  // blessing immediately, without waiting for the next background poll.
  const addLocalBlessing = useCallback((entry) => {
    const withTimestamp = { ...entry, timestamp: new Date().toISOString(), _local: true };
    setMyBlessingKey(signature(withTimestamp));
    setEntries((current) => [withTimestamp, ...current]);
  }, []);

  return { entries, status, myBlessingKey, addLocalBlessing };
}
