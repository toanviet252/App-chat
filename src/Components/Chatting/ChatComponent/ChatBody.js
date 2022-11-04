import "./ChatBody.scss";
import React from "react";
import { Row, Col } from "antd";
import HeadUser from "../HeadUser/HeadUser";
import UserKit from "../UserKit/UserKit";
import ContactUser from "../ContactUser/ContactUser";
import MessageBox from "../MessageBox/MessageBox";
import SendMessage from "../SendMessage/SendMessage";
import HeadChat from "../HeadChatBox/HeadChat";
import TemplateChat from "../../TemplateChat/TemplateChat";
import { useSelector } from "react-redux";

const ChatBody = () => {
  const isChooseContact = useSelector((state) => state.Auth.isChooseContact);
  return (
    <>
      <div className="body-chat-wrapper">
        <Row className="body-main">
          <Col
            lg={10}
            sm={12}
            xs={isChooseContact ? 0 : 24}
            className="sidebar-chat"
          >
            <HeadUser />
            <UserKit />
            <ContactUser />
          </Col>
          <Col
            lg={14}
            sm={12}
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
