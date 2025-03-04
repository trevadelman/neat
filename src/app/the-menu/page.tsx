"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Card, Input, Select, Button, Empty, Row, Col, Space, message, Modal, Spin, Divider } from 'antd';
import { PlusOutlined, ThunderboltOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import useCocktailDB from '@/hooks/useCocktailDB';
import CocktailCard from '@/components/cocktails/CocktailCard';
import CocktailForm from '@/components/cocktails/CocktailForm';
import { Cocktail } from '@/lib/db/neatDB';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Elegant dark theme styling
const MenuContainer = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 40px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.07;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #7928ca, #ff0080);
    z-index: 1;
  }
`;

const MenuHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

const MenuTitle = styled(Title)`
  color: white !important;
  font-family: 'Playfair Display', serif;
  letter-spacing: 3px;
  margin-bottom: 12px !important;
  font-size: 2.5rem !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem !important;
  }
`;

const MenuSubtitle = styled(Paragraph)`
  color: rgba(255, 255, 255, 0.7) !important;
  font-style: italic;
  margin-bottom: 24px !important;
  font-size: 1.1rem;
  max-width: 600px;
  margin-left: auto !important;
  margin-right: auto !important;
`;

const IconContainer = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
    z-index: 0;
  }
  
  svg {
    width: 50px;
    height: 50px;
    color: white;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    
    svg {
      width: 40px;
      height: 40px;
    }
  }
`;

const MenuDivider = styled.div`
  position: relative;
  height: 30px;
  margin: 30px 0;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  
  &::after {
    content: '✦';
    position: relative;
    display: inline-block;
    padding: 0 15px;
    background: #1a1a1a;
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const CocktailMenu = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 32px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CocktailItem = styled.div`
  margin-bottom: 24px;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CocktailName = styled.h3`
  color: white;
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0 8px;
  }
`;

const CocktailPrice = styled.span`
  color: #a67dff;
  font-family: 'Playfair Display', serif;
  font-weight: bold;
`;

const CocktailDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
`;

const MenuDividerFancy = styled.div`
  text-align: center;
  margin: 40px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
`;

// Decorative divider SVG
const DecorativeDivider = () => (
  <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#1a1a1a', padding: '0 15px' }}>
    <path d="M0 10H40" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
    <path d="M80 10H120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
    <path d="M60 2L63 8H57L60 2Z" fill="rgba(255, 255, 255, 0.3)" />
    <path d="M60 18L57 12H63L60 18Z" fill="rgba(255, 255, 255, 0.3)" />
    <circle cx="50" cy="10" r="2" fill="rgba(255, 255, 255, 0.3)" />
    <circle cx="70" cy="10" r="2" fill="rgba(255, 255, 255, 0.3)" />
  </svg>
);

const FilterCard = styled(Card)`
  margin-bottom: 32px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background-color: #2a2a2a;
  border: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #7928ca, #ff0080);
    opacity: 0.7;
  }
  
  .ant-card-body {
    padding: 24px;
  }
  
  .ant-input, .ant-select-selector, .ant-btn {
    background-color: #3a3a3a;
    border-color: #4a4a4a;
    color: white;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover, &:focus {
      border-color: #7928ca;
      box-shadow: 0 0 0 2px rgba(121, 40, 202, 0.2);
    }
  }
  
  .ant-input-search .ant-input-group-addon {
    background-color: #7928ca;
    border-color: #7928ca;
    
    .ant-btn {
      background-color: #7928ca;
      border-color: #7928ca;
      
      &:hover {
        background-color: #8a3ad9;
        border-color: #8a3ad9;
      }
    }
  }
  
  .ant-input::placeholder, .ant-select-selection-placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  .ant-select-arrow {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .ant-select-focused .ant-select-selector {
    border-color: #7928ca !important;
    box-shadow: 0 0 0 2px rgba(121, 40, 202, 0.2) !important;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #444444;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  margin-left: 32px;
  text-align: center;
  position: relative;
  
  &:first-child {
    margin-left: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -16px;
    transform: translateY(-50%);
    width: 1px;
    height: 70%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:last-child::after {
    display: none;
  }
  
  .value {
    font-size: 24px;
    font-weight: bold;
    color: #a67dff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 4px;
  }
  
  @media (max-width: 768px) {
    margin: 0 16px;
    
    &::after {
      display: none;
    }
  }
`;

const ActionButton = styled(Button)`
  background: linear-gradient(135deg, #7928ca, #ff0080);
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
    background: linear-gradient(135deg, #8a3ad9, #ff3399);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyStateContainer = styled.div`
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  
  .ant-empty-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    margin-bottom: 24px;
  }
  
  .ant-btn {
    background: linear-gradient(135deg, #7928ca, #ff0080);
    border: none;
    height: 44px;
    padding: 0 24px;
    font-size: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #8a3ad9, #ff3399);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
    }
  }
`;

// Martini glass SVG icon
const MartiniGlassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 12H22L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 20H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 7H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function TheMenu() {
  const { 
    cocktails, 
    loading, 
    error, 
    fetchCocktails, 
    addCocktail,
    updateCocktail, 
    getRandomCocktail,
    filterCocktails
  } = useCocktailDB();

  const [searchTerm, setSearchTerm] = useState('');
  const [spiritFilter, setSpiritFilter] = useState<string | undefined>(undefined);
  const [glasswareFilter, setGlasswareFilter] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [randomCocktail, setRandomCocktail] = useState<Cocktail | null>(null);
  const [isRandomModalVisible, setIsRandomModalVisible] = useState(false);

  // Apply filters and sorting
  useEffect(() => {
    if (loading) return;

    // Apply filters
    let filtered = filterCocktails({
      search: searchTerm,
      spirit: spiritFilter,
      glassware: glasswareFilter
    });

    // Apply sorting
    switch (sortOrder) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => 
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case 'a-z':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => 
          (b.rating || 0) - (a.rating || 0));
        break;
      case 'favorites':
        filtered = [...filtered].sort((a, b) => 
          (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        break;
    }

    setFilteredCocktails(filtered);
  }, [cocktails, searchTerm, spiritFilter, glasswareFilter, sortOrder, loading, filterCocktails]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle toggling favorite status
  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      await updateCocktail(id, { isFavorite });
      message.success(`${isFavorite ? 'Added to' : 'Removed from'} favorites`);
    } catch (error) {
      message.error('Failed to update favorite status');
      console.error(error);
    }
  };

  // Handle surprise me button
  const handleSurpriseMe = async () => {
    try {
      const cocktail = await getRandomCocktail();
      if (cocktail) {
        setRandomCocktail(cocktail);
        setIsRandomModalVisible(true);
      } else {
        message.info('No cocktails found. Add some first!');
      }
    } catch (error) {
      message.error('Failed to get a random cocktail');
      console.error(error);
    }
  };

  // Handle add cocktail button
  const handleAddCocktail = () => {
    setIsAddModalVisible(true);
  };

  // Handle save cocktail
  const handleSaveCocktail = async (cocktail: Omit<Cocktail, 'id'>) => {
    setIsSaving(true);
    try {
      await addCocktail(cocktail);
      message.success(`${cocktail.name} added to your collection!`);
      setIsAddModalVisible(false);
    } catch (error) {
      message.error('Failed to add cocktail');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel add cocktail
  const handleCancelAddCocktail = () => {
    setIsAddModalVisible(false);
  };

  // Calculate stats
  const totalCocktails = cocktails.length;
  const favoriteCocktails = cocktails.filter(c => c.isFavorite).length;
  const uniqueSpirits = new Set(
    cocktails.flatMap(c => 
      c.ingredients
        .map(i => i.name.toLowerCase())
        .filter(name => 
          ['whiskey', 'bourbon', 'rye', 'scotch', 'gin', 'vodka', 'rum', 'tequila', 'mezcal', 'brandy']
            .some(spirit => name.includes(spirit))
        )
    )
  ).size;

  return (
    <div>
      <MenuContainer>
        <MenuHeader>
          <IconContainer>
            <MartiniGlassIcon />
          </IconContainer>
          <MenuTitle level={2}>COCKTAIL HOUR</MenuTitle>
          <MenuSubtitle>Your personal cocktail library</MenuSubtitle>
        </MenuHeader>
        
        <Row justify="center" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space size="large">
              <ActionButton 
                type="primary" 
                icon={<ThunderboltOutlined />}
                size="large"
                onClick={handleSurpriseMe}
                loading={loading}
              >
                Surprise Me
              </ActionButton>
              <ActionButton 
                type="primary" 
                icon={<PlusOutlined />}
                size="large"
                onClick={handleAddCocktail}
              >
                Add Cocktail
              </ActionButton>
            </Space>
          </Col>
        </Row>

        <MenuDivider />
      </MenuContainer>

      <FilterCard>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Search
              placeholder="Search cocktails"
              allowClear
              enterButton="Search"
              size="large"
              style={{ marginBottom: 16 }}
              onSearch={handleSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} md={16}>
            <Space wrap>
              <Select
                placeholder="Filter by spirit"
                style={{ width: 160 }}
                allowClear
                onChange={(value) => setSpiritFilter(value)}
              >
                <Option value="whiskey">Whiskey</Option>
                <Option value="gin">Gin</Option>
                <Option value="vodka">Vodka</Option>
                <Option value="rum">Rum</Option>
                <Option value="tequila">Tequila</Option>
              </Select>
              
              <Select
                placeholder="Filter by glassware"
                style={{ width: 160 }}
                allowClear
                onChange={(value) => setGlasswareFilter(value)}
              >
                <Option value="rocks">Rocks Glass</Option>
                <Option value="coupe">Coupe</Option>
                <Option value="highball">Highball</Option>
                <Option value="martini">Martini Glass</Option>
              </Select>
              
              <Select
                placeholder="Sort by"
                style={{ width: 160 }}
                defaultValue="newest"
                onChange={(value) => setSortOrder(value)}
              >
                <Option value="newest">Newest First</Option>
                <Option value="oldest">Oldest First</Option>
                <Option value="a-z">A-Z</Option>
                <Option value="rating">Highest Rated</Option>
                <Option value="favorites">Favorites First</Option>
              </Select>
            </Space>
          </Col>
        </Row>

        {totalCocktails > 0 && (
          <StatsBar>
            <StatItem>
              <div className="value">{totalCocktails}</div>
              <div className="label">Total Cocktails</div>
            </StatItem>
            <StatItem>
              <div className="value">{favoriteCocktails}</div>
              <div className="label">Favorites</div>
            </StatItem>
            <StatItem>
              <div className="value">{uniqueSpirits}</div>
              <div className="label">Unique Spirits</div>
            </StatItem>
          </StatsBar>
        )}
      </FilterCard>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading your cocktail collection...</p>
        </div>
      ) : filteredCocktails.length > 0 ? (
        <AnimatePresence>
          <MenuContainer style={{ 
            padding: '40px', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#1a1a1a'
          }}>
            <MenuHeader style={{ marginBottom: 30 }}>
              <MenuTitle level={2} style={{ fontSize: '2rem !important' }}>COCKTAIL MENU</MenuTitle>
            </MenuHeader>
            
            <MenuDividerFancy>
              <DecorativeDivider />
            </MenuDividerFancy>
            
            <CocktailMenu>
              {filteredCocktails.map((cocktail) => (
                <CocktailItem key={cocktail.id}>
                  <CocktailName>
                    {cocktail.name}
                    <CocktailPrice>${(Math.random() * 10 + 8).toFixed(2)}</CocktailPrice>
                  </CocktailName>
                  <CocktailDescription>
                    {cocktail.description}
                  </CocktailDescription>
                </CocktailItem>
              ))}
            </CocktailMenu>
            
            <MenuDividerFancy>
              <DecorativeDivider />
            </MenuDividerFancy>
          </MenuContainer>
        </AnimatePresence>
      ) : (
        <EmptyStateContainer>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                {searchTerm || spiritFilter || glasswareFilter 
                  ? 'No cocktails match your search criteria.' 
                  : 'Your cocktail collection is empty. Add your first cocktail or try the "Surprise Me" button!'}
              </span>
            }
          />
          <ActionButton 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleAddCocktail}
          >
            Add Your First Cocktail
          </ActionButton>
        </EmptyStateContainer>
      )}

      {/* Add Cocktail Modal */}
      <Modal
        title={null}
        open={isAddModalVisible}
        onCancel={handleCancelAddCocktail}
        footer={null}
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        styles={{
          mask: {
            backdropFilter: 'blur(4px)',
            background: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            overflow: 'hidden',
          }
        }}
      >
        <CocktailForm
          onSave={handleSaveCocktail}
          onCancel={handleCancelAddCocktail}
        />
      </Modal>

      {/* Random Cocktail Modal */}
      {randomCocktail && (
        <Modal
          title={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.2rem',
              color: 'white'
            }}>
              <span>Surprise Cocktail</span>
              <Button 
                type="text" 
                icon={<CloseOutlined style={{ color: 'white' }} />} 
                onClick={() => setIsRandomModalVisible(false)}
                style={{ color: 'white' }}
              />
            </div>
          }
          open={isRandomModalVisible}
          onCancel={() => setIsRandomModalVisible(false)}
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
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
            },
            wrapper: {
              color: 'white',
            }
          }}
        >
          <CocktailCard 
            cocktail={randomCocktail} 
            onToggleFavorite={handleToggleFavorite}
          />
        </Modal>
      )}
    </div>
  );
}
