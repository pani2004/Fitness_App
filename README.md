# 🏋️ AI Fitness Coach App

An AI-powered fitness assistant built with **Next.js 15**, **Gemini AI**, **ElevenLabs**, and modern web technologies that generates personalized workout and diet plans with voice narration and AI-generated images.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-TTS-6366F1)

## 🌟 Features

### 📋 Comprehensive User Input Form
- **Personal Details**: Name, Age, Gender
- **Physical Stats**: Height, Weight, BMI calculation
- **Fitness Goal**: Weight Loss, Muscle Gain, General Fitness, Endurance
- **Fitness Level**: Beginner, Intermediate, Advanced
- **Workout Preferences**: Home, Gym, or Outdoor
- **Dietary Preferences**: Vegetarian, Non-Vegetarian, Vegan, Keto
- **Optional Fields**: Medical history, stress level, available equipment

### 🧠 AI-Powered Plan Generation
- Powered by **Google Gemini AI** (gemini-2.5-flash)
- Dynamic prompt engineering - No hardcoded plans
- Generates:
  - 🏋️ **7-Day Workout Plan** with sets, reps, rest times
  - 🥗 **Daily Diet Plan** with meal breakdowns
  - 💡 **Tips & Motivation** with lifestyle advice

### 🔊 AI Voice Narration
- **ElevenLabs TTS** integration
- 9 premium AI voices (male & female)
- Section selector (Workout/Diet/Tips)
- Full audio controls (Play/Pause/Resume/Stop)

### ��️ AI Image Generation
- **Pollinations.ai** integration (free!)
- Click exercises/meals to generate images
- Image modal preview with download
- localStorage caching

### 📄 Export & Storage
- PDF export functionality
- Save plans to localStorage
- View plan history
- Regenerate plans anytime

### 🎨 Modern UI/UX
- Dark/Light mode toggle
- Responsive design (mobile, tablet, desktop)
- Framer Motion animations
- 3D fitness background (Three.js)
- Scroll animations

## 🛠️ Tech Stack

**Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, Three.js  
**Backend**: Next.js API Routes, Google Gemini AI, ElevenLabs API  
**Forms**: React Hook Form, Zod validation  
**Libraries**: jspdf, html2canvas, next-themes, lucide-react

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini API key
- ElevenLabs API key

### Installation

```bash
# Clone repository
git clone https://github.com/pani2004/Fitness_App.git
cd Fitness_App/my-app

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
GOOGLE_GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Getting API Keys

**Google Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)  
**ElevenLabs**: [ElevenLabs Dashboard](https://elevenlabs.io) (10,000 chars/month free)

## 📖 Usage

1. **Landing Page** - Click "Get Started"
2. **Fill Form** - Complete 5-step user form
3. **View Plan** - Get personalized workout & diet plans
4. **Voice** - Listen to plans with AI narration
5. **Images** - Click exercises/meals for visuals
6. **Export** - Download PDF or save for later

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/
│   │   ├── generate-plan/route.ts
│   │   └── text-to-speech/route.ts
│   └── page.tsx
├── components/
│   ├── forms/UserForm.tsx
│   ├── plan-display/
│   ├── VoicePlayerElevenLabs.tsx
│   ├── ImageModal.tsx
│   └── SavedPlans.tsx
├── lib/
│   ├── ai/gemini-client.ts
│   ├── tts/elevenlabs.ts
│   └── storage/local-storage.ts
├── types/
│   ├── user.ts
│   └── plan.ts
└── .env.local
```

## 🚢 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables:
   - `GOOGLE_GEMINI_API_KEY`
   - `ELEVENLABS_API_KEY`
4. Deploy!

## 💰 API Costs

- **Gemini AI**: Free tier with rate limits
- **ElevenLabs**: 10,000 chars/month free (~3 full plans)
- **Pollinations.ai**: Completely free

## 📝 License

MIT License

## 👨‍💻 Author

**Debashis Pani**  
GitHub: [@pani2004](https://github.com/pani2004)  
Repository: [Fitness_App](https://github.com/pani2004/Fitness_App)

## 🙏 Acknowledgments

- Next.js, Google Gemini AI, ElevenLabs, Pollinations.ai
- Shadcn UI, Framer Motion, Three.js

---

**Built with ❤️ using Next.js and AI**
