import { useEffect, useMemo, useState } from 'react';
import Contact from '../Contact';
import { useDispatch, useSelector } from 'react-redux';
import { queryData } from '../../../../../../apis/queryData';
import './index.scss';
import { createChatroom } from '../../../../../../apis/createChatroom';
import {
  AuthAction,
  QueryUserAction,
} from '../../../../../../redux/configureStore';
import QueryUser from '../../../QueryUser';

const ContactTab = () => {
  const [data, setData] = useState([]);
  const [recentContact, setRecentContect] = useState(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.Auth.currentUser);
  const loadingQuery = useSelector((state) => state.QueryReducer.loadingQuery);

  const fetchContactData = async () => {
    const data = await queryData('users');
    if (data) {
      setData(data);
    }
  };
  const fetchRecentContact = async () => {
    if (!currentUser.uid) return;
    const data = await queryData('userChats', currentUser.uid);
    const recents = data
      .filter((user) => user[1]?.lastestMessage)
      .map((user) => user[1].userInfo);
    setRecentContect(recents);
  };
  useEffect(() => {
    fetchContactData();
    fetchRecentContact();
  }, []);

  const suggestContact = useMemo(() => {
    if (recentContact && data.length > 0) {
      let rs = [];
      const allContactUID = data.map((u) => u.uid);
      const recentContactUID = recentContact.map((u) => u.uid);
      for (let i = 0; i < allContactUID.length; i++) {
        if (!recentContactUID.includes(allContactUID[i])) {
          rs.push(allContactUID[i]);
        }
      }
      // lọc ra các contact đã có sẵn trong recent contact:
      return data.filter((doc) => rs.includes(doc.uid));
    }
  }, [recentContact, data]);

  const setChatId = (chatId) => {
    dispatch(QueryUserAction.setChatId(chatId));
  };
  const setChooseContactUser = (nameContact) => {
    dispatch(AuthAction.setChooseContactUser(nameContact));
  };
  const setIsChooseContact = (boolean) => {
    dispatch(AuthAction.setIsChooseContact(boolean));
  };
  const userQuery = useSelector((state) => state.QueryReducer.queryUser);

  const handleSelectContact = async (selectedContact) => {
    const { status, combinedId } = await createChatroom(
      currentUser,
      selectedContact,
    );
    if (status) {
      setChatId(combinedId);
      setChooseContactUser(selectedContact);
      setIsChooseContact(true);
    }
  };

  return (
    <>
      <QueryUser
        user={userQuery}
        handleSelect={handleSelectContact}
        loading={loadingQuery}
      />
      <div className="currentContact">
        <p className="title">Recent Contact</p>
        {recentContact &&
          recentContact.map((contact) => (
            <Contact
              key={contact.uid}
              userData={contact}
              handleSelectCurrentContact={() => handleSelectContact(contact)}
            />
          ))}
      </div>

      <div className="all-contact">
        <p className="title">People you may know</p>

        {suggestContact &&
          suggestContact.map((user) => (
            <Contact
              userData={user}
              handleSelectCurrentContact={() => handleSelectContact(user)}
              key={user.uid}
            />
          ))}
      </div>
    </>
  );
};
export default ContactTab;
