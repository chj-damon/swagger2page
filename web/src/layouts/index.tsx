import { useKeepOutlets } from '@umijs/max';
import { Layout } from 'antd';

const { Content } = Layout;

export default () => {

  const element = useKeepOutlets();

  return (
    <Layout style={{ height: '100%' }}>
      <Layout style={{ height: '100%' }}>
        <Content style={{ height: '100%', padding: 16 }}>{element}</Content>
      </Layout>
    </Layout>
  );
}
