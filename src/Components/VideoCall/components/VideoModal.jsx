import { Modal } from 'antd';
import { useContext, useEffect, useRef } from 'react';
import VideoContext from '../../../contexts/VideoContext';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import './index.scss';
// import { useSelector } from 'react-redux';
import { getUrlParams, randomID } from '../../../helpers/createRamdonRoomId';

const VideoModal = () => {
  const { setOpenVideoModal, openVideoModal, callToUser } =
    useContext(VideoContext);
  const closeModal = () => {
    setOpenVideoModal(false);
  };

  // const currentUser = useSelector((state) => state.Auth.currentUser);

  const myMeetingRef = useRef(null);
  const appID = +process.env.REACT_APP_ZEGOAPPID;

  const generateToken = async (tokenServerUrl, userID) => {
    try {
      const res = await fetch(`${tokenServerUrl}/?userId=${userID}`, {
        method: 'GET',
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const roomID = getUrlParams().get('roomID') || randomID(5);

  useEffect(() => {
    let myMeeting = async (element) => {
      // generate token
      const token = await generateToken(
        'https://app-chat-server-beige.vercel.app',
        callToUser?.uid,
      );

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        token.token,
        roomID,
        callToUser?.uid,
        callToUser?.displayName,
      );
      // create instance object from token
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // start the call
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
              window.location.origin +
              window.location.pathname +
              '?roomID=' +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
        onJoinRoom: () => {
          console.log('call to >>>', callToUser?.displayName);
        },
        // onUserAvatarSetter: (userList) => {
        //   console.log('userList', userList);
        //   userList.forEach((user) => {
        //     if (currentUser) {
        //       user.setUserAvatar(currentUser.photoURL);
        //     }
        //   });
        // },
      });
    };

    if (callToUser && myMeetingRef.current && openVideoModal) {
      myMeeting(myMeetingRef.current);
    }
  }, [callToUser, myMeetingRef.current, openVideoModal]);
  return (
    <>
      <Modal
        open={openVideoModal}
        onCancel={closeModal}
        className="calling-modal-container"
      >
        <h3>Calling to: {callToUser?.displayName}</h3>
        <div
          className="myCallContainer"
          ref={myMeetingRef}
          style={{ width: '100%', height: '100%' }}
        ></div>
      </Modal>
    </>
  );
};
export default VideoModal;
