import { vscode } from '@/constant';
import { MessageContext } from '@/context/MessageContext';
import { useEffect, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import { TreeProps } from 'antd';

export default ({ children }: IRouteComponentProps) => {
  const [treeData, setTreeData] = useState<TreeProps['treeData']>([]);
  const [paths, setPaths] = useState<OpenAPIPathMapValue[]>([]);

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
          const { root, paths } = message.data;
          setTreeData([root]);
          setPaths(paths);
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <MessageContext.Provider value={{ treeData, paths }}>
      {children}
    </MessageContext.Provider>
  );
};
