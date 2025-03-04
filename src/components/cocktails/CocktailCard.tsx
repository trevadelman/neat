"use client";

import React, { useState } from 'react';
import { Card, Typography, Tag, Button, Modal, Row, Col, List, Divider } from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  ExpandOutlined, 
  CoffeeOutlined,
  TagOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Cocktail, Ingredient } from '@/lib/db/neatDB';

const { Title, Text, Paragraph } = Typography;

const StyledCard = styled(Card)`
  height: 100%;
  transition: all 0.3s;
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  color: white;
  
  .ant-card-body {
    padding: 20px;
  }
  
  .ant-card-actions {
    background-color: #222;
    border-top: 1px solid #3a3a3a;
  }
  
  .ant-card-actions > li {
    border-right: 1px solid #3a3a3a;
  }
  
  .ant-typography {
    color: white !important;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const CardTitle = styled(Title)`
  font-family: 'Playfair Display', serif;
  margin-bottom: 8px !important;
  color: white !important;
`;

const CardDescription = styled(Paragraph)`
  color: rgba(255, 255, 255, 0.8) !important;
  margin-bottom: 16px;
`;

const TagsContainer = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledTag = styled(Tag)`
  background-color: #4a2b6b;
  border: none;
  color: white;
`;

const IngredientList = styled.div`
  margin-top: 16px;
  
  ul {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const GlassIcon = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.5);
`;

const PriceTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #333;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-family: 'Playfair Display', serif;
`;

interface CocktailCardProps {
  cocktail: Cocktail;
  onToggleFavorite?: (id: number, isFavorite: boolean) => void;
}

const CocktailCard: React.FC<CocktailCardProps> = ({ 
  cocktail, 
  onToggleFavorite 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cocktail.id && onToggleFavorite) {
      onToggleFavorite(cocktail.id, !cocktail.isFavorite);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Get glassware icon based on type
  const getGlasswareIcon = (glassware: string) => {
    return <CoffeeOutlined />;
  };

  // Format ingredient for display
  const formatIngredient = (ingredient: Ingredient) => {
    return `${ingredient.amount} ${ingredient.unit} ${ingredient.name}${ingredient.optional ? ' (optional)' : ''}`;
  };

  return (
    <>
      <StyledCard
        hoverable
        onClick={showModal}
        actions={[
          <Button 
            type="text" 
            icon={cocktail.isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
            onClick={handleToggleFavorite}
            key="favorite"
          >
            {cocktail.isFavorite ? 'Favorited' : 'Favorite'}
          </Button>,
          <Button 
            type="text" 
            icon={<ExpandOutlined />}
            onClick={showModal}
            key="expand"
          >
            View
          </Button>
        ]}
      >
        <GlassIcon>{getGlasswareIcon(cocktail.glassware)}</GlassIcon>
        <PriceTag>${(Math.random() * 10 + 8).toFixed(2)}</PriceTag>
        
        <CardTitle level={4}>{cocktail.name}</CardTitle>
        <CardDescription ellipsis={{ rows: 2 }}>{cocktail.description}</CardDescription>
        
        <TagsContainer>
          {cocktail.tags.slice(0, 3).map((tag, index) => (
            <StyledTag key={index}>{tag}</StyledTag>
          ))}
          {cocktail.tags.length > 3 && (
            <StyledTag>+{cocktail.tags.length - 3}</StyledTag>
          )}
        </TagsContainer>
        
        <IngredientList>
          <Text strong><UnorderedListOutlined /> Key Ingredients:</Text>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            {cocktail.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index}>
                <Text>{ingredient.name}</Text>
              </li>
            ))}
            {cocktail.ingredients.length > 3 && (
              <li><Text>+{cocktail.ingredients.length - 3} more</Text></li>
            )}
          </ul>
        </IngredientList>
      </StyledCard>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', color: 'white' }}>{cocktail.name}</span>
            <Button 
              type="text" 
              icon={cocktail.isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              onClick={handleToggleFavorite}
              style={{ color: 'white' }}
            />
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        styles={{
          header: {
            background: '#222222',
            borderBottom: '1px solid #333333',
            padding: '16px 24px',
          },
          body: {
            background: '#222222',
            padding: '24px',
          },
          mask: {
            backdropFilter: 'blur(4px)',
            background: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            background: '#222222',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
          },
          wrapper: {
            color: 'white',
          }
        }}
      >
        <ServingCalculator cocktail={cocktail} />
      </Modal>
    </>
  );
};

// Serving Calculator Component
interface ServingCalculatorProps {
  cocktail: Cocktail;
}

const ServingCalculator: React.FC<ServingCalculatorProps> = ({ cocktail }) => {
  const [servings, setServings] = useState(1);
  const [addToBarCart, setAddToBarCart] = useState<string[]>([]);

  // Calculate ingredient amounts based on servings
  const calculateAmount = (amount: string, servings: number) => {
    if (!amount) return '';
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return amount;
    
    return (numAmount * servings).toFixed(2).replace(/\.00$/, '');
  };

  // Handle adding ingredient to bar cart
  const handleAddToBarCart = (ingredientName: string) => {
    if (addToBarCart.includes(ingredientName)) {
      setAddToBarCart(addToBarCart.filter(name => name !== ingredientName));
    } else {
      setAddToBarCart([...addToBarCart, ingredientName]);
    }
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={16}>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{cocktail.description}</Paragraph>
        
        <Card 
          size="small" 
          title={<span style={{ color: 'white' }}>Serving Calculator</span>}
          style={{ 
            marginBottom: 16, 
            backgroundColor: '#333333', 
            borderColor: '#444444',
            color: 'white'
          }}
          headStyle={{ 
            backgroundColor: '#2a2a2a', 
            borderColor: '#444444' 
          }}
          bodyStyle={{ 
            backgroundColor: '#333333', 
            padding: '16px' 
          }}
          extra={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                size="small" 
                onClick={() => setServings(Math.max(1, servings - 1))}
                disabled={servings <= 1}
                style={{ 
                  backgroundColor: '#444444', 
                  borderColor: '#555555',
                  color: 'white'
                }}
              >
                -
              </Button>
              <span style={{ margin: '0 8px', color: 'white' }}>
                {servings} {servings === 1 ? 'serving' : 'servings'}
              </span>
              <Button 
                size="small" 
                onClick={() => setServings(servings + 1)}
                style={{ 
                  backgroundColor: '#444444', 
                  borderColor: '#555555',
                  color: 'white'
                }}
              >
                +
              </Button>
            </div>
          }
        >
          <List
            dataSource={cocktail.ingredients}
            renderItem={ingredient => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => handleAddToBarCart(ingredient.name)}
                    style={{ color: addToBarCart.includes(ingredient.name) ? '#52c41a' : undefined }}
                  >
                    {addToBarCart.includes(ingredient.name) ? 'Added to Bar Cart' : 'Add to Bar Cart'}
                  </Button>
                ]}
              >
                <Text>
                  {calculateAmount(ingredient.amount, servings)} {ingredient.unit} {ingredient.name}
                  {ingredient.optional ? ' (optional)' : ''}
                </Text>
              </List.Item>
            )}
          />
        </Card>
        
        <Divider orientation="left" style={{ borderColor: '#444444', color: 'white' }}>Instructions</Divider>
        <List
          dataSource={cocktail.instructions}
          renderItem={(instruction, index) => (
            <List.Item style={{ borderBottom: '1px solid #444444' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{index + 1}. {instruction}</Text>
            </List.Item>
          )}
        />
      </Col>
      
      <Col xs={24} md={8}>
        <Card 
          size="small" 
          title={<span style={{ color: 'white' }}>Details</span>}
          style={{ 
            marginBottom: 16, 
            backgroundColor: '#333333', 
            borderColor: '#444444',
            color: 'white'
          }}
          headStyle={{ 
            backgroundColor: '#2a2a2a', 
            borderColor: '#444444' 
          }}
          bodyStyle={{ 
            backgroundColor: '#333333', 
            padding: '16px' 
          }}
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            <strong style={{ color: 'white' }}>Glassware:</strong> {cocktail.glassware}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            <strong style={{ color: 'white' }}>Added:</strong> {cocktail.dateAdded.toLocaleDateString()}
          </p>
          
          <Divider orientation="left" style={{ borderColor: '#444444', color: 'white' }}>
            <TagOutlined /> Tags
          </Divider>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {cocktail.tags.map((tag, index) => (
              <StyledTag key={index}>{tag}</StyledTag>
            ))}
          </div>
        </Card>
        
        {addToBarCart.length > 0 && (
          <Card 
            size="small" 
            title={<span style={{ color: '#333' }}>Bar Cart Additions</span>}
            style={{ 
              background: '#1a3311', 
              borderColor: '#2a4f1a',
              color: '#b7eb8f'
            }}
            headStyle={{ 
              backgroundColor: '#2a4f1a', 
              borderColor: '#2a4f1a',
              color: '#b7eb8f'
            }}
          >
            <Paragraph style={{ color: '#b7eb8f' }}>
              {addToBarCart.length} {addToBarCart.length === 1 ? 'ingredient' : 'ingredients'} added to your bar cart:
            </Paragraph>
            <List
              size="small"
              dataSource={addToBarCart}
              renderItem={item => (
                <List.Item style={{ borderBottom: '1px solid #2a4f1a' }}>
                  <Text style={{ color: '#b7eb8f' }}>{item}</Text>
                </List.Item>
              )}
            />
            <Button 
              type="primary" 
              block 
              style={{ 
                marginTop: 16, 
                background: '#52c41a', 
                borderColor: '#52c41a',
                fontWeight: 'bold'
              }}
            >
              View Bar Cart
            </Button>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default CocktailCard;
