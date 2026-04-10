import { createContext, useContext } from "react";

export interface LoadingContextValue {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
  completeLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextValue | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  return context;
};
