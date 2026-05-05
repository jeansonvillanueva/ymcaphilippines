import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

/**
 * Hook to show loading screen while data is being fetched
 * Pass a dependency array to track when loading should be shown/hidden
 * 
 * Example usage in a page component:
 * const { data, isLoading: dataLoading } = useVideos();
 * useLoadingScreen(dataLoading, 'Loading videos...');
 * 
 * Or with multiple dependencies:
 * useLoadingScreen(dataLoading || contentLoading, 'Loading content...');
 */
export function useLoadingScreen(isLoading: boolean, message: string = 'Loading...') {
  const { setIsLoading, setLoadingMessage } = useLoading();

  useEffect(() => {
    setIsLoading(isLoading);
    setLoadingMessage(message);
  }, [isLoading, message, setIsLoading, setLoadingMessage]);
}
