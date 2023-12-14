import { useSelector } from 'react-redux';
import Contact from '../Contact';
import { useMemo } from 'react';
import { useContext } from 'react';
import VideoContext from '../../../../../../contexts/VideoCall/VideoContext';
// import QueryUser from '../../../QueryUser';
// import { createChatroom } from '../../../../../../apis/createChatroom';

const CallTab = () => {
  // const userQuery = useSelector((state) => state.QueryReducer.queryUser);
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
      {/* <QueryUser user={userQuery} handleSelect={handleSelectContact} /> */}
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
