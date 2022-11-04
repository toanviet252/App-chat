import "./HeadChat.scss";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AuthAction } from "../../../redux/configureStore";

const HeadChat = () => {
  const chooseUserContact = useSelector(
    (state) => state.Auth.chooseContactUser
  );
  const dispatch = useDispatch();
  const setIsChooseContact = (boolean) => {
    dispatch(AuthAction.setIsChooseContact(boolean));
  };
  return (
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
        <button className="kit-btn" style={{ marginRight: "0.8rem" }}>
          <Tooltip title="find message" color="blue">
            <SearchOutlined />
          </Tooltip>
        </button>

        <button className="kit-btn">
          <Tooltip title="video call" color="blue">
            <VideoCameraOutlined />
          </Tooltip>
        </button>
      </div>
    </div>
  );
};
export default HeadChat;
