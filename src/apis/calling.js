export const generateToken = async (tokenServerUrl, currentUserId) => {
  try {
    if (!currentUserId) throw new Error('Current user ID is required');
    const res = await fetch(`${tokenServerUrl}/?userId=${currentUserId}`, {
      method: 'GET',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error('Token generation failed');
  }
};
