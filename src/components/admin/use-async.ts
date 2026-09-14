"use client";

import { useCallback, useEffect, useState } from "react";

type Fetcher<T> = () => Promise<T>;

/**
 * Simple async data hook with loading/error/refetch.
 */
export function useAsync<T>(fetcher: Fetcher<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      setError((e as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
     
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run, setData };
}

/** Fetch JSON helper with auth. */
export async function api<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/** Upload a file to /api/upload, returns the public url. */
export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Upload failed");
  }
  const data = await res.json();
  return data.url as string;
}
