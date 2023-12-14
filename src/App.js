import './App.scss';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React, { useEffect, Suspense } from 'react';

import Login from './pages/Login/LoginComponent';
import Loading from './Components/Loading and Handle Error Page/LoadingPage/Loading';
import { auth } from './utils/Firebase/firebase';
import { AuthAction } from './redux/configureStore';
import ForgotPassword from './pages/ResetPass';
import NotFoundPage from './Components/Loading and Handle Error Page/404 Not Found/404';

// Sử dụng Lazy Loading
const RegisterUser = React.lazy(() => import('./pages/RegisterUser/Register'));
const ChatBody = React.lazy(() => import('./Components/Chatting/ChatBody'));

function App() {
  const dispatch = useDispatch();
  const setCurrentUser = (user) => {
    dispatch(AuthAction.setCurrentUser(user));
  };
  const setCurrentUserPhoto = (imgUser) => {
    dispatch(AuthAction.setCurrentUserPhoto(imgUser));
  };
  const logIn = () => {
    dispatch(AuthAction.logIn());
  };
  const navigate = useNavigate();
  useEffect(() => {
    // console.log("current User by Google", auth.currentUser);
    // console.log("current User when login", currentUser);
    (async () => {
      try {
        await auth._initializationPromise;
        if (auth.currentUser) {
          const { uid, displayName, photoURL, phoneNumber, dateOfBirth } =
            auth.currentUser;
          setCurrentUser({
            uid,
            displayName,
            photoURL,
            phoneNumber,
            dateOfBirth,
          });
          setCurrentUserPhoto(photoURL);
          logIn();
          // navigate('/chat');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatBody />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
