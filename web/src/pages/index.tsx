import { useNavigate } from '@umijs/max';
import { Button } from 'antd';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Yay! Welcome to umi!</h2>
      <Button onClick={() => navigate('/docs')}>docs</Button>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
    </div>
  );
}
