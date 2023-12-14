import { Avatar } from 'antd';

const RecentChatContact = ({ chatsData, handleSelectCurrentContact }) => {
  return (
    <>
      {chatsData &&
        chatsData
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            const lastestMessage = chat[1]?.lastestMessage?.text;
            // console.log(lastestMessage);
            const getText = (lastestMessage) => {
              if (lastestMessage?.length > 0 && lastestMessage?.length < 20)
                return lastestMessage;
              if (lastestMessage?.length >= 20)
                return lastestMessage.slice(0, 20) + '...';
              else return '...';
            };

            return (
              <div
                className="contact-container"
                key={chat[1]?.userInfo?.uid}
                onClick={() => handleSelectCurrentContact(chat[1].userInfo)}
              >
                <Avatar
                  src={chat[1]?.userInfo?.photoURL}
                  className="avatar-contact"
                />
                <div className="contact-detail">
                  <h3>{chat[1]?.userInfo?.displayName}</h3>
                  <p>{getText(lastestMessage)}</p>
                </div>
              </div>
            );
          })}
    </>
  );
};
export default RecentChatContact;
