import { useCallback, useEffect, useRef, useState } from "react";
import content from "../content";
import { isFirebaseConfigured, subscribeToBlessings } from "../lib/firebase";

const POLL_INTERVAL_MS = 10000;

function signature(entry) {
  return `${entry.name}||${entry.message}`;
}

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

  // 1. If Firebase Firestore is configured, use real-time push subscription
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    setStatus("loading");
    const unsubscribe = subscribeToBlessings(
      (blessings) => {
        setEntries((current) => mergeBlessings(current, blessings));
        setStatus("loaded");
      },
      () => {
        setStatus("error");
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. If Firebase is NOT configured, fallback to Google Apps Script polling
  const fetchBlessings = useCallback(
    (isFirstLoad) => {
      if (isFirebaseConfigured || !integrations.appsScriptUrl) return;
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
    if (isFirebaseConfigured) return;
    fetchBlessings(true);
    const intervalId = setInterval(() => fetchBlessings(false), POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [fetchBlessings]);

  // Called right after submission so the sender sees their own entry instantly
  const addLocalBlessing = useCallback((entry) => {
    const withTimestamp = { ...entry, timestamp: new Date().toISOString(), _local: true };
    setMyBlessingKey(signature(withTimestamp));
    setEntries((current) => [withTimestamp, ...current]);
  }, []);

  return { entries, status, myBlessingKey, addLocalBlessing };
}
