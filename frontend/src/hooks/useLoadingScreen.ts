import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

/**
 * Hook to show loading screen while data is being fetched
 * Pass the loading state to track when loading should be shown/hidden
 * 
 * Example usage in a page component:
 * const { data, isLoading: dataLoading } = useVideos();
 * useLoadingScreen(dataLoading);
 * 
 * Or with multiple dependencies:
 * useLoadingScreen(dataLoading || contentLoading);
 */
export function useLoadingScreen(isLoading: boolean) {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);
}
