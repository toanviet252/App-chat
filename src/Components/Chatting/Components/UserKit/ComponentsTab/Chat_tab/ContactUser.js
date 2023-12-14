import './ContactUser.scss';
import { useSelector, useDispatch } from 'react-redux';
import {
  AuthAction,
  ContactsAction,
  QueryUserAction,
} from '../../../../../../redux/configureStore';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../../../../utils/Firebase/firebase';
import { useCallback, useEffect, useState } from 'react';
import QueryUser from '../../../QueryUser';
import RecentChatContact from './Components/RecentChat';

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
    const combinedId =
      currentUser?.uid > user?.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    setChatId(combinedId);
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        //Tạo db lưu các tin nhắn của current users trong collect "chats"
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });
        //Update lại doccument trong colllection "userChats" khi người dùng nhắn tin
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
        //Tạo đồng thời data với người nhận được tin nhắn.
        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
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
      const combinedId =
        currentUser?.uid > userInfor?.uid
          ? currentUser.uid + userInfor.uid
          : userInfor.uid + currentUser.uid;
      setChatId(combinedId);
      setChooseContactUser(userInfor);
      setIsChooseContact(true);
    },
    // eslint-disable-next-line
    [currentUser?.uid],
  );

  return (
    <>
      <QueryUser user={userQuery} handleSelect={handleSelect} />
      {/* <div>{contactList}</div> */}
      <RecentChatContact
        chatsData={chats}
        handleSelectCurrentContact={handleSelectCurrentContact}
      />
    </>
  );
};
export default ContactUser;
