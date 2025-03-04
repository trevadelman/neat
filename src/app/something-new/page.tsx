"use client";

import React, { useState } from 'react';
import { Typography, Card, Tabs, Row, Col, Input, Button, Avatar, List, Tag, Divider, Spin } from 'antd';
import styled from 'styled-components';
import { 
  ExperimentOutlined, 
  ShoppingOutlined, 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined,
  SaveOutlined,
  HeartOutlined,
  PlusOutlined,
  FireOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import useCocktailDB from '@/hooks/useCocktailDB';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const FeatureCard = styled(Card)`
  margin-bottom: 24px;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  
  .ant-card-head {
    background-color: #f0f0f0;
  }
`;

const ChatContainer = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
  border: 1px solid #eee;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  margin-bottom: 12px;
  background-color: ${props => props.isUser ? '#722ed1' : '#fff'};
  color: ${props => props.isUser ? '#fff' : '#000'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: ${props => props.isUser ? 'none' : '1px solid #eee'};
  position: relative;
`;

const SuggestionChip = styled(Button)`
  margin: 0 8px 8px 0;
  border-radius: 16px;
`;

const RecipeCard = styled(Card)`
  margin-top: 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  
  .ant-card-head {
    background-color: #f6f6f6;
  }
`;

const IngredientItem = styled(List.Item)`
  padding: 8px 0;
`;

const StepItem = styled(List.Item)`
  padding: 12px 0;
`;

// Sample AI-generated cocktail
const sampleCocktail = {
  name: "Spicy Pineapple Margarita",
  description: "A tropical twist on the classic margarita with a spicy kick.",
  ingredients: [
    { name: "Tequila", amount: "2", unit: "oz" },
    { name: "Pineapple Juice", amount: "1", unit: "oz" },
    { name: "Lime Juice", amount: "0.75", unit: "oz" },
    { name: "Agave Syrup", amount: "0.5", unit: "oz" },
    { name: "Jalapeño Slices", amount: "2-3", unit: "slices" },
  ],
  instructions: [
    "Muddle jalapeño slices in a shaker",
    "Add tequila, pineapple juice, lime juice, and agave syrup",
    "Add ice and shake vigorously for 15 seconds",
    "Strain into a rocks glass over fresh ice",
    "Garnish with a pineapple wedge and jalapeño slice"
  ],
  tags: ["spicy", "tropical", "tequila", "refreshing"]
};

export default function SomethingNew() {
  const [activeTab, setActiveTab] = useState("ai-mixologist");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{text: string, isUser: boolean, timestamp: Date}[]>([
    {
      text: "Hi there! I'm your AI Mixologist. What kind of cocktail are you in the mood for today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const { cocktails, addCocktail } = useCocktailDB();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([
      ...chatHistory,
      {
        text: message,
        isUser: true,
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setMessage("");
    
    // Simulate AI thinking
    setLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          text: "I think you might enjoy a Spicy Pineapple Margarita. It's a tropical twist on the classic margarita with a spicy kick from jalapeño. Would you like to see the recipe?",
          isUser: false,
          timestamp: new Date()
        }
      ]);
      setLoading(false);
      setShowRecipe(true);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveCocktail = () => {
    // Convert sample cocktail to the format expected by the database
    const cocktailToSave = {
      ...sampleCocktail,
      glassware: "rocks",
      rating: 0,
      dateAdded: new Date(),
      images: [],
      isFavorite: false,
    };
    
    // Add to database
    addCocktail(cocktailToSave as any);
    
    // Add confirmation message to chat
    setChatHistory(prev => [
      ...prev,
      {
        text: "Great! I've saved the Spicy Pineapple Margarita to your cocktail collection.",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const suggestionChips = [
    "Something refreshing with gin",
    "A tiki drink with rum",
    "Something spicy",
    "A low-alcohol option",
    "A classic cocktail twist"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div>
      <Title level={2}>Something New</Title>
      <Paragraph>Discover new cocktails based on your preferences or available ingredients</Paragraph>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        size="large"
        type="card"
      >
        <TabPane 
          tab={
            <span>
              <ExperimentOutlined /> AI Mixologist
            </span>
          } 
          key="ai-mixologist"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <FeatureCard 
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <RobotOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                    Chat with the AI Mixologist
                  </div>
                }
                bordered={false}
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
              >
                <ChatContainer>
                  {chatHistory.map((msg, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                        marginBottom: 16
                      }}
                    >
                      {!msg.isUser && (
                        <Avatar 
                          icon={<RobotOutlined />} 
                          style={{ 
                            backgroundColor: '#722ed1', 
                            marginRight: 8,
                            flexShrink: 0
                          }} 
                        />
                      )}
                      <MessageBubble isUser={msg.isUser}>
                        {msg.text}
                      </MessageBubble>
                      {msg.isUser && (
                        <Avatar 
                          icon={<UserOutlined />} 
                          style={{ 
                            backgroundColor: '#1890ff', 
                            marginLeft: 8,
                            flexShrink: 0
                          }} 
                        />
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                      <Avatar 
                        icon={<RobotOutlined />} 
                        style={{ 
                          backgroundColor: '#722ed1', 
                          marginRight: 8 
                        }} 
                      />
                      <Spin size="small" style={{ marginRight: 8 }} />
                      <Text type="secondary">AI Mixologist is thinking...</Text>
                    </div>
                  )}
                </ChatContainer>
                
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Suggestions:</Text>
                    <div style={{ marginTop: 8 }}>
                      {suggestionChips.map((suggestion, index) => (
                        <SuggestionChip 
                          key={index} 
                          size="small" 
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </SuggestionChip>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex' }}>
                    <TextArea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tell me what you're in the mood for..."
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      style={{ marginRight: 8 }}
                    />
                    <Button 
                      type="primary" 
                      icon={<SendOutlined />} 
                      onClick={handleSendMessage}
                    />
                  </div>
                </div>
                
                {showRecipe && (
                  <RecipeCard
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{sampleCocktail.name}</span>
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />}
                          onClick={handleSaveCocktail}
                        >
                          Save to Collection
                        </Button>
                      </div>
                    }
                  >
                    <Paragraph>{sampleCocktail.description}</Paragraph>
                    
                    <div style={{ marginBottom: 16 }}>
                      {sampleCocktail.tags.map((tag, index) => (
                        <Tag key={index} color="purple">{tag}</Tag>
                      ))}
                    </div>
                    
                    <Divider orientation="left">Ingredients</Divider>
                    <List
                      dataSource={sampleCocktail.ingredients}
                      renderItem={(ingredient) => (
                        <IngredientItem>
                          <Text>{ingredient.amount} {ingredient.unit} {ingredient.name}</Text>
                        </IngredientItem>
                      )}
                    />
                    
                    <Divider orientation="left">Instructions</Divider>
                    <List
                      dataSource={sampleCocktail.instructions}
                      renderItem={(instruction, index) => (
                        <StepItem>
                          <Text>{index + 1}. {instruction}</Text>
                        </StepItem>
                      )}
                    />
                  </RecipeCard>
                )}
              </FeatureCard>
            </Col>
            
            <Col xs={24} lg={8}>
              <FeatureCard 
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FireOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                    How It Works
                  </div>
                }
                bordered={false}
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
              >
                <Paragraph>
                  The AI Mixologist uses natural language processing to understand your preferences
                  and generate cocktail recipes that match what you're looking for.
                </Paragraph>
                
                <Paragraph>
                  You can ask for specific spirits, flavors, or styles, and the AI will create
                  a custom recipe just for you. If you like the result, you can save it to your
                  personal menu.
                </Paragraph>
                
                <Divider />
                
                <Title level={5}>Try phrases like:</Title>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { icon: <ThunderboltOutlined style={{ color: '#1890ff' }} />, text: "I want something refreshing with gin" },
                    { icon: <FireOutlined style={{ color: '#fa8c16' }} />, text: "Create a tiki drink with rum" },
                    { icon: <HeartOutlined style={{ color: '#eb2f96' }} />, text: "I'm in the mood for something spicy" },
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={item.icon} />}
                        title={item.text}
                      />
                    </List.Item>
                  )}
                />
                
                <Divider />
                
                <Button type="primary" icon={<PlusOutlined />} block>
                  Add Your Own Recipe
                </Button>
              </FeatureCard>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <ShoppingOutlined /> Drinks From My Bar Cart
            </span>
          } 
          key="bar-cart"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <FeatureCard 
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    Find Cocktails Based on Your Ingredients
                  </div>
                }
                bordered={false}
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
              >
                <Paragraph>
                  See what cocktails you can make with the ingredients you already have.
                  This feature will analyze your bar inventory and suggest cocktails you can make right now.
                </Paragraph>
                
                <div style={{ 
                  background: '#f9f9f9', 
                  padding: 24, 
                  borderRadius: 8,
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #d9d9d9'
                }}>
                  <ShoppingOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
                  <Title level={4} style={{ marginBottom: 16 }}>Your Bar Cart is Empty</Title>
                  <Paragraph style={{ textAlign: 'center', marginBottom: 24 }}>
                    Add ingredients to your bar cart to see what cocktails you can make.
                  </Paragraph>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    size="large"
                    href="/bar-cart"
                  >
                    Add Ingredients to Bar Cart
                  </Button>
                </div>
              </FeatureCard>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}
