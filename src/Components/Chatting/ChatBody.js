import React from 'react';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import HeadUser from './Components/HeadUser/HeadUser';
import UserKit from './Components/UserKit/UserKit';
import HeadChat from './Components/HeadChatBox/HeadChat';
import MessageBox from './Components/MessageBox/MessageBox';
import SendMessage from './Components/SendMessage/SendMessage';
import TemplateChat from '../TemplateChat/TemplateChat';
import './ChatBody.scss';

const ChatBody = () => {
  const isChooseContact = useSelector((state) => state.Auth.isChooseContact);
  return (
    <>
      <div className="body-chat-wrapper">
        <Row className="body-main">
          <Col
            lg={10}
            md={10}
            sm={isChooseContact ? 0 : 24}
            xs={isChooseContact ? 0 : 24}
            className="sidebar-chat"
          >
            <HeadUser />
            <UserKit />
          </Col>
          <Col
            lg={14}
            md={14}
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
    </>
  );
};
export default ChatBody;
