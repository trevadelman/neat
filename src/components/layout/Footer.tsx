"use client";

import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter style={{ textAlign: 'center' }}>
      <Text>Neat ©{new Date().getFullYear()} - Your Personal Cocktail Discovery App</Text>
    </AntFooter>
  );
};

export default Footer;
