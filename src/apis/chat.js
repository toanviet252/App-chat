import { message } from 'antd';
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../utils/Firebase/firebase';
import { IoIosChatboxes } from 'react-icons/io';

export const getMessages = () => {};

export const sendMessage = async (
  chatId,
  text,
  image,
  currentUserUID,
  receiveUserUID,
) => {
  // console.log(chatId, text, image, currentUserUID, receiveUserUID);
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
export const showNotification = (sender, text) => {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notifications');
    return;
  }
  if (Notification.permission === 'granted') {
    new Notification('App chat', {
      body: `${sender} send you a message: ${text}`,
      // badge: 'badge',
      icon: <IoIosChatboxes />,
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('App chat', {
          body: `${sender} send you a message: ${text}`,
          icon: <IoIosChatboxes />,
          // badge: 'badge',
        });
      }
    });
  }
};

export const listenToMessages = (chatId, currentUserUID, isPageVisibility) => {
  const chatRef = doc(db, 'chats', chatId);

  onSnapshot(
    chatRef,
    async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        const lastMessage = chatData.messages[chatData.messages.length - 1];

        if (lastMessage.senderId !== currentUserUID) {
          const res = await getUserInfo(lastMessage.senderId);
          if (res) {
            const senderName = res.displayName;
            message.info(`${senderName}: ${lastMessage.text}`);
            console.log('tab visible', !isPageVisibility);

            if (!isPageVisibility) {
              showNotification(senderName, lastMessage.text);
            }
          }
        }
      }
    },
    (error) => {
      console.error('Error listening to messages:', error);
      message.error('Could not listen to messages');
    },
  );
};

export const getUserInfo = async (senderId) => {
  try {
    const userRef = doc(db, 'users', senderId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.error('No such user exists');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// export const sendingCallMessage = async (
//   chatId,
//   reason,
//   callerId,
//   calleeId,
// ) => {

//   try {
//     await updateDoc(doc(db, 'chats', chatId), {
//       messages: arrayUnion({
//         id: uuid(),
//         text: ,
//         senderId: callerId,
//         date: Timestamp.now(),
//       }),
//     });
//   } catch (err) {
//     console.error(err.message);
//   }
// };
