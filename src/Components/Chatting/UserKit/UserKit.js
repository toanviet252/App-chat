import "./userkit.scss";
import { message } from "antd";

const UserKit = () => {
  const popup = () => message.warning("Function is not yet available");
  return (
    <>
      <div className="user-kit-container">
        <ul className="user-kit-list">
          <li className="kit-items" onClick={popup}>
            <div className="kit-icon">
              <i className="fa fa-lg fa-comments" aria-hidden="true"></i>
            </div>
            <p>Chats</p>
          </li>
          <li className="kit-items" onClick={popup}>
            <div className="kit-icon">
              <i className="fa fa-lg fa-phone-square" aria-hidden="true"></i>
            </div>
            <p>Calls</p>
          </li>
          <li className="kit-items" onClick={popup}>
            <div className="kit-icon">
              <i className="fa fa-lg fa-address-book" aria-hidden="true"></i>
            </div>
            <p>Contact</p>
          </li>
          <li className="kit-items" onClick={popup}>
            <div className="kit-icon">
              <i className="fa fa-lg fa-bell" aria-hidden="true"></i>
            </div>
            <p>Notifications</p>
          </li>
        </ul>
      </div>
      <div className="meet-chat-container">
        <button className="meet-chat-btn" onClick={popup}>
          <i className="fa fa-video-camera" aria-hidden="true"></i> Meet now
        </button>
        <button className="meet-chat-btn" onClick={popup}>
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i> New Chat
        </button>
      </div>
    </>
  );
};
export default UserKit;
