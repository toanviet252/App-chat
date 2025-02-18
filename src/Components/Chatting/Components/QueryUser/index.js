import { Avatar } from 'antd';
import Loading from '../../../Loading and Handle Error Page/Loading';
import './index.scss';

const QueryUser = ({ user, handleSelect, loading }) => {
  return (
    <>
      {loading ? (
        <Loading height={40} />
      ) : (
        <>
          {user &&
            user.map((user) => (
              <div
                className="contact-container search-user-container"
                key={user.uid}
              >
                <Avatar src={user.photoURL} className="avatar-contact" />
                <div
                  className="contact-detail"
                  onClick={() => handleSelect(user)}
                >
                  <h3>{user.displayName}</h3>
                </div>
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default QueryUser;
