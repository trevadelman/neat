#!/bin/bash

# Neat Deployment Script
# This script helps deploy the Neat application to Vercel

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Print header
echo -e "${BOLD}${BLUE}"
echo "  _   _           _   "
echo " | \ | | ___  ___| |_ "
echo " |  \| |/ _ \/ _ \ __|"
echo " | |\  |  __/  __/ |_ "
echo " |_| \_|\___|\___|\__|"
echo -e "${NC}"
echo -e "${BOLD}Cocktail Discovery App Deployment Script${NC}\n"

# Check if Vercel CLI is installed
echo -e "${YELLOW}Checking if Vercel CLI is installed...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed.${NC}"
    echo -e "Installing Vercel CLI globally..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Vercel CLI. Please install it manually with 'npm install -g vercel'.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Vercel CLI installed successfully.${NC}"
else
    echo -e "${GREEN}Vercel CLI is already installed.${NC}"
fi

# Check if user is logged in to Vercel
echo -e "\n${YELLOW}Checking Vercel authentication status...${NC}"
VERCEL_TOKEN=$(vercel whoami 2>&1)
if [[ $VERCEL_TOKEN == *"Error"* ]]; then
    echo -e "${RED}You are not logged in to Vercel.${NC}"
    echo -e "Please login to Vercel:"
    vercel login
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to login to Vercel. Please try again.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Successfully logged in to Vercel.${NC}"
else
    echo -e "${GREEN}You are already logged in to Vercel as $VERCEL_TOKEN.${NC}"
fi

# Check for OpenAI API key
echo -e "\n${YELLOW}Checking for OpenAI API key...${NC}"
if [ -f .env.local ]; then
    if grep -q "NEXT_PUBLIC_OPENAI_API_KEY" .env.local; then
        echo -e "${GREEN}OpenAI API key found in .env.local file.${NC}"
    else
        echo -e "${YELLOW}OpenAI API key not found in .env.local file.${NC}"
        read -p "Do you want to add an OpenAI API key for AI Mixologist functionality? (y/n): " add_key
        if [[ $add_key == "y" || $add_key == "Y" ]]; then
            read -p "Enter your OpenAI API key: " api_key
            echo "NEXT_PUBLIC_OPENAI_API_KEY=$api_key" >> .env.local
            echo -e "${GREEN}OpenAI API key added to .env.local file.${NC}"
        else
            echo -e "${YELLOW}Skipping OpenAI API key. AI Mixologist will use sample responses.${NC}"
        fi
    fi
else
    echo -e "${YELLOW}No .env.local file found.${NC}"
    read -p "Do you want to add an OpenAI API key for AI Mixologist functionality? (y/n): " add_key
    if [[ $add_key == "y" || $add_key == "Y" ]]; then
        read -p "Enter your OpenAI API key: " api_key
        echo "NEXT_PUBLIC_OPENAI_API_KEY=$api_key" > .env.local
        echo -e "${GREEN}OpenAI API key added to .env.local file.${NC}"
    else
        echo -e "${YELLOW}Skipping OpenAI API key. AI Mixologist will use sample responses.${NC}"
    fi
fi

# Build the application
echo -e "\n${YELLOW}Building the application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}Build successful.${NC}"

# Deploy to Vercel
echo -e "\n${YELLOW}Deploying to Vercel...${NC}"
echo -e "Choose deployment type:"
echo -e "1. Preview deployment (for testing)"
echo -e "2. Production deployment"
read -p "Enter your choice (1/2): " deploy_choice

if [ "$deploy_choice" == "1" ]; then
    echo -e "\n${YELLOW}Starting preview deployment...${NC}"
    vercel
elif [ "$deploy_choice" == "2" ]; then
    echo -e "\n${YELLOW}Starting production deployment...${NC}"
    vercel --prod
else
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the errors and try again.${NC}"
    exit 1
fi

echo -e "\n${GREEN}${BOLD}Deployment completed successfully!${NC}"
echo -e "Your Neat application is now live on Vercel."
echo -e "You can access your deployment settings and custom domain setup in the Vercel dashboard."
echo -e "\n${BOLD}Thank you for using Neat!${NC}"
