import { Modal, message } from 'antd';
import { useContext, useEffect, useRef } from 'react';
import VideoContext from '../../../contexts/VideoCall/VideoContext';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import './index.scss';
import { useSelector } from 'react-redux';
import { ZIM } from 'zego-zim-web';
import callAudio from '../../../assets/call_ringtone.mp3';
import outgoingAudio from '../../../assets/outgoing_ringtone.mp3';

const VideoModal = () => {
  const { setOpenVideoModal, openVideoModal, callToUser } =
    useContext(VideoContext);
  const closeModal = () => {
    setOpenVideoModal(false);
  };

  const currentUser = useSelector((state) => state.Auth.currentUser);

  const appID = +process.env.REACT_APP_ZEGOAPPID;
  // const serverSecret = process.env.REACT_APP_SERVER_SECRET;

  const generateToken = async (tokenServerUrl, userID) => {
    try {
      if (!currentUser?.uid) throw new Error('current user id is required');
      const res = await fetch(`${tokenServerUrl}/?userId=${userID}`, {
        method: 'GET',
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const zegoCloundInstance = useRef(null);
  const init = async () => {
    try {
      if (!currentUser?.uid) return;
      const { token } = await generateToken(
        'https://app-chat-server-beige.vercel.app',
        currentUser.uid,
      );
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        token,
        null,
        currentUser.uid,
        currentUser.displayName,
      );
      zegoCloundInstance.current = ZegoUIKitPrebuilt.create(kitToken);
      zegoCloundInstance.current.addPlugins({ ZIM });

      // custom config
      zegoCloundInstance.current.setCallInvitationConfig({
        ringtoneConfig: {
          imcomingCallUrl: callAudio,
          outgoingCallUrl: outgoingAudio,
        },

        onCallInvitationEnded: (reason, data) => {
          // add call message notificaion to user
          console.log('end call', reason, data);
        },
      });
    } catch (err) {
      console.log(err);
      message.error(err.message);
    }
  };

  const handleCall = (callType) => {
    if (!callToUser?.uid) return;
    const callee = callToUser.uid;
    const targetUser = {
      userID: callee,
      userName: callToUser.displayName,
    };
    // console.log(targetUser);
    zegoCloundInstance.current
      .sendCallInvitation({
        callees: [targetUser],
        callType: callType,
        timeout: 60, //call will cancel until 60s
      })
      .then((res) => {
        console.log(res);
        if (res.errorInvitees.length) {
          message.error('User is offline or not exist');
        }
        closeModal();
      })
      .catch((err) => {
        const error = JSON.parse(err);
        console.log(error);
        message.error(error.message);
      });
  };

  useEffect(() => {
    init();
  }, [currentUser]);

  return (
    <>
      <Modal
        open={openVideoModal}
        onCancel={closeModal}
        className="calling-modal-container"
        footer={false}
        bodyStyle={{
          borderRadius: '2rem',
        }}
      >
        <h3 className="call-title">Calling to: {callToUser?.displayName}</h3>
        <div className="action-call-container">
          <button
            onClick={() =>
              handleCall(ZegoUIKitPrebuilt.InvitationTypeVideoCall)
            }
            className="action-btn"
          >
            <i className="fa fa-video-camera" aria-hidden="true"></i>
            Video call
          </button>

          <button
            onClick={() =>
              handleCall(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)
            }
            className="action-btn"
          >
            <i className="fa fa-phone" aria-hidden="true"></i>
            Voice call
          </button>
        </div>
      </Modal>
    </>
  );
};
export default VideoModal;
