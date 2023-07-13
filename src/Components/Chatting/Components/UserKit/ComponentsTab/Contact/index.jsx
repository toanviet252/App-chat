import { Avatar } from 'antd';
import { PhoneTwoTone } from '@ant-design/icons';
import './index.scss';
import { useContext } from 'react';
import VideoContext from '../../../../../../contexts/VideoContext';

const Contact = ({ userData, handleSelectCurrentContact, hasExtraCallUI }) => {
  if (!userData) return null;
  const userInfo = {
    photoURL: userData.photoURL,
    uid: userData.uid,
    displayName: userData.displayName,
  };
  const { setOpenVideoModal } = useContext(VideoContext);
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
          <div
            className="extra-ui-container"
            onClick={() => setOpenVideoModal(true)}
          >
            <h3>{userData.displayName}</h3>
            <PhoneTwoTone className="icon phone-icon" />
          </div>
        )}
      </div>
    </div>
  );
};
export default Contact;
