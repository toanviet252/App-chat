import {
  SendOutlined,
  FileImageOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Tooltip, message } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import InputEmoji from 'react-input-emoji';
import './SendMessage.scss';
import { sendMessage } from '../../../../apis/chat';

const SendMessage = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const currentUser = useSelector((state) => state.Auth.currentUser);
  const chatId = useSelector((state) => state.QueryReducer.chatId);
  const chooseUserContact = useSelector(
    (state) => state.Auth.chooseContactUser,
  );
  const [borderColor, setBorderColor] = useState('#EAEAEA');
  const inputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const supportFile = ['jpeg', 'jpg', 'png', 'gif'];

  const handleSend = async () => {
    if (!chatId || !currentUser || !chooseUserContact) return;
    if (!text || !image) return;
    const res = await sendMessage(
      chatId,
      text,
      image,
      currentUser.uid,
      chooseUserContact.uid,
    );
    if (res) {
      setText('');
      setImage(null);
      setPreviewImage(null);
    }
  };
  const onSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  const handlePressEnter = (value) => {
    // e.preventDefault();
    if (!value || value.trim().length < 0) return;
    handleSend();
  };
  const handlePreviewImage = (file) => {
    if (!file) return;
    const fileType = file.type.split('/')[1];
    if (!supportFile.includes(fileType)) {
      return message.error('Just only support image file.');
    }
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  return (
    <>
      <div className="file-upload-container">
        {previewImage && (
          <div className="preview-container">
            <CloseOutlined className="close-icon" onClick={handleRemoveImage} />
            <img src={previewImage} alt="preview-img" className="preview-img" />
          </div>
        )}
      </div>
      <form className="input-message-container" onSubmit={onSubmit}>
        <div className="input-message-feild">
          <InputEmoji
            value={text}
            onChange={(value) => setText(value)}
            placeholder="Type your message"
            borderColor={borderColor}
            onFocus={() => setBorderColor('#5eb2d3')}
            ref={inputRef}
            onEnter={handlePressEnter}
          />
          <Tooltip title="Upload a photo" color="blue">
            <label className="add-image-btn" htmlFor="fileUpLoad">
              <FileImageOutlined />
            </label>
          </Tooltip>
        </div>
        {(text?.trim().length > 0 || image !== null) && (
          <button className="send-btn btn" type="submit">
            <SendOutlined />
          </button>
        )}
      </form>
      <input
        type="file"
        id="fileUpLoad"
        onChange={(e) => {
          handlePreviewImage(e.target.files[0]);
        }}
        style={{ display: 'none' }}
      />
    </>
  );
};
export default SendMessage;
