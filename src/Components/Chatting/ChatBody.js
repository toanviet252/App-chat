import React, { useEffect } from 'react';
import { Row, Col, message } from 'antd';
import { useSelector } from 'react-redux';
import HeadUser from './Components/HeadUser/HeadUser';
import UserKit from './Components/UserKit/UserKit';
import HeadChat from './Components/HeadChatBox/HeadChat';
import MessageBox from './Components/MessageBox/MessageBox';
import SendMessage from './Components/SendMessage/SendMessage';
import TemplateChat from '../TemplateChat/TemplateChat';
import './ChatBody.scss';
// import SpotifyWiget from '../Spotify';
import VideoCall from '../VideoCall';
import { auth } from '../../utils/Firebase/firebase';
import { useNavigate } from 'react-router-dom';

const ChatBody = () => {
  const isChooseContact = useSelector((state) => state.Auth.isChooseContact);
  const navigate = useNavigate();
  useEffect(() => {
    (async function () {
      try {
        await auth._initializationPromise;
        if (!auth.currentUser) return navigate('/');

        // request permiss to push notification
        if (Notification.permission === 'default') {
          Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
              message.info('Notification is turn on!');
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  return (
    <>
      <div className="body-chat-wrapper">
        <Row className="body-main">
          <Col
            lg={10}
            md={12}
            sm={isChooseContact ? 0 : 24}
            xs={isChooseContact ? 0 : 24}
            className="sidebar-chat"
          >
            <HeadUser />
            <UserKit />
          </Col>
          <Col
            lg={14}
            md={12}
            sm={isChooseContact ? 24 : 0}
            xs={isChooseContact ? 24 : 0}
            className="message-container"
          >
            {isChooseContact ? (
              <>
                <HeadChat />
                <MessageBox />
                <SendMessage />
              </>
            ) : (
              <TemplateChat />
            )}
          </Col>
        </Row>
      </div>

      {/* <SpotifyWiget /> */}
      <VideoCall />
    </>
  );
};
export default ChatBody;
