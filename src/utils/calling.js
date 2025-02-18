import { message } from 'antd';

export const handleCall = (callType, callToUser, zegoCloudInstance) => {
  if (!callToUser?.uid) return;
  const callee = callToUser.uid;
  const targetUser = {
    userID: callee,
    userName: callToUser.displayName,
  };
  // console.log(targetUser);
  zegoCloudInstance.current
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
    })
    .catch((err) => {
      const error = JSON.parse(err);
      console.log(error);
      message.error(error.message);
    });
};
