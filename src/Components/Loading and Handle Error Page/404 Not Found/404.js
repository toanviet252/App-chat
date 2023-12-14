// import { useNavigate } from 'react-router-dom';
import { ReactComponent as NotFoundIcon } from '../../../svg/page-not-found.svg';
import './404.scss';
const NotFoundPage = () => {
  return (
    <div className="not-found-page-container">
      <NotFoundIcon />
      <h1 className="not-found-title">
        <p>404! </p>
        <p>Page Not Found</p>
        <button>
          <a href="/chat">Back to chat!</a>
        </button>
      </h1>
    </div>
  );
};
export default NotFoundPage;
