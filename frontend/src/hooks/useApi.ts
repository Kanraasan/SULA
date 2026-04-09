import { useState, useCallback } from "react";

export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (servicePromise: Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await servicePromise;
      setData(result);
      return result;
    } catch (err: any) {
      const message = err.message || "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, data, loading, error };
}
