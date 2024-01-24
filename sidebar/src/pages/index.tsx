import { vscode } from '@/constant';
import styles from './index.less';
import { Button, Tree } from 'antd';
import { useContext } from 'react';
import { MessageContext } from '@/context/MessageContext';

import getPng from '@/assets/get.png';
import postPng from '@/assets/post.png';
import putPng from '@/assets/put.png';
import deletePng from '@/assets/delete.png';

const iconMapping = {
  get: getPng,
  post: postPng,
  put: putPng,
  delete: deletePng,
};

export default function IndexPage() {
  const { treeData, paths } = useContext(MessageContext);

  const treeDataWithIcon = treeData?.map((item) => ({
    ...item,
    children: item.children?.map((child) => ({
      ...child,
      children: child.children?.map((c) => ({
        ...c,
        icon: (
          <img
            src={iconMapping[c.icon as keyof typeof iconMapping]}
            style={{ width: 24 }}
          />
        ),
      })),
    })),
  }));

  /**
   * 选中一个接口
   */
  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.selected) {
      const path = paths.find((p) => p.path === selectedKeys[0]);
      if (path) {
        console.log('选中了一个接口', path);
        vscode.postMessage({ type: 'webview', data: path });
      }
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>你好，欢迎使用swagger2page</p>
      <Tree
        showLine
        showIcon
        treeData={treeDataWithIcon}
        onSelect={handleSelect}
      />
    </div>
  );
}
