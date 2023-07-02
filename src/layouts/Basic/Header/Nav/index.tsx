import { Badge, Drawer, List, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import cls from './index.module.less';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import { msgChatNotify } from '@/ts/core';
import { kernel } from '@/ts/base';
import { ImLink } from 'react-icons/im';

/**
 * 顶部导航
 * @param
 * @returns
 */
const HeaderNav: React.FC<RouteComponentProps> = () => {
  const [onlineVisible, setOnlineVisible] = useState(false);
  const [msgKey, setMsgKey] = useState('');
  const [taskKey, setTaskKey] = useState('');
  const [workCount, setWorkCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [online, setOnline] = useState(0);
  useEffect(() => {
    const id = msgChatNotify.subscribe((key) => {
      let noReadCount = 0;
      for (const item of orgCtrl.chat.chats) {
        noReadCount += item.chatdata.noReadCount;
      }
      setMsgCount(noReadCount);
      setMsgKey(key);
    });
    const workId = orgCtrl.work.notity.subscribe(async (key) => {
      setWorkCount(orgCtrl.work.todos.length);
      setTaskKey(key);
    });
    kernel.onlineNotity.subscribe(() => {
      setOnline(kernel.Online.filter((i) => i.value != '0').length);
    });
    return () => {
      msgChatNotify.unsubscribe(id);
      orgCtrl.work.notity.unsubscribe(workId);
    };
  }, []);
  const navs = [
    {
      key: 'home',
      path: '/home',
      title: '门户',
      icon: 'home',
      count: 0,
      fath: '/home',
      onClick: () => {},
    },
    {
      key: msgKey,
      path: '/chat',
      title: '沟通',
      icon: 'chat',
      count: msgCount,
      fath: '/chat',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: taskKey,
      path: '/work',
      title: '办事',
      icon: 'work',
      count: workCount,
      fath: '/work',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: 'store',
      path: '/store',
      title: '存储',
      icon: 'store',
      count: 0,
      fath: '/store',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
    {
      key: 'setting',
      path: '/setting',
      title: orgCtrl.user.name,
      count: 0,
      icon: 'setting',
      fath: '/setting',
      onClick: () => {
        orgCtrl.currentKey = '';
        orgCtrl.changCallback();
      },
    },
  ];

  const getLinkItem = (item: any) => {
    return (
      <Link
        key={item.key}
        to={item.path}
        title={item.title}
        onClick={() => {
          item.onClick();
        }}>
        {item.key === 'setting' ? (
          <>
            <TeamIcon entityId={orgCtrl.user.id} size={28} title="设置" />
            <OrgIcons
              className={cls.settingIcon}
              size={13}
              type={item.icon}
              notAvatar
              selected={location.hash.startsWith('#' + item.fath)}
            />
          </>
        ) : (
          <OrgIcons
            size={26}
            type={item.icon}
            selected={location.hash.startsWith('#' + item.fath)}
          />
        )}
      </Link>
    );
  };

  return (
    <div className={cls['header-nav-container']}>
      <Space size={30}>
        {online > 0 && (
          <div
            style={{ display: 'flex', cursor: 'pointer' }}
            onClick={() => setOnlineVisible(!onlineVisible)}>
            <Badge count={online} size="small">
              <ImLink size={22} color={'#4CAF50'} />
            </Badge>
          </div>
        )}
        {navs.map((item) => {
          if (item.count > 0) {
            return (
              <Badge key={item.key} count={item.count} size="small">
                {getLinkItem(item)}
              </Badge>
            );
          } else {
            return getLinkItem(item);
          }
        })}
      </Space>
      <Drawer
        open={onlineVisible}
        width={300}
        placement="right"
        onClose={() => setOnlineVisible(false)}>
        <List
          itemLayout="horizontal"
          dataSource={kernel.Online.filter((i) => i.value != '0')}
          renderItem={(item) => {
            return (
              <List.Item style={{ cursor: 'pointer', padding: 6 }}>
                <List.Item.Meta
                  avatar={<TeamIcon entityId={item.value} size={28} showName />}
                />
              </List.Item>
            );
          }}
        />
      </Drawer>
    </div>
  );
};
export default withRouter(HeaderNav);
