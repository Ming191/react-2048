import { Layout, Typography, Space } from 'antd';
import GameBoard from './components/GameBoard';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const grid = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        userSelect: 'none'
        }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          2048 Game (React + AntD)
        </Title>
      </Header>

      <Content
        style={{
          background: '#001529',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        <Space direction="vertical" align="center">
          <GameBoard grid={grid} />
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
