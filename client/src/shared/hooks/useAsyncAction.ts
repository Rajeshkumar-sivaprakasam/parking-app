import { useState, useCallback, useRef } from "react";

/**
 * Hook for handling async operations with loading state
 * Prevents double-execution and provides loading/error state
 */
export function useAsyncAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  options?: {
    onSuccess?: (result: Awaited<ReturnType<T>>) => void;
    onError?: (error: Error) => void;
    debounceMs?: number;
  }
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastCallRef = useRef<number>(0);

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      const now = Date.now();
      const debounceMs = options?.debounceMs ?? 300;

      // Debounce check
      if (now - lastCallRef.current < debounceMs) {
        return;
      }

      if (loading) return;

      lastCallRef.current = now;
      setLoading(true);
      setError(null);

      try {
        const result = await action(...args);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [action, loading, options]
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { execute, loading, error, reset };
}

/**
 * Hook for debouncing a callback
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * Hook for throttling a callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= limit) {
        lastRunRef.current = now;
        callback(...args);
      } else {
        // Schedule for the next available slot
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callback(...args);
        }, limit - (now - lastRunRef.current));
      }
    },
    [callback, limit]
  );
}

export default useAsyncAction;
