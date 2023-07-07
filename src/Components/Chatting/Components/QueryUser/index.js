import { Avatar } from 'antd';

const QueryUser = ({ user, handleSelect }) => {
  return (
    <>
      {user &&
        user.map((user) => (
          <div className="contact-container" key={user.uid}>
            <Avatar src={user.photoURL} className="avatar-contact" />
            <div className="contact-detail" onClick={() => handleSelect(user)}>
              <h3>{user.displayName}</h3>
            </div>
          </div>
        ))}
    </>
  );
};

export default QueryUser;
