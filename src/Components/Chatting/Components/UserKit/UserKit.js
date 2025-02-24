import { useState } from 'react';
import { userKit } from '../../../../constants/userkit';
import './userkit.scss';

const UserKit = () => {
  // const popup = () => message.warning('Function is not yet available');
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
              className={`kit-items ${kit.id === activeTab ? 'active' : ''} ${
                !kit.enable ? 'disable' : ''
              }`}
              key={kit.id}
              onClick={() => {
                kit.enable && handleSelectTab(kit.id);
              }}
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

      {/* <div className="meet-chat-container">
        <button className="meet-chat-btn" onClick={popup}>
          <i className="fa fa-video-camera" aria-hidden="true"></i> Meet now
        </button>
        <button className="meet-chat-btn" onClick={popup}>
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i> New Chat
        </button>
      </div> */}

      {/* Outlet */}
      <div className="outlet-container">
        {activeTab && userKit.find((kit) => kit.id === activeTab)?.content}
      </div>
    </>
  );
};
export default UserKit;
