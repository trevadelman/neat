"use client";

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Select, 
  Input, 
  Rate, 
  Button, 
  Divider, 
  Row, 
  Col, 
  Upload, 
  message, 
  Progress,
  Statistic,
  Tooltip,
  Modal,
  Space
} from 'antd';
import { 
  StarOutlined, 
  UploadOutlined, 
  CameraOutlined, 
  SaveOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useCocktailDB from '@/hooks/useCocktailDB';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RatingCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const RatingSection = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 8px;
  background-color: #fafafa;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const RatingTitle = styled(Text)`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 16px;
`;

const RatingDescription = styled(Text)`
  display: block;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 12px;
  font-style: italic;
`;

const UploadContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreDisplay = styled.div`
  text-align: center;
  margin-top: 24px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f6f6f6;
`;

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #722ed1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  margin: 0 auto 16px;
  box-shadow: 0 4px 12px rgba(114, 46, 209, 0.2);
`;

export default function RateDrink() {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<string>('spirit');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const [ratings, setRatings] = useState({
    aroma: 0,
    flavor: 0,
    mouthfeel: 0,
    finish: 0,
    overall: 0,
  });
  const [totalScore, setTotalScore] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Get the database functions from the custom hook
  const { updateCocktail } = useCocktailDB();

  // Rating descriptions for each score
  const ratingDescriptions = {
    aroma: [
      "Dull, overly harsh, or unbalanced with strong alcohol burn.",
      "Simple, with one or two noticeable notes but lacking depth.",
      "Pleasant with a mix of aromas, though not overly complex.",
      "Rich and layered, offering a variety of well-balanced scents.",
      "Exceptionally complex and inviting, evolving with each sniff.",
    ],
    flavor: [
      "Overly harsh, one-note, or dominated by a single unpleasant taste.",
      "Some variety in flavor but unbalanced or lacking harmony.",
      "Well-rounded with distinct, enjoyable flavors but not exceptional.",
      "Complex, well-integrated flavors that evolve as you sip.",
      "Deep, dynamic, and masterfully balanced, with layers of flavor unfolding.",
    ],
    mouthfeel: [
      "Thin, watery, or rough with an unpleasant burn.",
      "Slightly more body, but still lacking smoothness or richness.",
      "Decent texture, neither too light nor too heavy, with a balanced feel.",
      "Velvety and satisfying, with a noticeable weight and smoothness.",
      "Luxuriously smooth and full-bodied, with a silky, well-integrated texture.",
    ],
    finish: [
      "Short, harsh, or leaves an unpleasant lingering taste.",
      "Noticeable finish but fades quickly or has a slightly off-putting aftertaste.",
      "Satisfying length with a clean, enjoyable aftertaste.",
      "Long, smooth, and pleasantly evolving finish.",
      "Exceptionally long, complex, and memorable, inviting another sip.",
    ],
    overall: [
      "Not enjoyable; wouldn't drink again.",
      "Drinkable but not something I'd choose often.",
      "A solid, enjoyable spirit that I'd drink again.",
      "Highly enjoyable, something I'd seek out and recommend.",
      "Outstanding; a must-have that I'd happily enjoy regularly.",
    ],
  };

  // Drink types and subtypes
  const drinkTypes = {
    spirit: {
      label: 'Spirit',
      subtypes: {
        whiskey: ['Bourbon', 'Scotch', 'Rye', 'Irish', 'Japanese', 'Canadian', 'Other'],
        gin: ['London Dry', 'Plymouth', 'Old Tom', 'Navy Strength', 'Contemporary', 'Other'],
        vodka: ['Wheat', 'Potato', 'Corn', 'Rye', 'Grape', 'Flavored', 'Other'],
        rum: ['White/Silver', 'Gold', 'Dark', 'Aged', 'Spiced', 'Agricole', 'Other'],
        tequila: ['Blanco', 'Reposado', 'Añejo', 'Extra Añejo', 'Mezcal', 'Other'],
        other: ['Brandy', 'Cognac', 'Armagnac', 'Pisco', 'Aquavit', 'Absinthe', 'Other'],
      }
    },
    beer: {
      label: 'Beer',
      subtypes: {
        ale: ['IPA', 'Pale Ale', 'Brown Ale', 'Porter', 'Stout', 'Sour', 'Other'],
        lager: ['Pilsner', 'Helles', 'Bock', 'Dunkel', 'Vienna', 'Märzen', 'Other'],
        wheat: ['Hefeweizen', 'Witbier', 'Berliner Weisse', 'Gose', 'Other'],
        specialty: ['Fruit Beer', 'Spiced Beer', 'Smoked Beer', 'Barrel-Aged', 'Other'],
      }
    },
    wine: {
      label: 'Wine',
      subtypes: {
        red: ['Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Syrah/Shiraz', 'Zinfandel', 'Other'],
        white: ['Chardonnay', 'Sauvignon Blanc', 'Riesling', 'Pinot Grigio', 'Other'],
        sparkling: ['Champagne', 'Prosecco', 'Cava', 'Other'],
        rose: ['Dry', 'Sweet', 'Sparkling', 'Other'],
        fortified: ['Port', 'Sherry', 'Madeira', 'Vermouth', 'Other'],
      }
    },
    cocktail: {
      label: 'Cocktail',
      subtypes: {
        classic: ['Old Fashioned', 'Manhattan', 'Martini', 'Negroni', 'Daiquiri', 'Other'],
        modern: ['Espresso Martini', 'Penicillin', 'Paper Plane', 'Other'],
        tiki: ['Mai Tai', 'Zombie', 'Painkiller', 'Other'],
        lowABV: ['Spritz', 'Sherry Cocktail', 'Vermouth Cocktail', 'Other'],
        nonAlcoholic: ['Mocktail', 'Spirit-Free', 'Other'],
      }
    },
  };

  // Handle type change
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setSelectedSubtype('');
    form.setFieldsValue({ itemSubType: undefined, itemCategory: undefined });
  };

  // Handle subtype change
  const handleSubtypeChange = (value: string) => {
    setSelectedSubtype(value);
    form.setFieldsValue({ itemSubType: undefined });
  };

  // Handle rating change
  const handleRatingChange = (field: string, value: number) => {
    setRatings(prev => ({ ...prev, [field]: value }));
  };

  // Calculate total score
  useEffect(() => {
    const total = Object.values(ratings).reduce((sum, rating) => sum + rating, 0);
    setTotalScore(total);
  }, [ratings]);

  // Get score color based on total
  const getScoreColor = (score: number) => {
    if (score >= 20) return '#52c41a'; // Green
    if (score >= 15) return '#1890ff'; // Blue
    if (score >= 10) return '#faad14'; // Yellow
    return '#f5222d'; // Red
  };

  // Get score text based on total
  const getScoreText = (score: number) => {
    if (score >= 20) return 'Exceptional';
    if (score >= 15) return 'Very Good';
    if (score >= 10) return 'Good';
    if (score >= 5) return 'Average';
    return 'Poor';
  };

  // Handle image upload
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // Handle image preview
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Prepare the rating data
      const ratingData = {
        ...values,
        ratings,
        totalScore,
        scoreText: getScoreText(totalScore),
        dateAdded: values.dateAdded || new Date().toISOString().split('T')[0],
        images: fileList.map(file => file.url || file.preview),
      };
      
      // Save the rating (in a real implementation, this would be saved to the database)
      console.log('Rating data:', ratingData);
      
      // Show success message
      message.success('Rating saved successfully!');
      setSaveSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        form.resetFields();
        setRatings({
          aroma: 0,
          flavor: 0,
          mouthfeel: 0,
          finish: 0,
          overall: 0,
        });
        setFileList([]);
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      message.error('Failed to save rating. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Rate a Drink</Title>
          <Paragraph>Rate and keep track of your favorite spirits, beers, and wines</Paragraph>
        </Col>
        <Col>
          <Tooltip title="Your ratings are stored locally in your browser">
            <Button icon={<InfoCircleOutlined />}>How It Works</Button>
          </Tooltip>
        </Col>
      </Row>

      <Form 
        form={form} 
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          itemType: 'spirit',
          dateAdded: new Date().toISOString().split('T')[0],
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <RatingCard>
            <Title level={4}>Drink Information</Title>
            
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item 
                  label="Type" 
                  name="itemType" 
                  rules={[{ required: true, message: 'Please select a type' }]}
                >
                  <Select 
                    placeholder="Select type"
                    onChange={handleTypeChange}
                  >
                    {Object.entries(drinkTypes).map(([key, value]) => (
                      <Option key={key} value={key}>{value.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item 
                  label="Category" 
                  name="itemCategory"
                  rules={[{ required: true, message: 'Please select a category' }]}
                >
                  <Select 
                    placeholder="Select category"
                    onChange={handleSubtypeChange}
                  >
                    {selectedType && Object.entries(drinkTypes[selectedType as keyof typeof drinkTypes].subtypes).map(([key, _]) => (
                      <Option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item 
                  label="Subtype" 
                  name="itemSubType"
                >
                  <Select placeholder="Select subtype">
                    {selectedType && selectedSubtype && 
                      (drinkTypes[selectedType as keyof typeof drinkTypes].subtypes as any)[selectedSubtype]?.map((subtype: string, index: number) => (
                        <Option key={index} value={subtype.toLowerCase()}>{subtype}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item 
                  label="Brand/Producer" 
                  name="brand"
                  rules={[{ required: true, message: 'Please enter a brand or producer' }]}
                >
                  <Input placeholder="e.g., Buffalo Trace, Hendrick's" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item 
                  label="Name/Expression" 
                  name="itemName" 
                  rules={[{ required: true, message: 'Please enter a name' }]}
                >
                  <Input placeholder="e.g., Single Barrel, London Dry" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item 
                  label="Date" 
                  name="dateAdded"
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>
            
            <UploadContainer>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleUploadChange}
                beforeUpload={() => false} // Prevent auto upload
              >
                {fileList.length >= 3 ? null : (
                  <div>
                    <CameraOutlined style={{ fontSize: 24 }} />
                    <div style={{ marginTop: 8 }}>Upload Photo</div>
                  </div>
                )}
              </Upload>
              <Text type="secondary">Upload photos of the bottle, label, or drink</Text>
            </UploadContainer>
          </RatingCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <RatingCard>
                <Title level={4}>Rating</Title>
                
                <RatingSection>
                  <RatingTitle>
                    Aroma & Complexity – How inviting and layered is the nose?
                  </RatingTitle>
                  <Form.Item name="aroma">
                    <Rate 
                      onChange={(value) => handleRatingChange('aroma', value)} 
                      value={ratings.aroma}
                    />
                  </Form.Item>
                  <RatingDescription>
                    {ratings.aroma > 0 
                      ? ratingDescriptions.aroma[ratings.aroma - 1] 
                      : "Rate from 1 to 5 stars"}
                  </RatingDescription>
                </RatingSection>
                
                <RatingSection>
                  <RatingTitle>
                    Flavor Depth & Balance – How well do the flavors develop on the palate?
                  </RatingTitle>
                  <Form.Item name="flavor">
                    <Rate 
                      onChange={(value) => handleRatingChange('flavor', value)}
                      value={ratings.flavor}
                    />
                  </Form.Item>
                  <RatingDescription>
                    {ratings.flavor > 0 
                      ? ratingDescriptions.flavor[ratings.flavor - 1] 
                      : "Rate from 1 to 5 stars"}
                  </RatingDescription>
                </RatingSection>
                
                <RatingSection>
                  <RatingTitle>
                    Mouthfeel & Body – How does it feel in terms of texture and weight?
                  </RatingTitle>
                  <Form.Item name="mouthfeel">
                    <Rate 
                      onChange={(value) => handleRatingChange('mouthfeel', value)}
                      value={ratings.mouthfeel}
                    />
                  </Form.Item>
                  <RatingDescription>
                    {ratings.mouthfeel > 0 
                      ? ratingDescriptions.mouthfeel[ratings.mouthfeel - 1] 
                      : "Rate from 1 to 5 stars"}
                  </RatingDescription>
                </RatingSection>
                
                <RatingSection>
                  <RatingTitle>
                    Finish & Aftertaste – How enjoyable and lasting is the finish?
                  </RatingTitle>
                  <Form.Item name="finish">
                    <Rate 
                      onChange={(value) => handleRatingChange('finish', value)}
                      value={ratings.finish}
                    />
                  </Form.Item>
                  <RatingDescription>
                    {ratings.finish > 0 
                      ? ratingDescriptions.finish[ratings.finish - 1] 
                      : "Rate from 1 to 5 stars"}
                  </RatingDescription>
                </RatingSection>
                
                <RatingSection>
                  <RatingTitle>
                    Overall Enjoyment & Drinkability – How likely would you be to have this again?
                  </RatingTitle>
                  <Form.Item name="overall">
                    <Rate 
                      onChange={(value) => handleRatingChange('overall', value)}
                      value={ratings.overall}
                    />
                  </Form.Item>
                  <RatingDescription>
                    {ratings.overall > 0 
                      ? ratingDescriptions.overall[ratings.overall - 1] 
                      : "Rate from 1 to 5 stars"}
                  </RatingDescription>
                </RatingSection>
              </RatingCard>
            </Col>
            
            <Col xs={24} lg={8}>
              <RatingCard>
                <Title level={4}>Total Score</Title>
                
                <ScoreDisplay>
                  <ScoreCircle style={{ backgroundColor: getScoreColor(totalScore) }}>
                    {totalScore}/25
                  </ScoreCircle>
                  <Title level={3}>{getScoreText(totalScore)}</Title>
                  
                  <Divider />
                  
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic 
                        title="Aroma" 
                        value={ratings.aroma} 
                        suffix="/5"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Flavor" 
                        value={ratings.flavor} 
                        suffix="/5"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Mouthfeel" 
                        value={ratings.mouthfeel} 
                        suffix="/5"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Finish" 
                        value={ratings.finish} 
                        suffix="/5"
                      />
                    </Col>
                  </Row>
                  
                  <Divider />
                  
                  <Progress 
                    percent={totalScore * 4} 
                    status={totalScore >= 20 ? "success" : "active"}
                    strokeColor={getScoreColor(totalScore)}
                    format={() => `${totalScore}/25`}
                  />
                </ScoreDisplay>
                
                <Divider />
                
                <Form.Item name="notes">
                  <TextArea 
                    rows={4} 
                    placeholder="Add your tasting notes, impressions, or any other thoughts about this drink..."
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={saveSuccess ? <CheckCircleOutlined /> : <SaveOutlined />}
                    size="large"
                    block
                    loading={saveSuccess}
                  >
                    {saveSuccess ? 'Rating Saved!' : 'Save Rating'}
                  </Button>
                </Form.Item>
              </RatingCard>
            </Col>
          </Row>
        </motion.div>
      </Form>
      
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
