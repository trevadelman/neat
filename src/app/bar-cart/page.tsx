"use client";

import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Tabs, 
  Row, 
  Col, 
  List, 
  Tag, 
  Empty, 
  Input, 
  Modal, 
  Form, 
  Select, 
  Divider, 
  Progress,
  Badge,
  Tooltip,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  ShoppingOutlined, 
  CheckCircleOutlined, 
  DeleteOutlined, 
  EditOutlined,
  SearchOutlined,
  FilterOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import useCocktailDB from '@/hooks/useCocktailDB';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

const CategoryCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  .ant-card-head {
    background-color: #f0f0f0;
  }
`;

const IngredientTag = styled(Tag)`
  margin-bottom: 8px;
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddIngredientTag = styled(Tag)`
  cursor: pointer;
  background: #f0f0f0;
  border-style: dashed;
  margin-bottom: 8px;
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    background: #e6f7ff;
    border-color: #1890ff;
  }
`;

const CocktailCard = styled(Card)`
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FilterBar = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

// Sample inventory data
const sampleInventory = [
  { id: 1, name: 'Bourbon', category: 'Spirits', amount: '750ml', lowStock: false },
  { id: 2, name: 'Gin', category: 'Spirits', amount: '500ml', lowStock: true },
  { id: 3, name: 'Sweet Vermouth', category: 'Liqueurs', amount: '750ml', lowStock: false },
  { id: 4, name: 'Angostura Bitters', category: 'Bitters & Aromatics', amount: '200ml', lowStock: false },
  { id: 5, name: 'Lime', category: 'Fruits & Juices', amount: '5 pieces', lowStock: false },
  { id: 6, name: 'Simple Syrup', category: 'Syrups & Sweeteners', amount: '500ml', lowStock: false },
];

// Sample cocktails that can be made with inventory
const sampleCanMake = [
  {
    id: 1,
    name: 'Old Fashioned',
    ingredients: ['Bourbon', 'Angostura Bitters', 'Simple Syrup'],
    missingIngredients: [],
    matchPercentage: 100
  },
  {
    id: 2,
    name: 'Manhattan',
    ingredients: ['Bourbon', 'Sweet Vermouth', 'Angostura Bitters'],
    missingIngredients: [],
    matchPercentage: 100
  },
  {
    id: 3,
    name: 'Negroni',
    ingredients: ['Gin', 'Sweet Vermouth', 'Campari'],
    missingIngredients: ['Campari'],
    matchPercentage: 67
  },
  {
    id: 4,
    name: 'Gin & Tonic',
    ingredients: ['Gin', 'Tonic Water', 'Lime'],
    missingIngredients: ['Tonic Water'],
    matchPercentage: 67
  }
];

export default function BarCart() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { cocktails } = useCocktailDB();
  
  // Example categories for organization
  const categories = [
    { name: 'Spirits', icon: '🥃', items: ['Whiskey', 'Gin', 'Vodka', 'Rum', 'Tequila'] },
    { name: 'Liqueurs', icon: '🍸', items: ['Triple Sec', 'Coffee Liqueur', 'Amaretto', 'Sweet Vermouth'] },
    { name: 'Mixers', icon: '🧃', items: ['Tonic Water', 'Soda Water', 'Ginger Beer'] },
    { name: 'Fruits & Juices', icon: '🍋', items: ['Lemon', 'Lime', 'Orange Juice'] },
    { name: 'Syrups & Sweeteners', icon: '🍯', items: ['Simple Syrup', 'Honey', 'Agave'] },
    { name: 'Bitters & Aromatics', icon: '🌿', items: ['Angostura Bitters', 'Orange Bitters'] },
  ];

  // Filter inventory based on search term and category
  const filteredInventory = sampleInventory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group inventory by category
  const inventoryByCategory = filteredInventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof sampleInventory>);

  // Filter cocktails that can be made
  const filteredCanMake = sampleCanMake.filter(cocktail => {
    return searchTerm === '' || 
      cocktail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cocktail.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleAddIngredient = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalOk = () => {
    form.validateFields()
      .then(values => {
        console.log('Add ingredient values:', values);
        // In a real implementation, we would add the ingredient to the database
        form.resetFields();
        setIsAddModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleAddModalCancel = () => {
    form.resetFields();
    setIsAddModalVisible(false);
  };

  const handleDeleteIngredient = (id: number) => {
    console.log('Delete ingredient:', id);
    // In a real implementation, we would delete the ingredient from the database
  };

  const handleEditIngredient = (id: number) => {
    console.log('Edit ingredient:', id);
    // In a real implementation, we would open a modal to edit the ingredient
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Bar Cart</Title>
          <Paragraph>Manage your bar inventory and discover what you can make</Paragraph>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAddIngredient}
          >
            Add Ingredients
          </Button>
        </Col>
      </Row>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        size="large"
        type="card"
      >
        <TabPane 
          tab={
            <span>
              <ShoppingOutlined /> My Inventory
            </span>
          } 
          key="inventory"
        >
          <FilterBar>
            <Row gutter={16} align="middle">
              <Col xs={24} md={8} lg={6}>
                <Search
                  placeholder="Search ingredients"
                  allowClear
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} md={8} lg={6}>
                <Select
                  placeholder="Filter by category"
                  allowClear
                  style={{ width: '100%' }}
                  onChange={value => setCategoryFilter(value)}
                >
                  {categories.map(category => (
                    <Option key={category.name} value={category.name}>
                      {category.icon} {category.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={8} lg={12}>
                <Row justify="end" gutter={[16, 0]}>
                  <Col>
                    <Statistic 
                      title="Total Ingredients" 
                      value={sampleInventory.length} 
                      style={{ textAlign: 'center' }}
                    />
                  </Col>
                  <Col>
                    <Statistic 
                      title="Low Stock Items" 
                      value={sampleInventory.filter(i => i.lowStock).length} 
                      valueStyle={{ color: '#faad14' }}
                      style={{ textAlign: 'center' }}
                    />
                  </Col>
                  <Col>
                    <Statistic 
                      title="Possible Cocktails" 
                      value={sampleCanMake.filter(c => c.matchPercentage === 100).length} 
                      valueStyle={{ color: '#52c41a' }}
                      style={{ textAlign: 'center' }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </FilterBar>

          {Object.keys(inventoryByCategory).length > 0 ? (
            <Row gutter={[24, 24]}>
              {Object.entries(inventoryByCategory).map(([category, items], index) => {
                const categoryInfo = categories.find(c => c.name === category);
                return (
                  <Col xs={24} md={12} lg={8} key={index}>
                    <CategoryCard 
                      title={
                        <span>
                          {categoryInfo?.icon || '📦'} {category}
                        </span>
                      }
                      extra={
                        <Button 
                          type="text" 
                          icon={<PlusOutlined />} 
                          onClick={handleAddIngredient}
                          size="small"
                        />
                      }
                    >
                      <div>
                        {items.map((item) => (
                          <IngredientTag 
                            key={item.id} 
                            color={item.lowStock ? 'warning' : 'blue'}
                          >
                            <span>
                              {item.lowStock && (
                                <Tooltip title="Low stock">
                                  <WarningOutlined style={{ marginRight: 8, color: '#faad14' }} />
                                </Tooltip>
                              )}
                              {item.name} ({item.amount})
                            </span>
                            <span>
                              <Button 
                                type="text" 
                                icon={<EditOutlined />} 
                                size="small"
                                onClick={() => handleEditIngredient(item.id)}
                                style={{ marginRight: 4 }}
                              />
                              <Button 
                                type="text" 
                                icon={<DeleteOutlined />} 
                                size="small"
                                onClick={() => handleDeleteIngredient(item.id)}
                                danger
                              />
                            </span>
                          </IngredientTag>
                        ))}
                        <AddIngredientTag onClick={handleAddIngredient}>
                          <PlusOutlined style={{ marginRight: 8 }} /> Add {category.toLowerCase()}
                        </AddIngredientTag>
                      </div>
                    </CategoryCard>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  {searchTerm || categoryFilter 
                    ? 'No ingredients match your search criteria.' 
                    : 'Your bar inventory is empty. Add ingredients to get started!'}
                </span>
              }
              style={{ marginTop: 48 }}
            >
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddIngredient}>
                Add Your First Ingredient
              </Button>
            </Empty>
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined /> What I Can Make
            </span>
          } 
          key="can-make"
        >
          <FilterBar>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Search
                  placeholder="Search cocktails"
                  allowClear
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Row justify="end">
                  <Button 
                    type="primary" 
                    icon={<ThunderboltOutlined />}
                    style={{ marginRight: 16 }}
                  >
                    Surprise Me
                  </Button>
                  <Tooltip title="This tab shows cocktails you can make with your current inventory. Cocktails with missing ingredients are shown with a completion percentage.">
                    <Button icon={<InfoCircleOutlined />}>How This Works</Button>
                  </Tooltip>
                </Row>
              </Col>
            </Row>
          </FilterBar>

          {filteredCanMake.length > 0 ? (
            <Row gutter={[24, 24]}>
              {filteredCanMake.map((cocktail) => (
                <Col xs={24} sm={12} md={8} lg={6} key={cocktail.id}>
                  <Badge.Ribbon 
                    text={cocktail.matchPercentage === 100 ? "Ready to Make!" : `${cocktail.matchPercentage}% Match`}
                    color={cocktail.matchPercentage === 100 ? "green" : "orange"}
                  >
                    <CocktailCard
                      hoverable
                      cover={
                        <div style={{ 
                          height: 120, 
                          background: '#f6f6f6', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <div style={{ fontSize: 48 }}>🍸</div>
                          {cocktail.matchPercentage < 100 && (
                            <div style={{ 
                              position: 'absolute', 
                              bottom: 0, 
                              left: 0, 
                              right: 0 
                            }}>
                              <Progress 
                                percent={cocktail.matchPercentage} 
                                showInfo={false} 
                                strokeColor="#faad14"
                                trailColor="rgba(0,0,0,0.1)"
                                style={{ margin: 0 }}
                              />
                            </div>
                          )}
                        </div>
                      }
                    >
                      <Card.Meta
                        title={cocktail.name}
                        description={
                          <>
                            <div style={{ marginBottom: 8 }}>
                              <Text type="secondary">Ingredients:</Text>
                              <ul style={{ paddingLeft: 16, margin: '8px 0' }}>
                                {cocktail.ingredients.map((ing, idx) => (
                                  <li key={idx}>
                                    <Text 
                                      type={cocktail.missingIngredients.includes(ing) ? "danger" : undefined}
                                      delete={cocktail.missingIngredients.includes(ing)}
                                    >
                                      {ing}
                                    </Text>
                                    {cocktail.missingIngredients.includes(ing) && (
                                      <Text type="danger"> (missing)</Text>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Button 
                              type="primary" 
                              block
                              disabled={cocktail.matchPercentage < 100}
                            >
                              View Recipe
                            </Button>
                          </>
                        }
                      />
                    </CocktailCard>
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  {searchTerm 
                    ? 'No cocktails match your search criteria.' 
                    : 'Add ingredients to your bar inventory to see what cocktails you can make!'}
                </span>
              }
              style={{ marginTop: 48 }}
            >
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => {
                  setActiveTab('inventory');
                  handleAddIngredient();
                }}
              >
                Add Ingredients
              </Button>
            </Empty>
          )}
        </TabPane>
      </Tabs>

      {/* Add Ingredient Modal */}
      <Modal
        title="Add Ingredient"
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Ingredient Name"
                rules={[{ required: true, message: 'Please enter the ingredient name' }]}
              >
                <Input placeholder="e.g., Bourbon, Lime, Simple Syrup" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select a category">
                  {categories.map(category => (
                    <Option key={category.name} value={category.name}>
                      {category.icon} {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true, message: 'Please enter the amount' }]}
              >
                <Input placeholder="e.g., 750ml, 5 pieces" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lowStock"
                label="Stock Status"
                initialValue={false}
              >
                <Select>
                  <Option value={false}>In Stock</Option>
                  <Option value={true}>Low Stock</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea placeholder="Optional notes about this ingredient" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
