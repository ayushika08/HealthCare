# HealthCare Website

A comprehensive health and wellness platform built with modern web technologies. The HealthCare website provides users with essential tools to manage their personal health journey through BMI calculations, personalized diet plans, exercise routines, and community feedback.

## 🌟 Features

### 🏠 **Home Page**

- Welcoming introduction to the platform
- Overview of all available tools
- Clear navigation and call-to-action buttons
- Quick start guide for new users

### 📊 **BMI Calculator**

- Calculate Body Mass Index with height and weight inputs
- Support for metric (cm, kg) and imperial (ft/in, lbs) units
- Instant results with BMI category classification
- Health advice based on BMI category
- Data persistence for personalized experience

### 🥗 **Personalized Diet Plans**

- Custom meal plans based on BMI and health goals
- Multiple goal options: Weight Loss, Muscle Gain, Maintain Weight
- Activity level consideration for accurate recommendations
- Detailed meal breakdowns (Breakfast, Lunch, Dinner, Snacks)
- Evidence-based nutrition tips and guidelines

### 💪 **Exercise Plans**

- Goal-oriented workout routines
- Fitness levels: Beginner, Intermediate, Advanced
- Multiple objectives: Fat Loss, Build Strength, Improve Endurance
- Weekly schedule with detailed exercise instructions
- Sets, reps, and rest period guidance

### 💬 **Community Feedback**

- User experience sharing platform
- Star ratings and categorized feedback types
- Anonymous or named feedback options
- Community stories to inspire others
- Public display with moderation system

## 🛠 **Technology Stack**

### Frontend

- **HTML5** - Semantic markup and accessibility
- **CSS3** - Modern responsive design with Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality and API integration
- **Local Storage** - Client-side data persistence

### Backend

- **Node.js** - Server runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database for data storage
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Database Schema

- **bmi_calculations** - BMI calculation history
- **diet_plans** - Generated diet plans
- **exercise_plans** - Created exercise routines
- **feedback** - User feedback and community stories

## 🚀 **Quick Start**

### Prerequisites

- Node.js 14.0.0 or higher
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**

   ```bash
   git clone <repository-url>
   cd healthcare-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The database will be automatically created on first run

### Development Mode

For development with auto-restart on file changes:

```bash
npm run dev
```

## 📱 **Usage Guide**

### 1. **Calculate Your BMI**

- Navigate to the BMI Calculator page
- Enter your height and weight
- Choose appropriate units (metric/imperial)
- View your BMI result and health category
- Get personalized health advice

### 2. **Get a Diet Plan**

- Visit the Diet Plan page
- Enter your BMI (auto-populated if just calculated)
- Select your health goal and activity level
- Receive a customized meal plan with tips

### 3. **Create Exercise Routine**

- Go to the Exercise page
- Choose your fitness goal and current level
- Select available time per workout
- Get a detailed weekly exercise schedule

### 4. **Share Your Experience**

- Visit the Feedback page
- Rate your experience and share your story
- Read inspiring stories from other users
- Optionally allow public display to help others

## 🔗 **API Endpoints**

### Health Check

- `GET /api/health` - Server health status

### BMI Operations

- `POST /api/bmi/calculate` - Save BMI calculation
- `GET /api/bmi/recent` - Get recent BMI data

### Plans

- `POST /api/diet/generate` - Save diet plan
- `POST /api/exercise/generate` - Save exercise plan

### Feedback

- `POST /api/feedback/submit` - Submit user feedback
- `GET /api/feedback/public` - Get public feedback

### Analytics

- `GET /api/analytics/stats` - Get usage statistics

## 📊 **Project Structure**

```
healthcare-website/
├── public/                 # Frontend files
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   ├── main.js        # Shared functionality
│   │   ├── bmi.js         # BMI calculator logic
│   │   ├── diet.js        # Diet plan generator
│   │   ├── exercise.js    # Exercise plan logic
│   │   └── feedback.js    # Feedback system
│   ├── index.html         # Home page
│   ├── bmi.html          # BMI calculator page
│   ├── diet.html         # Diet plan page
│   ├── exercise.html     # Exercise plan page
│   └── feedback.html     # Feedback page
├── server/
│   └── index.js          # Express server
├── database/
│   └── healthcare.db     # SQLite database (auto-created)
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🎨 **Design Features**

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Accessibility** - Semantic HTML and keyboard navigation support
- **Progressive Enhancement** - Works without JavaScript for basic functionality
- **Print-Friendly** - Optimized print styles for diet and exercise plans

## 🔒 **Security & Privacy**

- Client-side validation with server-side verification
- SQL injection prevention with prepared statements
- Input sanitization and validation
- Optional anonymous feedback
- IP address logging for abuse prevention
- No sensitive personal data storage

## 🌐 **Browser Support**

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📈 **Future Enhancements**

- Mobile app development
- Recipe integration with diet plans
- Progress tracking and charts
- Social features and user accounts
- Integration with fitness trackers
- Nutritionist and trainer consultations
- Meal planning calendar
- Shopping list generation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 **Support**

For support, feature requests, or bug reports, please use the feedback system within the application or create an issue in the repository.

---

**Built with ❤️ for your health journey**
