"use client";

import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Divider, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Card,
  Tag,
  Upload,
  message,
  InputNumber,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  MinusCircleOutlined, 
  UploadOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Cocktail } from '@/lib/db/neatDB';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StyledForm = styled(Form)`
  .ant-form-item-label {
    font-weight: 500;
  }
`;

const StepItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  
  .step-number {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #722ed1;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    font-weight: bold;
  }
  
  .step-content {
    flex-grow: 1;
  }
  
  .step-actions {
    flex-shrink: 0;
    margin-left: 16px;
  }
`;

const PreviewCard = styled(Card)`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
`;

const TagsContainer = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

interface CocktailFormProps {
  initialValues?: Partial<Cocktail>;
  onSave: (cocktail: Omit<Cocktail, 'id'>) => void;
  onCancel: () => void;
}

const CocktailForm: React.FC<CocktailFormProps> = ({ 
  initialValues, 
  onSave, 
  onCancel 
}) => {
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [formValues, setFormValues] = useState<any>(initialValues || {});
  
  // Available glassware options
  const glasswareOptions = [
    { value: 'rocks', label: 'Rocks Glass' },
    { value: 'coupe', label: 'Coupe' },
    { value: 'highball', label: 'Highball' },
    { value: 'martini', label: 'Martini Glass' },
    { value: 'collins', label: 'Collins Glass' },
    { value: 'hurricane', label: 'Hurricane Glass' },
    { value: 'copper_mug', label: 'Copper Mug' },
    { value: 'wine', label: 'Wine Glass' },
    { value: 'flute', label: 'Champagne Flute' },
    { value: 'shot', label: 'Shot Glass' },
    { value: 'tiki', label: 'Tiki Mug' },
    { value: 'other', label: 'Other' },
  ];
  
  // Available unit options
  const unitOptions = [
    { value: 'oz', label: 'oz' },
    { value: 'ml', label: 'ml' },
    { value: 'cl', label: 'cl' },
    { value: 'dash', label: 'dash' },
    { value: 'dashes', label: 'dashes' },
    { value: 'barspoon', label: 'barspoon' },
    { value: 'tsp', label: 'tsp' },
    { value: 'tbsp', label: 'tbsp' },
    { value: 'piece', label: 'piece' },
    { value: 'pieces', label: 'pieces' },
    { value: 'slice', label: 'slice' },
    { value: 'slices', label: 'slices' },
    { value: 'sprig', label: 'sprig' },
    { value: 'leaf', label: 'leaf' },
    { value: 'leaves', label: 'leaves' },
    { value: 'pinch', label: 'pinch' },
    { value: 'drop', label: 'drop' },
    { value: 'drops', label: 'drops' },
    { value: 'rim', label: 'rim' },
    { value: 'float', label: 'float' },
    { value: 'splash', label: 'splash' },
    { value: 'top', label: 'top with' },
  ];
  
  // Common tags for cocktails
  const commonTags = [
    'whiskey', 'gin', 'vodka', 'rum', 'tequila', 'mezcal', 'brandy',
    'sweet', 'sour', 'bitter', 'spicy', 'herbal', 'fruity', 'smoky',
    'classic', 'modern', 'tiki', 'tropical', 'refreshing', 'strong',
    'aperitif', 'digestif', 'summer', 'winter', 'fall', 'spring',
    'shaken', 'stirred', 'built', 'blended', 'hot', 'cold',
    'egg white', 'creamy', 'fizzy', 'sparkling', 'low-abv', 'non-alcoholic'
  ];
  
  const handleValuesChange = (changedValues: any, allValues: any) => {
    setFormValues(allValues);
  };
  
  const handleFinish = (values: any) => {
    // Format the data to match the Cocktail type
    const cocktail: Omit<Cocktail, 'id'> = {
      name: values.name,
      description: values.description,
      glassware: values.glassware,
      ingredients: values.ingredients || [],
      instructions: values.instructions || [],
      tags: values.tags || [],
      dateAdded: new Date(),
      images: [], // Would handle image uploads in a real implementation
      isFavorite: false,
      rating: 0,
    };
    
    onSave(cocktail);
  };
  
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };
  
  // Custom tag input
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  
  const handleTagInputConfirm = () => {
    if (tagInputValue && !formValues.tags?.includes(tagInputValue)) {
      const tags = [...(formValues.tags || []), tagInputValue];
      form.setFieldsValue({ tags });
      setFormValues({ ...formValues, tags });
    }
    setTagInputVisible(false);
    setTagInputValue('');
  };
  
  const handleTagClose = (removedTag: string) => {
    const tags = formValues.tags?.filter((tag: string) => tag !== removedTag) || [];
    form.setFieldsValue({ tags });
    setFormValues({ ...formValues, tags });
  };
  
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={previewVisible ? 12 : 24}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{initialValues ? 'Edit Cocktail' : 'Create New Cocktail'}</span>
                <Button 
                  type="primary" 
                  ghost 
                  onClick={togglePreview}
                >
                  {previewVisible ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            }
            bordered={false}
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
          >
            <StyledForm
              form={form}
              layout="vertical"
              initialValues={initialValues || {
                ingredients: [{ name: '', amount: '', unit: 'oz', optional: false }],
                instructions: [''],
                tags: [],
              }}
              onFinish={handleFinish}
              onValuesChange={handleValuesChange}
            >
              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="name"
                    label="Cocktail Name"
                    rules={[{ required: true, message: 'Please enter a name for your cocktail' }]}
                  >
                    <Input placeholder="e.g., Whiskey Sour, Negroni, etc." />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="glassware"
                    label="Glassware"
                    rules={[{ required: true, message: 'Please select a glassware' }]}
                  >
                    <Select placeholder="Select glassware">
                      {glasswareOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <TextArea 
                  placeholder="Describe your cocktail in a few sentences..." 
                  rows={3}
                />
              </Form.Item>
              
              <Divider orientation="left">Ingredients</Divider>
              
              <Form.List name="ingredients">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={8} style={{ marginBottom: 16 }}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            rules={[{ required: true, message: 'Missing ingredient name' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Ingredient name" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'amount']}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Amount" />
                          </Form.Item>
                        </Col>
                        <Col xs={8} sm={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'unit']}
                            style={{ marginBottom: 0 }}
                          >
                            <Select placeholder="Unit">
                              {unitOptions.map(option => (
                                <Option key={option.value} value={option.value}>{option.label}</Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={4} sm={2} style={{ display: 'flex', alignItems: 'center' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'optional']}
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Switch size="small" checkedChildren="Opt" unCheckedChildren="Req" />
                          </Form.Item>
                          {fields.length > 1 && (
                            <Button
                              type="text"
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(name)}
                              danger
                              style={{ marginLeft: 8 }}
                            />
                          )}
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button 
                        type="dashed" 
                        onClick={() => add({ name: '', amount: '', unit: 'oz', optional: false })} 
                        block 
                        icon={<PlusOutlined />}
                      >
                        Add Ingredient
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              
              <Divider orientation="left">Instructions</Divider>
              
              <Form.List name="instructions">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <StepItem key={key}>
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">
                          <Form.Item
                            {...restField}
                            name={name}
                            rules={[{ required: true, message: 'Missing instruction step' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder={`Step ${index + 1}`} />
                          </Form.Item>
                        </div>
                        <div className="step-actions">
                          {fields.length > 1 && (
                            <Button
                              type="text"
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(name)}
                              danger
                            />
                          )}
                        </div>
                      </StepItem>
                    ))}
                    <Form.Item>
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                      >
                        Add Step
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              
              <Divider orientation="left">Tags</Divider>
              
              <Form.Item name="tags">
                <Select
                  mode="multiple"
                  placeholder="Select or create tags"
                  style={{ width: '100%' }}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                          placeholder="Enter custom tag"
                          value={tagInputValue}
                          onChange={e => setTagInputValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleTagInputConfirm()}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={handleTagInputConfirm}>
                          Add Tag
                        </Button>
                      </Space>
                    </>
                  )}
                >
                  {commonTags.map(tag => (
                    <Option key={tag} value={tag}>{tag}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Divider />
              
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    {initialValues ? 'Update Cocktail' : 'Save Cocktail'}
                  </Button>
                  <Button onClick={onCancel} icon={<CloseOutlined />}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </StyledForm>
          </Card>
        </motion.div>
      </Col>
      
      {previewVisible && (
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
          >
            <PreviewCard
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Preview</span>
                  <Text type="secondary">Live preview as you type</Text>
                </div>
              }
              bordered={false}
            >
              {formValues.name ? (
                <>
                  <Title level={3}>{formValues.name}</Title>
                  <Paragraph>{formValues.description}</Paragraph>
                  
                  {formValues.tags?.length > 0 && (
                    <TagsContainer>
                      {formValues.tags.map((tag: string, index: number) => (
                        <Tag key={index} color="purple">{tag}</Tag>
                      ))}
                    </TagsContainer>
                  )}
                  
                  <Divider orientation="left">Ingredients</Divider>
                  <ul style={{ paddingLeft: 20 }}>
                    {formValues.ingredients?.map((ingredient: any, index: number) => (
                      <li key={index}>
                        <Text>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                          {ingredient.optional && ' (optional)'}
                        </Text>
                      </li>
                    ))}
                  </ul>
                  
                  <Divider orientation="left">Instructions</Divider>
                  <ol style={{ paddingLeft: 20 }}>
                    {formValues.instructions?.map((instruction: string, index: number) => (
                      <li key={index}>
                        <Text>{instruction}</Text>
                      </li>
                    ))}
                  </ol>
                  
                  {formValues.glassware && (
                    <>
                      <Divider orientation="left">Details</Divider>
                      <p><strong>Glassware:</strong> {
                        glasswareOptions.find(option => option.value === formValues.glassware)?.label || formValues.glassware
                      }</p>
                    </>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Paragraph type="secondary">
                    Fill out the form to see a preview of your cocktail
                  </Paragraph>
                </div>
              )}
            </PreviewCard>
          </motion.div>
        </Col>
      )}
    </Row>
  );
};

export default CocktailForm;
