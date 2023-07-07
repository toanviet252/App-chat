import { Avatar } from 'antd';
import { PhoneTwoTone } from '@ant-design/icons';
import './index.scss';

const Contact = ({ userData, handleSelectCurrentContact, hasExtraCallUI }) => {
  if (!userData) return null;
  const userInfo = {
    photoURL: userData.photoURL,
    uid: userData.uid,
    displayName: userData.displayName,
  };

  return (
    <div className="contact-container">
      <Avatar src={userData.photoURL} className="avatar-contact" />
      <div
        className="contact-detail"
        onClick={() => handleSelectCurrentContact(userInfo)}
      >
        {!hasExtraCallUI ? (
          <h3>{userData.displayName}</h3>
        ) : (
          <div className="extra-ui-container">
            <h3>{userData.displayName}</h3>
            <PhoneTwoTone className="icon phone-icon" />
          </div>
        )}
      </div>
    </div>
  );
};
export default Contact;
