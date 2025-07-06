# Thinkzo - AI-Powered Digital Solutions

A modern, AI-powered website built with React, TypeScript, and Supabase featuring a complete content management system.

## 🚀 Features

### Frontend
- **Modern React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Responsive Design** for all devices
- **AI Chat Integration** with ChatGPT
- **Dynamic Content Loading** from CMS

### Backend & Database
- **Supabase** for database and authentication
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates
- **Edge Functions** for serverless AI chat

### Content Management System
- **Full CMS** for non-technical users
- **Content Editor** for all website sections
- **Team Management** with CRUD operations
- **Site Settings** management
- **Navigation Management**
- **Contact Form** with database storage

### AI Features
- **ChatGPT Integration** for customer support
- **Neural Website Design** concepts
- **Intelligent Content** management
- **Smart Contact Forms**

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (for AI Chat)
OPENAI_API_KEY=your_openai_api_key
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Run the migration files in `/supabase/migrations/`
3. Set up the OpenAI API key in Supabase Edge Functions secrets
4. Deploy the chat edge function

### 3. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 4. Admin Access

1. Sign up with your admin email
2. Update the user role to 'admin' in the database
3. Access admin panel at `/admin`

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── auth/            # Authentication components
│   ├── chat/            # AI chat components
│   ├── layout/          # Layout components
│   ├── modals/          # Modal components
│   ├── pages/           # Page components
│   └── ui/              # UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
└── main.tsx            # Application entry point

supabase/
├── functions/          # Edge functions
└── migrations/         # Database migrations
```

## 🎯 Key Features

### Admin Dashboard
- **Content Management**: Edit all website content
- **Team Management**: Add/edit team members
- **Site Settings**: Configure global settings
- **System Testing**: Test functionality
- **User Management**: Manage user accounts

### Public Features
- **Responsive Design**: Works on all devices
- **AI Chat Support**: 24/7 AI assistance
- **Contact Forms**: Multiple contact options
- **Dynamic Content**: CMS-driven content
- **SEO Optimized**: Meta tags and sitemap

### Security
- **Row Level Security**: Database-level protection
- **Authentication**: Secure user management
- **Input Validation**: Prevent malicious input
- **CORS Protection**: Secure API endpoints

## 🚀 Deployment

### Spaceship Hosting (Recommended)

1. Connect your repository to Spaceship
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Spaceship dashboard
5. Deploy!

### Other Platforms

The site works with any static hosting provider:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 🧪 Testing

Use the built-in testing panel in the admin dashboard to verify:
- Supabase connection
- Contact form functionality
- AI chat integration
- Environment variables

## 📝 Content Management

### Editing Content
1. Access admin dashboard
2. Go to "Content Editor"
3. Select section to edit
4. Make changes and save

### Managing Team
1. Go to "Team Management"
2. Add/edit team members
3. Set display order and social links

### Site Settings
1. Access "Site Settings"
2. Update company information
3. Configure social media links
4. Set contact information

## 🤖 AI Integration

The AI chat uses OpenAI's GPT model with custom training about Thinkzo:
- Company information
- Service details
- Pricing packages
- Team information
- Contact details

## 📊 Analytics & Monitoring

- Contact form submissions tracked
- User interactions logged
- Admin actions audited
- Performance monitoring ready

## 🔧 Customization

### Adding New Content Sections
1. Add to database via admin panel
2. Create component in frontend
3. Connect to CMS hook

### Styling Changes
- Modify Tailwind classes
- Update color schemes in components
- Customize animations with Framer Motion

## 📞 Support

For technical support or questions:
- Email: team@thinkzo.ai
- Phone: +1 (555) 123-4567

## 📄 License

© 2024 Thinkzo. All rights reserved.