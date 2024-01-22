import { useContext } from 'react';
import styles from './index.less';
import { MessageContext } from '@/context/MessageContext';

export default function IndexPage() {
  const messageData = useContext(MessageContext);
  console.log(messageData, 'messageData');
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <p className={styles.title}>vscode传来的消息</p>
      {messageData.map((message, index) => (
        <p key={index}>{JSON.stringify(message)}</p>
      ))}
    </div>
  );
}
