# Neat - Your Personal Cocktail Discovery App

![Neat Logo](https://img.shields.io/badge/Neat-Cocktail%20App-722ed1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.14.2-0170FE?style=for-the-badge&logo=ant-design)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)

Neat is a modern web application for cocktail enthusiasts that runs entirely in your browser. Discover new cocktails, manage your bar inventory, and keep track of your favorite drinks - all without requiring a server or database.

## 🍸 Features

### The Menu
- Personal cocktail library with search and filtering capabilities
- Detailed cocktail cards with ingredients, instructions, and tags
- Favorite and organize your cocktail collection

### Something New
- AI-powered mixologist for personalized cocktail recommendations
- Chat interface for natural language interaction
- Save AI-generated recipes to your collection

### Bar Cart
- Track your bar inventory
- Get cocktail recommendations based on what you have
- Add ingredients directly from cocktail recipes

### Rate a Drink
- Comprehensive rating system for spirits, beers, and wines
- Track tasting notes and preferences
- Detailed rating criteria for aroma, flavor, mouthfeel, and more

## 🔍 Key Technical Features

- **In-Browser Storage**: All data is stored locally in your browser using IndexedDB
- **No Accounts Required**: Your data never leaves your device
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Support**: Use the app even without an internet connection
- **Serving Calculator**: Adjust recipes for different serving sizes
- **Progressive Web App**: Install on your device for quick access

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/neat.git
   cd neat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🌐 Deployment

### Deploying to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Environment Variables

If you want to use the AI Mixologist feature, you'll need to add your OpenAI API key:

1. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
   ```

2. When deploying to Vercel, add the environment variable in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `NEXT_PUBLIC_OPENAI_API_KEY` with your API key

## 📱 Progressive Web App

Neat is designed as a Progressive Web App (PWA), which means you can install it on your device for quick access:

1. Open the application in your browser
2. Look for the "Add to Home Screen" or "Install" option in your browser menu
3. Follow the prompts to install the app

## 🧪 Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Ant Design**: UI component library
- **Styled Components**: CSS-in-JS styling
- **Dexie.js**: IndexedDB wrapper for in-browser storage
- **Framer Motion**: Animation library
- **Jotai/Zustand**: State management
- **OpenAI API**: For AI-powered cocktail recommendations

## 📝 Roadmap

- [ ] Add image upload and compression for cocktail photos
- [ ] Implement export/import functionality for backup and sharing
- [ ] Add more sophisticated filtering options for the cocktail library
- [ ] Enhance the AI Mixologist with more context-aware recommendations
- [ ] Add a community section for sharing recipes (optional server component)
- [ ] Implement a shopping list feature based on missing ingredients

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Cocktail recipes inspired by various mixology resources
- Icons provided by Ant Design and React Icons
- Special thanks to all the cocktail enthusiasts who provided feedback

---

Made with ❤️ and a splash of bitters
