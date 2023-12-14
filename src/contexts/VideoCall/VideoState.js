import { useState } from 'react';
import VideoContext from './VideoContext';

const VideoContextProvider = ({ children }) => {
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [callToUser, setCallToUser] = useState(null);
  const value = {
    openVideoModal,
    setOpenVideoModal,
    callToUser,
    setCallToUser,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};
export default VideoContextProvider;
