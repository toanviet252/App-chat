import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../utils/Firebase/firebase';
import { useSelector } from 'react-redux';
import Message from '../../../Message/Message';
import './messagebox.scss';

const MessageBox = () => {
  const [messages, setMessages] = useState([]);
  const chatId = useSelector((state) => state.QueryReducer.chatId);
  //Hàm fetch data toàn bộ thông tin tin nhắn của current User
  useEffect(() => {
    const getMessage = () => {
      const unsub = onSnapshot(doc(db, 'chats', chatId), (doc) => {
        doc.exists() && setMessages(doc.data()?.messages);
      });
      return () => {
        unsub();
      };
    };
    chatId && getMessage();
  }, [chatId]);
  // console.log("messages >>>", messages);
  return (
    <div className="messages-body">
      <Message messages={messages} />
    </div>
  );
};
export default MessageBox;
