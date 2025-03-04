"use client";

import React from 'react';
import { Typography, Row, Col, Card, Button, Space, Carousel, Divider, Statistic } from 'antd';
import { 
  BookOutlined, 
  ExperimentOutlined, 
  ShoppingOutlined, 
  StarOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  DatabaseOutlined,
  LockOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import styled from 'styled-components';
import useCocktailDB from '@/hooks/useCocktailDB';

const { Title, Paragraph, Text } = Typography;

const StyledCard = styled(Card)`
  height: 100%;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const IconWrapper = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: #722ed1;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 48px;
`;

const FeatureCard = styled(Card)`
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  
  .ant-card-head {
    background-color: #f0f0f0;
  }
`;

const CarouselContent = styled.div`
  height: 200px;
  color: #fff;
  line-height: 200px;
  text-align: center;
  background: #364d79;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const CarouselText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 16px;
  text-align: left;
  line-height: normal;
`;

export default function Home() {
  const { cocktails, loading } = useCocktailDB();

  const features = [
    {
      title: 'The Menu',
      icon: <BookOutlined />,
      description: 'Your personal cocktail library with search and filtering capabilities.',
      link: '/the-menu',
      color: '#722ed1',
    },
    {
      title: 'Something New',
      icon: <ExperimentOutlined />,
      description: 'AI-powered mixologist and ingredient-based discovery.',
      link: '/something-new',
      color: '#13c2c2',
    },
    {
      title: 'Bar Cart',
      icon: <ShoppingOutlined />,
      description: 'Recommendation system based on your available ingredients.',
      link: '/bar-cart',
      color: '#fa8c16',
    },
    {
      title: 'Rate a Drink',
      icon: <StarOutlined />,
      description: 'Comprehensive rating system for spirits, beers, and wines.',
      link: '/rate-drink',
      color: '#eb2f96',
    },
  ];

  const carouselItems = [
    {
      title: 'Discover New Cocktails',
      description: 'Find your next favorite drink with our AI-powered mixologist.',
      color: '#1890ff',
    },
    {
      title: 'Track Your Favorites',
      description: 'Save and organize your personal cocktail collection.',
      color: '#722ed1',
    },
    {
      title: 'Mix with What You Have',
      description: 'Get recommendations based on your bar inventory.',
      color: '#52c41a',
    },
    {
      title: 'Rate Your Experiences',
      description: 'Keep track of what you love and what to avoid.',
      color: '#fa8c16',
    },
  ];

  return (
    <div>
      <HeroSection>
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>Welcome to Neat</Title>
        <Paragraph style={{ fontSize: 18, color: 'white', maxWidth: 700, margin: '0 auto 24px' }}>
          Your personal cocktail discovery and management application.
          Discover new drinks, manage your bar inventory, and keep track of your favorites.
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large" style={{ background: 'white', color: '#722ed1' }}>
            <Link href="/the-menu">Get Started</Link>
          </Button>
          <Button ghost size="large">
            <Link href="/something-new">Discover Cocktails</Link>
          </Button>
        </Space>
      </HeroSection>

      <Carousel autoplay style={{ marginBottom: 48 }}>
        {carouselItems.map((item, index) => (
          <div key={index}>
            <CarouselContent style={{ background: item.color }}>
              <CarouselText>
                <Title level={3} style={{ color: 'white', margin: 0 }}>{item.title}</Title>
                <Paragraph style={{ color: 'white', margin: 0 }}>{item.description}</Paragraph>
              </CarouselText>
            </CarouselContent>
          </div>
        ))}
      </Carousel>

      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Link href={feature.link}>
              <StyledCard 
                hoverable
                cover={
                  <div style={{ 
                    height: 120, 
                    background: feature.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <IconWrapper style={{ color: 'white', margin: 0 }}>{feature.icon}</IconWrapper>
                  </div>
                }
              >
                <div style={{ textAlign: 'center' }}>
                  <Title level={3}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                </div>
              </StyledCard>
            </Link>
          </Col>
        ))}
      </Row>

      <Divider orientation="center">
        <Title level={2} style={{ margin: 0 }}>Your Personal Cocktail Collection</Title>
      </Divider>

      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        <Col xs={24} md={8}>
          <FeatureCard title="In-Browser Storage" extra={<DatabaseOutlined />}>
            <Paragraph>
              All your cocktail data stays in your browser. No accounts, no servers, just your personal collection.
            </Paragraph>
            <Paragraph>
              <LockOutlined /> Your data never leaves your device
            </Paragraph>
          </FeatureCard>
        </Col>
        
        <Col xs={24} md={8}>
          <FeatureCard title="Surprise Me" extra={<ThunderboltOutlined />}>
            <Paragraph>
              Discover a random cocktail with just one click. Perfect for when you can't decide what to make.
            </Paragraph>
            <Button type="primary" icon={<ThunderboltOutlined />} block>
              <Link href="/the-menu">Try It Now</Link>
            </Button>
          </FeatureCard>
        </Col>
        
        <Col xs={24} md={8}>
          <FeatureCard title="Collection Stats" extra={<HeartOutlined />}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic 
                  title="Cocktails" 
                  value={loading ? '-' : cocktails.length} 
                  loading={loading}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Favorites" 
                  value={loading ? '-' : cocktails.filter(c => c.isFavorite).length}
                  loading={loading}
                />
              </Col>
            </Row>
          </FeatureCard>
        </Col>
      </Row>

      <Row justify="center" style={{ marginBottom: 48 }}>
        <Col xs={24}>
          <Card style={{ textAlign: 'center', background: '#f6f6f6', borderRadius: 8 }}>
            <Title level={2}>Ready to start mixing?</Title>
            <Paragraph style={{ fontSize: 16 }}>
              Jump into your cocktail journey with Neat - the perfect companion for cocktail enthusiasts.
            </Paragraph>
            <Button type="primary" size="large" icon={<BookOutlined />}>
              <Link href="/the-menu">Explore Your Menu</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
