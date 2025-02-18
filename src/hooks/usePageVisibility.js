import { useEffect, useState } from 'react';

const usePageVisibility = () => {
  const [isTabVisible, setIsTabVisible] = useState(true);

  const handleVisibilityChange = () => {
    setIsTabVisible(!document.hidden);
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isTabVisible;
};

export default usePageVisibility;
