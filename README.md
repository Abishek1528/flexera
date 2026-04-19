# 📚 ShikshaPulse - ASER Education Analytics Dashboard

A complete web application to help District Education Officers (DEOs) identify high-risk schools and take action based on ASER data.

## 🚀 Features

- **Smart Priority Action Queue**: Rule-based ranking of schools using priority scoring
- **Interactive Priority List**: Top 20 high-risk schools with dynamic filtering
- **School Details Panel**: Complete performance breakdown, weak areas, and recommendations
- **Performance Trend Charts**: Visual comparison across years
- **Intervention Tracker**: Add and track interventions for each school
- **Weak Area Detection**: Automatic identification of critical issues

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Recharts (visualizations)

### Backend
- Node.js
- Express
- In-memory data store (with JSON file for initial data)

## 📁 Project Structure

```
f:\flexera/
├── README.md
├── backend/
│   ├── .env.example                   # Environment variables template
│   ├── package.json
│   └── src/
│       ├── data/
│       │   └── sampleData.json       # ASER data
│       ├── models/
│       │   └── SchoolData.js         # Data logic and business rules
│       ├── routes/
│       │   └── schools.js            # API routes
│       └── server.js                  # Express server
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                    # Main app component
        ├── main.jsx                   # React entry point
        ├── components/
        │   ├── Filters.jsx           # State/Year filters
        │   ├── PriorityList.jsx      # Priority schools table
        │   └── SchoolDetails.jsx     # School details panel
        ├── pages/
        │   ├── Dashboard.jsx         # Dashboard page
        │   ├── HeatMap.jsx           # Heat map visualization
        │   └── SchoolDetail.jsx      # School detail page
        ├── services/
        │   └── api.js                # API service
        └── Styles/
            ├── App.css
            ├── Dashboard.css
            ├── HeatMap.css
            ├── Prioritylist.css
            ├── Schooldetail.css
            └── Schooldetails.css
```

## 🎯 Priority Scoring Formula

```
Priority Score = 
  (100 - Reading Score) + 
  (100 - Math Score) + 
  (20 if no improvement for 2+ years)
```

## 🔧 Setup Instructions

### 1. Backend Setup

Open a terminal (Terminal 1):

```powershell
cd backend
npm install
npm start
```

Backend will run on **http://localhost:5000**

### 2. Frontend Setup

Open another terminal (Terminal 2):

```powershell
cd frontend
npm install
npm run dev
```

Frontend will run on **http://localhost:3000**

## 📊 Data Configuration

### Current Setup (In-Memory + JSON)
By default, the app uses:
- `backend/src/data/sampleData.json` - Sample ASER data
- In-memory storage for interventions

### To Use MongoDB (Optional)

If you want to use MongoDB instead of in-memory storage:

1. Install MongoDB locally or use MongoDB Atlas
2. Create `.env` file in `backend/`:
   ```
   MONGODB_URI=mongodb://localhost:27017/shikshapulse
   PORT=5000
   ```
3. Modify `backend/src/models/SchoolData.js` to use Mongoose

## 🎨 Key UI Components

1. **Filters**: Filter by State and Year
2. **Priority List**: Shows top 20 schools with risk indicators
3. **School Details**: 
   - Performance breakdown (Reading/Math levels)
   - Weak areas detection
   - Recommendations
   - Trend chart
   - Intervention tracker

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools/states` | Get unique states |
| GET | `/api/schools/years` | Get unique years |
| GET | `/api/schools/priority` | Get priority schools (with filters) |
| GET | `/api/schools/:schoolId/weak-areas` | Get weak areas for school |
| GET | `/api/schools/:schoolId/recommendations` | Get recommendations |
| GET | `/api/schools/:schoolId/history` | Get school history |
| GET | `/api/schools/:schoolId/interventions` | Get interventions |
| POST | `/api/schools/interventions` | Add new intervention |

## 💡 Usage

1. Open **http://localhost:3000** in your browser
2. Use filters (State/Year) to narrow down schools
3. Click on any school from the Priority List
4. View details, add interventions, and track progress

## 🎯 What You Need to Configure

Here are the positions you need to set up:

| File | What to Configure |
|------|------------------|
| `backend/.env` | (Optional) MongoDB connection string |
| `backend/src/data/sampleData.json` | Replace with your actual ASER data |
| `frontend/src/services/api.js` | Update `API_BASE_URL` if backend runs on different port |

## 📦 Dependencies

Make sure you have installed:
- Node.js (v16 or higher)
- npm or yarn

## 🚀 Quick Start

```powershell
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```
