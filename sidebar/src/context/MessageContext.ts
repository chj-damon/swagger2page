import { TreeProps } from 'antd';
import { createContext } from 'react';

export const MessageContext = createContext<{
  treeData: TreeProps['treeData'];
  paths: OpenAPIPathMapValue[];
}>({
  treeData: [],
  paths: [],
});
