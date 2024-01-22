import { vscode } from '@/constant';
import styles from './index.less';
import { Button } from 'antd';
import { useContext } from 'react';
import { MessageContext } from '@/context/MessageContext';

export default function IndexPage() {
  const messageData = useContext(MessageContext);

  return (
    <div className={styles.container}>
      <p className={styles.title}>你好，欢迎使用swagger2page</p>
      <Button
        block
        type="default"
        onClick={() => {
          vscode.postMessage({ type: 'alert', text: '加油' });
        }}
      >
        发送消息给vscode
      </Button>
      <Button
        block
        type="default"
        onClick={() => {
          vscode.postMessage({ type: 'webview' });
        }}
      >
        打开webview
      </Button>
      <p className={styles.title}>vscode传来的消息</p>
      {messageData.map((message, index) => (
        <p key={index}>{JSON.stringify(message)}</p>
      ))}
    </div>
  );
}
