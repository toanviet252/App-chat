import { useState } from 'react';
import { resetPassword } from '../../utils/Firebase/firebase';
import { Form, Input, message } from 'antd';
import './index.scss';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [emailMessage, setEmailMessage] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      console.log(values);
      const { email } = values;
      try {
        await resetPassword(email);
        setEmailMessage(true);
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/user-not-found') {
          message.error('User not found!');
        } else {
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-pass-container">
        {emailMessage ? (
          <>
            <div style={{ textAlign: 'center' }}>
              <h3>The Email has been sent. Check your Inbox!</h3>
              <button className="btn" onClick={() => navigate('/')}>
                Back to login
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Type your email to reset password:</h3>
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: 'email',
                  },
                ]}
              >
                <Input
                  name="email"
                  placeholder="name@email.com"
                  className="control"
                />
              </Form.Item>

              <button type="submit" className="btn reset-btn">
                Reset
              </button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
