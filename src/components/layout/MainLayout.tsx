"use client";

import React, { ReactNode } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#722ed1', // Purple theme for cocktail app
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Content style={{ padding: '24px 50px', marginTop: 16 }}>
          {children}
        </Content>
        <Footer />
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
