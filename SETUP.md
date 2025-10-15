# IC Marking Verification Website - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
IC_marking/
├── pages/                  # Next.js pages (routes)
│   ├── _app.js            # App wrapper with Layout
│   ├── _document.js       # HTML document structure
│   ├── index.js           # Home page
│   ├── verify.js          # Upload/Scan page
│   ├── result.js          # Verification results page
│   ├── learning.js        # Learning/Awareness page
│   ├── manufacturer.js    # Manufacturer portal
│   └── analytics.js       # Analytics dashboard
├── components/            # Reusable components
│   └── Layout.js         # Main layout with nav & footer
├── styles/               # Global styles
│   └── globals.css       # Tailwind CSS & custom styles
├── public/               # Static assets
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── next.config.js        # Next.js configuration
└── README.md            # Project documentation
```

## 🎨 Pages Overview

### 1. Home Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Statistics showcase
- How it works section
- CTA for verification

### 2. Verify IC Page (`/verify`)
- Drag-and-drop image upload
- File browser option
- Image preview
- Upload tips and guidelines
- Verification trigger

### 3. Result Page (`/result`)
- Verification status (Verified/Suspicious)
- Confidence score
- IC details (manufacturer, part number, etc.)
- Marking characteristics analysis
- Download/share options
- Recommendations

### 4. Learning Center (`/learning`)
- Educational content
- Authentic vs Counterfeit comparison table
- Warning signs
- Visual examples
- Best practices

### 5. Manufacturer Portal (`/manufacturer`)
- Secure login form
- Dashboard (when logged in)
- Data upload interface
- Recent uploads table
- Statistics and activity

### 6. Analytics Dashboard (`/analytics`)
- Key metrics and KPIs
- Verification trends
- Top manufacturers
- Regional distribution
- Recent alerts
- System health monitoring

## 🎨 Design Features

### Color Palette
- **Primary Blue**: #3b82f6 (Tech/Electronics theme)
- **Dark Navy**: #0f172a (Text and headers)
- **Tech Gray**: #64748b (Secondary text)
- **Light Background**: #f8fafc (Page background)

### Icons
Using Lucide React icons throughout:
- Upload, Camera, Shield (verification)
- CheckCircle, AlertTriangle, XCircle (status)
- BarChart3, TrendingUp (analytics)
- Building2, Lock (manufacturer portal)
- BookOpen, Lightbulb (learning)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Collapsible mobile navigation
- Responsive grids and layouts

## 🔧 Customization

### Adding New Pages
1. Create a new file in `pages/` directory
2. The file name becomes the route (e.g., `about.js` → `/about`)
3. Add navigation link in `components/Layout.js`

### Styling
- Global styles: `styles/globals.css`
- Tailwind utilities: Use className with Tailwind classes
- Custom components: Defined in `@layer components` in globals.css

### Configuration
- Tailwind: `tailwind.config.js`
- Next.js: `next.config.js`

## 🚀 Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 Development Notes

### Mock Data
Currently, the website uses mock/demo data for:
- Verification results
- Analytics statistics
- Manufacturer uploads
- User authentication

### Future Enhancements
To make this production-ready, you'll need to:
1. Implement backend API for image processing
2. Integrate AI/ML model for IC verification
3. Set up database for storing IC data
4. Implement real authentication system
5. Add actual chart libraries (e.g., Chart.js, Recharts)
6. Connect to real manufacturer databases
7. Implement file upload to cloud storage

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS 3.3
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your needs.

---

**Need Help?** Check the README.md or create an issue in the repository.
