import { message } from 'antd';
import { query, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/Firebase/firebase';

export const queryData = async (collectionName, param) => {
  try {
    let q;
    if (param) {
      const colectionRef = doc(db, collectionName, param);
      const snapShot = await getDoc(colectionRef);
      if (snapShot.exists()) {
        return Object.entries(snapShot.data());
      }
    } else {
      q = query(collection(db, collectionName));
    }
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (err) {
    console.log(err);
    message.error(err.message);
  }
};
