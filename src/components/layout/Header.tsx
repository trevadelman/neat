"use client";

import React from 'react';
import { Layout, Menu, Button, Typography, message, Modal } from 'antd';
import { 
  BookOutlined, 
  ExperimentOutlined, 
  ShoppingOutlined, 
  StarOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useCocktailDB from '@/hooks/useCocktailDB';
import CocktailCard from '@/components/cocktails/CocktailCard';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getRandomCocktail, loading, updateCocktail } = useCocktailDB();
  const [surpriseModalVisible, setSurpriseModalVisible] = React.useState(false);
  const [randomCocktail, setRandomCocktail] = React.useState<any>(null);

  const menuItems = [
    {
      key: '/the-menu',
      icon: <BookOutlined />,
      label: <Link href="/the-menu">The Menu</Link>,
    },
    {
      key: '/something-new',
      icon: <ExperimentOutlined />,
      label: <Link href="/something-new">Something New</Link>,
    },
    {
      key: '/bar-cart',
      icon: <ShoppingOutlined />,
      label: <Link href="/bar-cart">Bar Cart</Link>,
    },
    {
      key: '/rate-drink',
      icon: <StarOutlined />,
      label: <Link href="/rate-drink">Rate a Drink</Link>,
    },
  ];

  const handleSurpriseMe = async () => {
    try {
      const cocktail = await getRandomCocktail();
      if (cocktail) {
        setRandomCocktail(cocktail);
        setSurpriseModalVisible(true);
      } else {
        message.info('No cocktails found. Add some first!');
        router.push('/the-menu');
      }
    } catch (error) {
      message.error('Failed to get a random cocktail');
      console.error(error);
    }
  };

  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      await updateCocktail(id, { isFavorite });
      message.success(`${isFavorite ? 'Added to' : 'Removed from'} favorites`);
      // Update the local state to reflect the change
      if (randomCocktail && randomCocktail.id === id) {
        setRandomCocktail({
          ...randomCocktail,
          isFavorite
        });
      }
    } catch (error) {
      message.error('Failed to update favorite status');
      console.error(error);
    }
  };

  return (
    <>
      <AntHeader style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              Neat
            </Title>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathname || '/']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Button 
          type="primary" 
          icon={<ThunderboltOutlined />} 
          style={{ marginLeft: 16 }}
          onClick={handleSurpriseMe}
          loading={loading}
        >
          Surprise Me
        </Button>
      </AntHeader>

      {/* Surprise Me Modal */}
      <Modal
        title="Surprise Cocktail"
        open={surpriseModalVisible}
        onCancel={() => setSurpriseModalVisible(false)}
        footer={null}
        width={800}
      >
        {randomCocktail && (
          <div style={{ padding: '20px 0' }}>
            <CocktailCard 
              cocktail={randomCocktail} 
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default Header;
