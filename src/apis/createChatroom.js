import { message } from 'antd';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../utils/Firebase/firebase';

export const createChatroom = async (currentUser, selectedUser) => {
  console.log('currentUser', currentUser, 'selectedUser', selectedUser);
  let combinedId;
  try {
    if (!selectedUser.uid || !currentUser.uid)
      throw new Error('Missing contact_id or current_user_id');
    combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    const res = await getDoc(doc(db, 'chats', combinedId));
    if (!res.exists()) {
      //Tạo db lưu các tin nhắn của current users trong collect "chats"
      await setDoc(doc(db, 'chats', combinedId), { messages: [] });
      //Update lại doccument trong colllection "userChats" khi người dùng nhắn tin
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [combinedId + '.userInfo']: {
          uid: selectedUser.uid,
          displayName: selectedUser.displayName,
          photoURL: selectedUser.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      });
      //Tạo đồng thời data với người nhận được tin nhắn.
      await updateDoc(doc(db, 'userChats', selectedUser.uid), {
        [combinedId + '.userInfo']: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      });
    }
    return {
      status: true,
      combinedId,
    };
  } catch (err) {
    console.log(err.message);
    message.error(err.message);
    return {
      status: false,
      combinedId,
    };
  }
};
