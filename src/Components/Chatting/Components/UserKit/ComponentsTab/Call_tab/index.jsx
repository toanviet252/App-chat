import { useSelector } from 'react-redux';
import Contact from '../Contact';
import { useMemo } from 'react';
import { useContext } from 'react';
import VideoContext from '../../../../../../contexts/VideoContext';

const CallTab = () => {
  const recentContacts = useSelector(
    (state) => state.ContactsReducer.recentContacts,
  );
  const currentUser = useSelector((state) => state.Auth.currentUser);
  const usersData = useMemo(() => {
    return recentContacts
      ?.filter((user) => user[1].userInfo.uid !== currentUser.uid)
      .map((user) => user[1].userInfo);
  }, [recentContacts]);

  const { setCallToUser } = useContext(VideoContext);
  const handleOpenVideoChat = (user) => {
    setCallToUser(user);
  };
  return (
    <>
      {usersData?.length > 0 &&
        usersData.map((user) => (
          <Contact
            key={user.uid}
            userData={user}
            handleSelectCurrentContact={handleOpenVideoChat}
            hasExtraCallUI
          />
        ))}
    </>
  );
};
export default CallTab;
