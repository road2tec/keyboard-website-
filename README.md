# AI Smart Keyboard System

Revolutionizing digital communication with real-time AI grammar correction, smart suggestions, and multilingual support.

## 🚀 Features

### 🎹 Advanced Input Methods
- **Physical Keyboard Support**: Use your laptop or external keyboard with full real-time mapping.
- **Multilingual Typing**: Seamlessly switch between **English**, **Hindi**, and **Marathi**.
- **Integrated Language Toggles**: Switch scripts directly from the on-screen keyboard with clear labels (abc/मराठी/हिंदी).
- **Clipboard Integration**: Full support for Copy and Paste (`Ctrl+C`, `Ctrl+V`).

### 🤖 Intelligent AI Engine
- **Auto-Correction**: Real-time grammar and spelling correction powered by Google Gemini AI.
- **Smart Suggestions**: Context-aware word and sentence completions.
- **Auto-Language Detection**: Automatically detects script changes (English vs. Devanagari) as you type.
- **Real-Time Auto-Prediction**: Debounced AI calls trigger high-quality suggestions after short typing pauses or immediate pastes.
- **Emoji Support**: Contextual emoji suggestions and dedicated emoji layout.

### 🎨 Premium User Experience
- **Immersive Demo**: Distraction-free, full-screen keyboard interface.
- **Dynamic Themes**: Multiple premium themes including **Dark**, **Gradient**, and **Neon**.
- **Public Access**: Try the keyboard demo instantly without registration.
- **Responsive Design**: Polished, modern UI built with Next.js and Vanilla CSS.

### 🛡️ Secure Admin Panel
- **Infrastructure Monitoring**: Real-time health checks and system status.
- **Live Activity Logs**: Monitor AI usage and system events.
- **Secure Access**: Dedicated admin-only entry points and authentication.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Engine**: [Google Gemini AI API](https://ai.google.dev/)
- **Styling**: Vanilla CSS (Custom UI Components)
- **Deployment**: Optimized for Vercel

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd smart-keyboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Landing Page: `http://localhost:3000`
   - Keyboard Demo: `http://localhost:3000/demo`
   - Admin Login: `http://localhost:3000/admin/login`

## 📄 License

Internal Project - All Rights Reserved.
