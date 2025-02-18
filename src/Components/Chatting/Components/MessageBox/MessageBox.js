import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../../../utils/Firebase/firebase';
import Message from '../../../Message/Message';
import './messagebox.scss';

const MessageBox = () => {
  const [messages, setMessages] = useState([]);
  const chatId = useSelector((state) => state.QueryReducer.chatId);
  // const currentUser = useSelector((state) => state.Auth.currentUser);
  // const [listener, setlistener] = useState(false);
  // const isTabVisible = usePageVisibility();
  //fetch realtime message
  useEffect(() => {
    const getMessage = () => {
      const unsub = onSnapshot(doc(db, 'chats', chatId), async (doc) => {
        if (doc.exists()) {
          const chatData = doc.data();
          setMessages(chatData.messages);
        }
      });
      return () => {
        unsub();
      };
    };
    chatId && getMessage();
  }, [chatId]);

  // useEffect(() => {
  //   if (!currentUser) return;
  //   if (listener) {
  //     listenToMessages(chatId, currentUser.uid, isTabVisible);
  //   } else {
  //     setlistener(true);
  //   }
  // }, [listener, currentUser, isTabVisible]);

  // console.log("messages >>>", messages);
  return (
    <div className="messages-body">
      <Message messages={messages} />
    </div>
  );
};
export default MessageBox;
