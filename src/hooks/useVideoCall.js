import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { message } from 'antd';
import { useRef } from 'react';
import ZIM from 'zego-zim-web';
import { generateToken } from '../apis/calling';
import callAudio from '../assets/call_ringtone.mp3';
import outgoingAudio from '../assets/outgoing_ringtone.mp3';
import { sendMessage } from '../apis/chat';
import { generateCombinedId } from '../apis/createChatroom';

export const useVideoCall = (currentUser) => {
  const zegoCloudInstance = useRef(null);
  const endPoints = process.env.REACT_APP_SERVER_URL;

  const init = async (appID) => {
    try {
      if (!currentUser?.uid) return;
      const { token } = await generateToken(endPoints, currentUser.uid);
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        token,
        null,
        currentUser.uid,
        currentUser.displayName,
      );
      zegoCloudInstance.current = ZegoUIKitPrebuilt.create(kitToken);
      zegoCloudInstance.current.addPlugins({ ZIM });

      // Custom config for calls
      zegoCloudInstance.current.setCallInvitationConfig({
        ringtoneConfig: {
          imcomingCallUrl: callAudio,
          outgoingCallUrl: outgoingAudio,
        },
      });
    } catch (err) {
      console.log(err);
      message.error(err.message);
    }
  };

  const handleCall = (callToUser, callType, additionalFunc) => {
    if (!callToUser?.uid) return;
    const callee = callToUser.uid;
    const targetUser = {
      userID: callee,
      userName: callToUser.displayName,
    };

    zegoCloudInstance.current
      .sendCallInvitation({
        callees: [targetUser],
        callType: callType,
        timeout: 60, // call will cancel after 60 seconds
      })
      .then((res) => {
        console.log('response call:', res);
        if (res.errorInvitees.length) {
          message.error('User is offline or does not exist');
        }
        additionalFunc && additionalFunc();

        zegoCloudInstance.current.setCallInvitationConfig({
          onCallInvitationEnded: async (reason, data) => {
            console.log('Call ended here:', reason, data);
            const chatId = generateCombinedId(currentUser.uid, callee);
            let text = '';
            switch (reason) {
              case 'LeaveRoom':
                text = '☎ Incoming call ended.';
                break;
              case 'Declined':
              case 'Canceled':
                text = '📞 You missed the call.';
                break;
              default:
                text = 'You receive a call';
                break;
            }
            // console.log(text);
            if (chatId) {
              await sendMessage(chatId, text, null, currentUser.uid, callee);
            }
          },
        });
      })
      .catch((err) => {
        const error = JSON.parse(err);
        console.log(error);
        message.error(error.message);
      });
  };

  return { init, handleCall };
};
