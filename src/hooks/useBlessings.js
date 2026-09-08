import { useCallback, useEffect, useRef, useState } from "react";
import content from "../content";
import { isFirebaseConfigured, subscribeToBlessings } from "../lib/firebase";

const POLL_INTERVAL_MS = 10000;

export function normalizeSignature(entry) {
  if (!entry) return "";
  const name = (entry.name || "").trim().toLowerCase();
  const message = (entry.message || "").trim().toLowerCase();
  return `${name}||${message}`;
}

function mergeBlessings(current, fetched) {
  const fetchedIds = new Set(fetched.map((f) => f.id).filter(Boolean));
  const fetchedSignatures = new Set(fetched.map(normalizeSignature));

  // Keep local optimistic entries ONLY if they haven't arrived from server yet
  const stillPending = current.filter((entry) => {
    if (!entry._local) return false;
    if (entry.id && fetchedIds.has(entry.id)) return false;
    if (fetchedSignatures.has(normalizeSignature(entry))) return false;
    return true;
  });

  // Deduplicate fetched entries by ID and signature
  const seenIds = new Set();
  const seenSigs = new Set();
  const uniqueFetched = [];

  for (const item of fetched) {
    if (item.id) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);
    }
    const sig = normalizeSignature(item);
    if (seenSigs.has(sig)) continue;
    seenSigs.add(sig);

    uniqueFetched.push(item);
  }

  return [...stillPending, ...uniqueFetched];
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
    const trimmedName = (entry.name || "").trim();
    const trimmedMessage = (entry.message || "").trim();
    const withTimestamp = {
      ...entry,
      name: trimmedName,
      message: trimmedMessage,
      timestamp: entry.timestamp || new Date().toISOString(),
      _local: true,
    };
    const sig = normalizeSignature(withTimestamp);
    setMyBlessingKey(sig);

    setEntries((current) => {
      // Check if this blessing already exists in the list (e.g. from real-time Firestore push)
      const alreadyExists = current.some((e) => {
        if (entry.id && e.id && entry.id === e.id) return true;
        return normalizeSignature(e) === sig;
      });
      if (alreadyExists) {
        return current;
      }
      return [withTimestamp, ...current];
    });
  }, []);

  return { entries, status, myBlessingKey, addLocalBlessing };
}
