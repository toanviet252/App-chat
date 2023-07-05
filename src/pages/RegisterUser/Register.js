import './register.scss';
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  createUserByEmailAndPass,
  createUserDocumentFromAuth,
  storage,
  db,
} from '../../utils/Firebase/firebase';
import { updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import RegisterForm from './Components/RegisterForm';

const RegisterUser = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  //Create authenticated user and post to Firestore
  const onCreate = async (values) => {
    // console.log("upload File >>>", values.uploadFile);
    const { email, password, dateBirth, phoneNumber, displayName, uploadFile } =
      values;
    const dateOfBirth = dateBirth.format('DD/MM/YYYY');

    //Create user with email and password
    console.log(uploadFile);
    try {
      setIsRegister(true);
      const { user } = await createUserByEmailAndPass(email, password);
      const storageRef = ref(storage, `${displayName}_${uploadFile.name}`);
      await uploadBytesResumable(storageRef, uploadFile).then(() => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          try {
            //Update profile before create user on fireStore
            await updateProfile(user, {
              displayName,
              photoURL: downloadUrl,
            });
            //create User on firestore
            await createUserDocumentFromAuth(user, {
              dateOfBirth,
              phoneNumber,
              uid: user.uid,
            });
            //create user chat data on firestore
            await setDoc(doc(db, 'userChats', user.uid), {});
            setIsRegister(false);
            navigate('/');
            message.success('Register account success');
          } catch (err) {
            console.log('err when create users', err);
            setIsRegister(false);
          }
        });
      });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        message.warning(
          'Email has already in used. Please choose another email!',
        );
        setIsRegister(false);
      } else {
        console.log('Error from create user >>>>', err);
        setIsRegister(false);
      }
    }
  };
  const onSubmit = () => {
    form.validateFields().then((values) => {
      onCreate(values);
      // form.resetFields();
    });
  };
  return (
    <div className="register-wrapper">
      <div className="register-form-container">
        <h1>Register account</h1>
        <RegisterForm form={form} isRegister={isRegister} onSubmit={onSubmit} />
      </div>
    </div>
  );
};
export default RegisterUser;
