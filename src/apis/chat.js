import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../utils/Firebase/firebase';
import { message } from 'antd';

export const getMessages = () => {};

export const sendMessage = async (
  chatId,
  text,
  image,
  currentUserUID,
  receiveUserUID,
) => {
  console.log(chatId, text, image, currentUserUID, receiveUserUID);
  try {
    if (image) {
      const storageRef = ref(storage, `${uuid()}.${image.name}`);
      const upLoadTask = uploadBytesResumable(storageRef, image);
      upLoadTask.on(
        'state_changed',
        null, //có thể thêm snapshot để cập nhật progress tại đây
        (error) => {
          console.error(error);
          message.error(error.message ?? 'Something wrong!');
        },
        () => {
          getDownloadURL(upLoadTask.snapshot.ref).then(async (downloadURL) => {
            try {
              await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUserUID,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            } catch (err) {
              console.log('err when upload image', err);
              message.error(err.message ?? 'Upload image false!');
              return false;
            }
          });
        },
      );
    } else {
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: currentUserUID,
          date: Timestamp.now(),
        }),
      });
    }
    // cập nhật tin nhắn mới nhất cho cả 2 user
    await updateDoc(doc(db, 'userChats', currentUserUID), {
      [chatId + '.lastestMessage']: {
        text,
      },
      [chatId + '.date']: serverTimestamp(),
    });
    await updateDoc(doc(db, 'userChats', receiveUserUID), {
      [chatId + '.lastestMessage']: {
        text,
      },
      [chatId + '.date']: serverTimestamp(),
    });

    return true;
  } catch (err) {
    console.log(err);
    message.error(err.message ?? 'Something wrong!');
    return false;
  }
};
