import { useState } from 'react';
import { userKit } from '../../../../constants/userkit';
import './userkit.scss';
import { message } from 'antd';

const UserKit = () => {
  const popup = () => message.warning('Function is not yet available');
  const [activeTab, setActiveTab] = useState(1);
  const handleSelectTab = (id) => {
    setActiveTab(id);
  };
  return (
    <>
      <div className="user-kit-container">
        <ul className="user-kit-list">
          {userKit.map((kit) => (
            <li
              className={`kit-items ${kit.id === activeTab ? 'active' : ''}`}
              key={kit.id}
              onClick={() => handleSelectTab(kit.id)}
            >
              <div className="kit-icon">
                <i
                  className={`fa fa-lg ${kit.iconContext}`}
                  aria-hidden="true"
                />
              </div>
              <p>{kit.title}</p>
            </li>
          ))}
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

      {/* Outlet */}
      <div className="outlet-container">
        {activeTab &&
          userKit
            .filter((kit) => kit.id === activeTab)
            .map((kit) => kit.content)}
      </div>
    </>
  );
};
export default UserKit;
