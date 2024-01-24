import { createContext } from 'react';
import { TreeProps } from 'antd';

export const MessageContext = createContext<{
  treeData: TreeProps['treeData'];
  paths: OpenAPIPathMapValue[];
}>({
  treeData: [],
  paths: [],
});
