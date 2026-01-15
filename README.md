# Habit Tracker

A beautiful, minimalist habit tracking application built with Next.js. Track your daily habits, visualize your progress, and build lasting routines with a distraction-free, local-first experience.

## ✨ Features

### 📊 Multiple Views
- **Today View**: Focus on today's habits with a beautiful donut chart visualization showing your daily progress
- **Weekly View**: Track your habits across the entire week with an intuitive weekly grid
- **Monthly View**: Coming soon

### 📈 Statistics & Insights
- **Daily Progress**: Visual donut chart showing completion percentage for today's goals
- **Streak Tracking**: Track your current streak to stay motivated
- **Progress Graphs**: View your habit completion trends over the week or last 30 days
- **Performance Analytics**: Comprehensive statistics page with interactive charts

### 🎨 Customization
- **Custom Habit Colors**: Each habit gets a unique color for easy visual identification
- **Custom Icons**: Add emojis to personalize your habits
- **Flexible Scheduling**: Set habits as daily or customize specific days of the week
- **Theme Support**: Light, Dark, and System themes with smooth transitions

### 🔒 Privacy-First
- **Local Storage**: All data is stored locally in your browser
- **No Account Required**: Start tracking immediately without sign-up
- **Offline Support**: Works completely offline
- **Data Control**: Export or clear your data anytime

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persist middleware
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Type Safety**: TypeScript

## 📱 Key Pages

### Home (`/`)
The main dashboard where you can:
- View today's habits and mark them complete
- See your daily progress with visual charts
- Switch between Today, Weekly, and Monthly views
- Track weekly habit completion patterns

### Add Habit (`/add-habit`)
Create new habits with:
- Custom habit names
- Icon/emoji selection
- Color customization
- Frequency settings (daily or specific days)
- Optional reminder times

### Habits (`/habits`)
Manage all your habits:
- View complete list of all habits
- Edit existing habits
- Delete habits
- See habit details and settings

### Statistics (`/statistics`)
Track your progress with:
- Daily completion percentage
- Current streak counter
- Weekly and monthly progress graphs
- Visual trend analysis

### Settings (`/settings`)
Customize your experience:
- Theme selection (Light/Dark/System)
- Data management (clear all data)
- App information

## 🎯 Usage

### Creating a Habit
1. Tap the "+" button in the bottom navigation
2. Enter a habit name
3. Choose an icon and color (optional)
4. Set the frequency (daily or specific days)
5. Add a reminder time (optional)
6. Tap "Add Habit"

### Completing a Habit
1. On the home screen, tap the checkbox next to any habit
2. The habit will be marked as complete for today
3. Watch your progress chart update in real-time

### Viewing Statistics
1. Navigate to the Statistics page via bottom navigation
2. View your daily completion percentage
3. Check your current streak
4. Toggle between weekly and monthly graphs

### Changing Theme
1. Go to Settings
2. Select your preferred theme: Light, Dark, or System
3. The theme changes immediately

## 💾 Data Storage

All data is stored locally using `localStorage` with the key `habit-tracker-v1`. Your data includes:
- Habits list with all configurations
- Completion logs for each day
- User settings and preferences

## 🎨 Color Palette

The app uses a carefully curated set of colors for habit visualization, including:
- Vibrant reds, pinks, and corals
- Calming blues and teals
- Energetic oranges and yellows
- Natural greens
- Creative purples

## 🔄 Future Enhancements

- Monthly calendar view
- Export/import data functionality
- Habit categories and tags
- Custom week start day settings
- Push notifications for reminders
- Habit notes and journal entries
- Achievement badges
- Advanced analytics and insights

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for performance, accessibility, and user experience.
