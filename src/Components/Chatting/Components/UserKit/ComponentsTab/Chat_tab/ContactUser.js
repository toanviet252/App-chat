import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  generateCombinedId,
  updateBothUserChat,
} from '../../../../../../apis/createChatroom';
import {
  AuthAction,
  ContactsAction,
  QueryUserAction,
} from '../../../../../../redux/configureStore';
import { db } from '../../../../../../utils/Firebase/firebase';
import QueryUser from '../../../QueryUser';
import RecentChatContact from './Components/RecentChat';
import './ContactUser.scss';

const ContactUser = () => {
  const currentUser = useSelector((state) => state.Auth.currentUser);
  const dispatch = useDispatch();
  const setChooseContactUser = (nameContact) => {
    dispatch(AuthAction.setChooseContactUser(nameContact));
  };
  const setChatId = (chatId) => {
    dispatch(QueryUserAction.setChatId(chatId));
  };
  const setNameFind = (name) => {
    dispatch(AuthAction.setNameFind(name));
  };
  const userQuery = useSelector((state) => state.QueryReducer.queryUser);
  const setUserQuery = (user) => {
    dispatch(QueryUserAction.setQueryUser(user));
  };
  const setIsChooseContact = (boolean) => {
    dispatch(AuthAction.setIsChooseContact(boolean));
  };

  const setRecentContacts = (cts) => {
    dispatch(ContactsAction.setRecentContacts(cts));
  };
  const loadingQuery = useSelector((state) => state.QueryReducer.loadingQuery);

  //Hàm fetch data hội thoại của người dùng khi nhấn vào div query người dùng đã được truy vấn
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const getConversation = () => {
      const unsub = onSnapshot(
        doc(db, 'userChats', currentUser?.uid),
        (doc) => {
          const arrayChats = Object.entries(doc.data());
          // Lọc bỏ những đoạn chat chưa có tin nhắn
          const filterData = arrayChats.filter(
            (doc) => doc[1].lastestMessage !== undefined,
          );

          setRecentContacts([...filterData]);
          setChats(filterData);
        },
      );
      return () => {
        unsub();
      };
    };
    currentUser?.uid && getConversation();
  }, [currentUser?.uid]);
  //Hàm tạo document userChats mới khi lần đầu tìm kiếm contact
  const handleSelect = async (user) => {
    const combinedId = generateCombinedId(currentUser?.uid, user?.uid);
    setChatId(combinedId);
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        //Tạo db lưu các tin nhắn của current users trong collect "chats"
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });
        await updateBothUserChat(combinedId, currentUser, user);
      }
    } catch (err) {
      console.error(err);
    }
    setNameFind('');
    setChooseContactUser(user);
    setIsChooseContact(true);
    setUserQuery('');
  };
  //Hàm chọn liên hệ đã có sẵn, sau khi đã query từ trước đó.
  const handleSelectCurrentContact = useCallback(
    (userInfor) => {
      const combinedId = generateCombinedId(currentUser?.uid, userInfor?.uid);
      setChatId(combinedId);
      setChooseContactUser(userInfor);
      setIsChooseContact(true);
    },
    [currentUser?.uid],
  );

  return (
    <>
      <QueryUser
        user={userQuery}
        handleSelect={handleSelect}
        loading={loadingQuery}
      />
      {/* <div>{contactList}</div> */}
      <RecentChatContact
        chatsData={chats}
        handleSelectCurrentContact={handleSelectCurrentContact}
      />
    </>
  );
};
export default ContactUser;
