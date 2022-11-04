import "./ContactUser.scss";
import { Avatar } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AuthAction, QueryUserAction } from "../../../redux/configureStore";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../utils/Firebase/firebase";
import { useCallback, useEffect, useState } from "react";

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

  //Hàm fetch data hội thoại của người dùng khi nhấn vào div query người dùng đã được truy vấn
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const getConversation = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid),
        (doc) => {
          const arrayChats = Object.entries(doc.data()); //chuyển data từ dạng Object sang dạng mảng
          setChats(arrayChats);
        }
      );
      return () => {
        unsub();
      };
    };
    currentUser?.uid && getConversation();
  }, [currentUser?.uid]);

  //Hàm tạo document userChats mới khi lần đầu tìm kiếm contact
  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > userQuery.uid
        ? currentUser.uid + userQuery.uid
        : userQuery.uid + currentUser.uid;
    setChatId(combinedId);
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //Tạo db lưu các tin nhắn của current users trong collect "chats"
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //Update lại doccument trong colllection "userChats" khi người dùng nhắn tin
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: userQuery.uid,
            displayName: userQuery.displayName,
            photoURL: userQuery.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        //Tạo đồng thời data với người nhận được tin nhắn.
        await updateDoc(doc(db, "userChats", userQuery.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error(err);
    }
    setNameFind("");
    setChooseContactUser(userQuery);
    setIsChooseContact(true);
    setUserQuery("");
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
    [currentUser?.uid]
  );
  const contactList = chats
    ?.sort((a, b) => b[1].date - a[1].date)
    .map((chat) => {
      return (
        <div className="contact-container" key={chat[1].userInfo.uid}>
          <Avatar src={chat[1].userInfo.photoURL} className="avatar-contact" />
          <div
            className="contact-detail"
            onClick={() => handleSelectCurrentContact(chat[1].userInfo)}
          >
            <h3>{chat[1].userInfo.displayName}</h3>
            <p>
              {chat[1].lastestMessage?.text.length > 0
                ? chat[1].lastestMessage?.text
                : "image"}
            </p>
          </div>
        </div>
      );
    });
  return (
    <div className="contact-user-container">
      {userQuery && (
        <div className="contact-container">
          <Avatar src={userQuery.photoURL} className="avatar-contact" />
          <div className="contact-detail" onClick={handleSelect}>
            <h3>{userQuery.displayName}</h3>
          </div>
        </div>
      )}
      <div>{contactList}</div>
    </div>
  );
};
export default ContactUser;
