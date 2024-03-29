import './Message.scss';
import { Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { getTimeFromTimeStamp } from '../../helpers/convertTimeStamp';

const Message = ({ messages }) => {
  const currentUser = useSelector((state) => state.Auth.currentUser);
  const chooseUserContact = useSelector(
    (state) => state.Auth.chooseContactUser,
  );
  const messageRef = useRef();
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {messages?.map((message) => {
        return (
          <div
            className={`message-feild ${
              message?.senderId === currentUser?.uid ? 'owner' : ''
            }`}
            key={message.id}
            ref={messageRef}
          >
            <div className="message-infor">
              <Avatar
                src={
                  message.senderId === currentUser?.uid
                    ? currentUser?.photoURL
                    : chooseUserContact?.photoURL
                }
                className="avatar-mesg"
              />
              <span>
                <em>{getTimeFromTimeStamp(message.date.seconds)}</em>
              </span>
            </div>
            <div className="message-content">
              {message.text.length > 0 ? (
                <p className="message-text">{message.text}</p>
              ) : (
                ''
              )}
              {message.img && (
                <img className="message-img" src={message.img} alt="send-img" />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
export default Message;
