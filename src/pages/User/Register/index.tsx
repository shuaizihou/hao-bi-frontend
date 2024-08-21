import Footer from '@/components/Footer';
import { getLoginUserUsingGet, userRegisterUsingPost } from '@/services/hao-bi/userController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'umi';
import Settings from '../../../../config/defaultSettings';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState, refresh } = useModel('@@initialState');

  const containerClassName = createStyles(() => {
    return {
      action: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
        backgroundImage:
          "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
        backgroundSize: '100% 100%',
      },
    };
  });
  const fetchUserInfo = async () => {
    const userInfo = await getLoginUserUsingGet();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s): any => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    try {
      const res = await userRegisterUsingPost(values);

      if (res.code === 0) {
        const defaultLoginSuccessMessage = '注册成功，请登录！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/user/login');
        refresh();
        return;
      } else {
        message.error(res.message);
      }
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { styles } = containerClassName();
  return (
    <div className={styles.action}>
      <Helmet>
        {'注册'}- {Settings.title}
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Re API"
          subTitle={'史上最好用的免费API接口平台'}
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码注册',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入账户'}
                rules={[
                  {
                    required: true,
                    message: '账户是必填项！',
                  },
                  {
                    min: 4,
                    type: 'string',
                    message: '账号不能小于4位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码不能小于8位！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码不能小于8位！',
                  },
                ]}
              />
            </>
          )}
          <div style={{ marginBottom: '20px' }}>
            <Link to="/user/login">已有账号</Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
