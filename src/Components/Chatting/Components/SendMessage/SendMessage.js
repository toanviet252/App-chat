import { SendOutlined, FileImageOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useRef, useState } from 'react';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
// import { db, storage } from '../../../utils/Firebase/firebase';
import { db, storage } from '../../../../utils/Firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import InputEmoji from 'react-input-emoji';
import './SendMessage.scss';

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

  const handleSend = async () => {
    if (image) {
      const storageRef = ref(storage, `${uuid()}.${image.name}`);
      const upLoadTask = uploadBytesResumable(storageRef, image);
      upLoadTask.on(
        'state_changed',
        null, //có thể thêm snapshot để cập nhật progress tại đây
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(upLoadTask.snapshot.ref).then(async (downloadURL) => {
            try {
              await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            } catch (err) {
              console.log('err when upload image', err);
            }
          });
        },
      );
    } else {
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [chatId + '.lastestMessage']: {
        text,
      },
      [chatId + '.date']: serverTimestamp(),
    });
    await updateDoc(doc(db, 'userChats', chooseUserContact?.uid), {
      [chatId + '.lastestMessage']: {
        text,
      },
      [chatId + '.date']: serverTimestamp(),
    });

    setText('');
    setImage(null);
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

  return (
    <>
      <div className="file-upload-container">
        <p>{image?.name}</p>
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
        onChange={(e) => setImage(e.target.files[0])}
        style={{ display: 'none' }}
      />
    </>
  );
};
export default SendMessage;
