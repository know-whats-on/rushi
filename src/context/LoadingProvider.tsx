import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Loading from "../components/Loading";
import { LoadingContext, type LoadingContextValue } from "./loadingContext";

interface LoadingProviderProps extends PropsWithChildren {
  skip?: boolean;
}

export const LoadingProvider = ({
  children,
  skip = false,
}: LoadingProviderProps) => {
  const [isLoading, setIsLoadingState] = useState(() => {
    return !(skip || typeof window === "undefined");
  });
  const [loading, setLoading] = useState(0);
  const autoCompleteRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const setIsLoading = useCallback((state: boolean) => {
    setIsLoadingState(state);
  }, []);

  const updateLoading = useCallback((percent: number) => {
    setLoading((current) => {
      const nextPercent = Math.max(0, Math.min(100, percent));
      return nextPercent > current ? nextPercent : current;
    });
  }, []);

  const completeLoading = useCallback(() => {
    updateLoading(100);
  }, [updateLoading]);

  useEffect(() => {
    if (!skip) {
      return;
    }

    setIsLoadingState(false);
  }, [skip]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    progressIntervalRef.current = window.setInterval(() => {
      setLoading((current) => {
        if (current >= 92) {
          return current;
        }

        const increment = current < 42 ? 6 : current < 72 ? 3 : 1;
        return Math.min(92, current + increment);
      });
    }, 110);

    autoCompleteRef.current = window.setTimeout(() => {
      completeLoading();
    }, 1500);

    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      if (autoCompleteRef.current) {
        window.clearTimeout(autoCompleteRef.current);
      }
    };
  }, [completeLoading, isLoading]);

  const value = useMemo<LoadingContextValue>(
    () => ({
      isLoading,
      setIsLoading,
      setLoading: updateLoading,
      completeLoading,
    }),
    [completeLoading, isLoading, setIsLoading, updateLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};
