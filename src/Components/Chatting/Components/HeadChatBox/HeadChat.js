import './HeadChat.scss';
import {
  ArrowLeftOutlined,
  SearchOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Input, message, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AuthAction } from '../../../../redux/configureStore';
import { useState } from 'react';

const HeadChat = () => {
  const chooseUserContact = useSelector(
    (state) => state.Auth.chooseContactUser,
  );
  const dispatch = useDispatch();
  const setIsChooseContact = (boolean) => {
    dispatch(AuthAction.setIsChooseContact(boolean));
  };
  const [openSearch, setOpenSearch] = useState(false);
  const handleOpenSearch = () => setOpenSearch(!openSearch);
  const [textFind, setTextFind] = useState('');
  // console.log(textFind);
  const popup = () => message.warning('Function is not yet available');
  return (
    <div className="wrapper-head-chat">
      <div className="head-chat-container">
        <div className="contact-name-contaienr">
          <Tooltip title="back" color="blue">
            <button
              className="back-to-contact"
              onClick={() => setIsChooseContact(false)}
            >
              <ArrowLeftOutlined />
            </button>
          </Tooltip>
          <h2>{chooseUserContact?.displayName}</h2>
        </div>
        <div className="chat-toolkit-container">
          <button
            className="kit-btn"
            style={{ marginRight: '0.8rem' }}
            onClick={handleOpenSearch}
          >
            <Tooltip title="find message" color="blue">
              <SearchOutlined />
            </Tooltip>
          </button>

          <button className="kit-btn" onClick={popup}>
            <Tooltip title="video call" color="blue">
              <VideoCameraOutlined />
            </Tooltip>
          </button>
        </div>
      </div>
      {openSearch && (
        <div className="find-message-container">
          <Input
            placeholder="find message"
            value={textFind}
            onChange={(e) => setTextFind(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
export default HeadChat;
