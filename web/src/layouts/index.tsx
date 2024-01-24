import { vscode } from '@/constant';
import { MessageContext } from '@/context/MessageContext';
import { Outlet } from '@umijs/max';
import { useEffect, useState } from 'react';

export default () => {
  const [pathInfo, setPathInfo] = useState<OpenAPIPathMapValue | undefined>(
    undefined,
  );

  // 在系统初始化时，向vscode发送消息
  useEffect(() => {
    vscode.postMessage({ type: 'init' });
  }, []);

  // 监听vscode传来的消息
  useEffect(() => {
    window.addEventListener('message', (event) => {
      const message = event.data; // 从插件过来的数据
      switch (message.type) {
        case 'init':
          setPathInfo(message.data);
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <MessageContext.Provider value={{ pathInfo }}>
      <Outlet />
    </MessageContext.Provider>
  );
};
