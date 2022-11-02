import "./SendMessage.scss";
import { SendOutlined, FileImageOutlined } from "@ant-design/icons";
import { Tooltip, Input } from "antd";
import { useState } from "react";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../utils/Firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const SendMessage = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const currentUser = useSelector((state) => state.Auth.currentUser);
  const chatId = useSelector((state) => state.QueryReducer.chatId);
  const chooseUserContact = useSelector(
    (state) => state.Auth.chooseContactUser
  );
  const handleSend = async () => {
    if (image) {
      const storageRef = ref(storage, uuid());
      const upLoadTask = uploadBytesResumable(storageRef, image);
      upLoadTask.on(
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(upLoadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [chatId + ".lastestMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", chooseUserContact?.uid), {
      [chatId + ".lastestMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImage(null);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  return (
    <div>
      <div className="file-upload-container">
        <p>{image?.name}</p>
      </div>
      <form className="input-message-container" onSubmit={onSubmit}>
        <div className="input-message-feild">
          <Input.TextArea
            placeholder="Wrire something here!"
            name="message"
            id="message"
            autoSize={{
              minRows: 1,
              maxRows: 3,
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* <Upload {...props}> */}
          <Tooltip title="Upload file" color="blue">
            <label className="add-image-btn" htmlFor="fileUpLoad">
              <FileImageOutlined />
            </label>
          </Tooltip>
          {/* </Upload> */}
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
        style={{ display: "none" }}
      />
    </div>
  );
};
export default SendMessage;