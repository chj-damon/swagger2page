import { vscode } from '@/constant';
import { MessageContext } from '@/context/MessageContext';
import { useEffect, useState } from 'react';
import { IRouteComponentProps } from 'umi';

export default ({ children }: IRouteComponentProps) => {
  const [messageData, setMessageData] = useState([]);

  // 在系统初始化时，向vscode发送消息
  useEffect(() => {
    vscode.postMessage({ type: 'init' });
  }, []);

  // 监听vscode传来的消息
  useEffect(() => {
    window.addEventListener('message', (event) => {
      const message = event.data; // The JSON data our extension sent
      switch (message.type) {
        case 'init':
          setMessageData(message.data);
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <MessageContext.Provider value={messageData}>
      {children}
    </MessageContext.Provider>
  );
};
