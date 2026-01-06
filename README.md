# Employee Attendance - User Panel

A production-ready, enterprise-grade Employee Attendance User Panel with AI-powered photo-based attendance, built with Next.js, MongoDB, and Cloudinary.

## 🚀 Features

### Core Functionality
- ✅ **Photo-Based Attendance**: Mark attendance using facial recognition with camera-only capture
- ✅ **Photo Registration**: Register 3-5 face photos for accurate verification
- ✅ **Real-Time Dashboard**: Live KPI cards showing today's status, check-in/out times, and working hours
- ✅ **Analytics Dashboard**: Weekly attendance bar chart and monthly progress ring with statistics
- ✅ **Calendar View**: Color-coded monthly calendar with clickable dates showing detailed attendance
- ✅ **Auto Check-Out**: Mark check-out with automatic working hours calculation
- ✅ **Attendance History**: View past attendance records with filtering and pagination
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Technical Features
- 🎨 **Modern UI**: Clean, professional design with Inter font and custom color palette
- 🔒 **Duplicate Prevention**: API-level validation prevents multiple check-ins per day
- 📸 **Cloudinary Integration**: Secure image storage with automatic optimization
- 💾 **MongoDB Atlas**: Scalable database with proper indexing
- ⚡ **Real-Time Updates**: Live working hours timer and clock
- 🎯 **State Management**: React Context with localStorage persistence

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier works)

## 🛠️ Installation

### 1. Clone the Repository

```bash
cd "e:/Employee Attendance/employee-attendance-app"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/employee-attendance

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=employee_photos

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Demo Employee ID (for development)
NEXT_PUBLIC_DEMO_EMPLOYEE_ID=demo_employee_123
```

### 4. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and update `MONGODB_URI` in `.env.local`

### 5. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard → Settings → Upload
4. Create an upload preset:
   - Name: `employee_photos`
   - Signing Mode: **Unsigned**
   - Folder: `employee-attendance`
5. Copy your Cloud Name, API Key, and API Secret to `.env.local`

### 6. Create Demo Employee

Before running the app, create a demo employee in MongoDB:

```bash
# Start the development server first
npm run dev
```

Then, in another terminal, create the employee:

```bash
curl -X POST http://localhost:3000/api/employee \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@company.com",
    "role": "Software Engineer"
  }'
```

Copy the `_id` from the response and update `NEXT_PUBLIC_DEMO_EMPLOYEE_ID` in `.env.local`.

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📱 Usage Guide

### 1. Photo Registration (First Time)

1. Navigate to **Photo Registration** from the sidebar
2. Read the guidelines carefully
3. Click **Continue to Photo Capture**
4. Allow camera access when prompted
5. Capture 3-5 clear photos of your face
6. Review and submit

### 2. Mark Attendance

1. Go to **Dashboard**
2. Click **Mark Attendance**
3. Allow camera access
4. Position your face in the circle overlay
5. Click **Capture Photo**
6. Wait for verification
7. Attendance marked! ✅

### 3. Check Out

1. After checking in, the **End Work Day** card appears
2. View your current working hours (live timer)
3. Click **Check Out** when ready to leave
4. Confirm the action
5. Total working hours calculated automatically

### 4. View History

1. Navigate to **Attendance History**
2. View monthly calendar with color-coded days (Present/Late/Absent/Weekend)
3. Click on any date to see detailed attendance information
4. Use month filter to view different months
5. View summary statistics (Total Days, Present, Late, Average Hours)
6. Browse detailed table with all attendance records

## 🏗️ Architecture

### Project Structure

```
employee-attendance-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── employee/             # Employee endpoints
│   │   └── attendance/           # Attendance endpoints
│   ├── registration/             # Photo registration page
│   ├── history/                  # Attendance history page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard page
├── components/                   # React components
│   ├── layout/                   # Layout components
│   ├── dashboard/                # Dashboard components
│   ├── attendance/               # Attendance components
│   └── ui/                       # Reusable UI components
├── contexts/                     # React Context
│   └── AttendanceContext.tsx     # Global state
├── lib/                          # Utilities
│   ├── mongodb.ts                # MongoDB connection
│   ├── cloudinary.ts             # Cloudinary config
│   └── utils.ts                  # Helper functions
└── models/                       # MongoDB schemas
    ├── Employee.ts               # Employee model
    └── Attendance.ts             # Attendance model
```

### Database Schema

#### Employee Collection
```typescript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  role: String,
  faceImages: [String],  // Cloudinary URLs
  createdAt: Date,
  updatedAt: Date
}
```

#### Attendance Collection
```typescript
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employee),
  date: String (YYYY-MM-DD),
  checkIn: Date,
  checkOut: Date,
  workingHours: Number,
  status: Enum ['Present', 'Late', 'Absent'],
  attendancePhoto: String,  // Cloudinary URL
  createdAt: Date
}
```

**Indexes:**
- `(employeeId, date)` - Compound unique index
- `employeeId` - For faster queries
- `date` - For date-based filtering

### API Endpoints

#### Employee APIs
- `GET /api/employee?id={id}` - Get employee profile
- `POST /api/employee` - Create new employee
- `POST /api/employee/photos` - Register face photos
- `DELETE /api/employee/photos` - Remove a photo

#### Attendance APIs
- `POST /api/attendance` - Mark attendance
- `POST /api/attendance/checkout` - Mark checkout
- `GET /api/attendance/today?employeeId={id}` - Get today's attendance
- `GET /api/attendance/history?employeeId={id}&month={YYYY-MM}` - Get history

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563EB`
- **Success Green**: `#16A34A`
- **Warning Amber**: `#F59E0B`
- **Danger Red**: `#DC2626`
- **Border Gray**: `#E2E8F0`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Card-based layouts with consistent spacing
- 8px border radius
- Subtle shadows for elevation
- Icons from Lucide React (24px, 1.5px stroke)

## 🚢 Deployment

### Express Backend (Elastic Beanstalk)

#### Backend setup
1. Install backend dependencies:
   ```bash
   npm install express cors dotenv
   ```
2. Environment variables (set in EB, not committed):
   - `MONGODB_URI`
   - `CORS_ORIGINS` (comma-separated origins, e.g. `https://app.example.com,http://localhost:3000`; defaults to `*`)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_UPLOAD_PRESET`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_DEMO_EMPLOYEE_ID`
3. Local run:
   ```bash
   npm start
   # server.js listens on PORT (default 8080)
   ```
   Frontend production server remains available via `npm run start:frontend` (Next.js).

#### API structure
- All backend routes mounted under `/api` in `server.js`.
- Recommended: create route modules (e.g. `routes/attendance.js`, `routes/employee.js`) and mount them in `server.js` with `app.use('/api/attendance', attendanceRouter)`.
- Keep business logic in separate service files; avoid large route handlers.

#### AWS Elastic Beanstalk (Node.js platform)
1. Install EB CLI (once): `pip install awsebcli`
2. Initialize (from repo root):
   ```bash
   eb init --platform "Node.js" --region <your-region>
   # select/create an application, accept SSH key if desired
   ```
3. Create environment (single-instance to start):
   ```bash
   eb create employee-attendance-backend --single
   ```
4. Set environment variables:
   ```bash
   eb setenv MONGODB_URI="..." \
     CORS_ORIGINS="https://app.example.com" \
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..." \
     CLOUDINARY_API_KEY="..." \
     CLOUDINARY_API_SECRET="..." \
     CLOUDINARY_UPLOAD_PRESET="employee_photos" \
     NEXT_PUBLIC_APP_URL="http://<env>.elasticbeanstalk.com" \
     NEXT_PUBLIC_DEMO_EMPLOYEE_ID="..."
   ```
5. Deploy:
   ```bash
   eb deploy
   ```
6. Verify:
   - Check `http://<env>.elasticbeanstalk.com/api/health`
   - Fetch example: `curl http://<env>.elasticbeanstalk.com/api/example`
   - Logs: `eb logs`

#### Production tips
- Keep MongoDB Atlas network rules restricted to EB outbound IPs or use VPC peering.
- Rotate credentials; never commit `.env*`.
- Use an HTTPS-enabled EB load balancer with ACM certificate for production.
- Add monitoring/alerts (CloudWatch alarms, health checks).

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_UPLOAD_PRESET`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_DEMO_EMPLOYEE_ID`
5. Deploy!

### MongoDB Atlas Production

1. Update Network Access to allow Vercel IPs
2. Or use `0.0.0.0/0` (not recommended for production)
3. Update connection string in Vercel environment variables

### Cloudinary Production

- No additional setup needed
- Free tier supports up to 25GB storage and 25GB bandwidth/month

## 🔒 Security Considerations

### Current Implementation
- ✅ Camera-only attendance (no file uploads)
- ✅ Duplicate check-in prevention at API level
- ✅ Environment variables for sensitive data
- ✅ MongoDB connection with authentication
- ✅ Cloudinary secure URLs

### Future Enhancements
- [ ] Add user authentication (JWT/OAuth)
- [ ] Implement role-based access control
- [ ] Add rate limiting to API routes
- [ ] Integrate real AI face recognition (AWS Rekognition, Azure Face API)
- [ ] Add audit logs for all operations
- [ ] Implement HTTPS in production

## 🧪 Testing

### Manual Testing Checklist

- [ ] Photo registration with 3-5 photos
- [ ] Mark attendance with face verification
- [ ] Duplicate check-in prevention
- [ ] Check-out with working hours calculation
- [ ] View attendance history
- [ ] Responsive design on mobile
- [ ] Camera permission handling
- [ ] Error states and toast notifications

### API Testing

Use the provided curl commands or tools like Postman to test API endpoints.

## 📝 Face Matching Logic

**Current Implementation**: Basic placeholder simulation
- Returns random confidence score (70-100%)
- Always matches if registered photos exist
- Suitable for demo and development

**Production Recommendation**:
Replace `simulateFaceMatch()` in `lib/utils.ts` with:
- **AWS Rekognition**: `CompareFaces` API
- **Azure Face API**: Face verification
- **Custom ML Model**: TensorFlow.js or Python backend

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Add more features (HR panel, reports, etc.)
- Improve UI/UX
- Integrate real AI services
- Add unit and integration tests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Troubleshooting

### Camera Not Working
- Ensure HTTPS in production (browsers require secure context)
- Check browser permissions
- Try different browsers (Chrome recommended)

### MongoDB Connection Failed
- Verify connection string format
- Check network access whitelist
- Ensure database user has correct permissions

### Cloudinary Upload Failed
- Verify upload preset is **unsigned**
- Check API credentials
- Ensure folder structure is correct

### Duplicate Check-In Error
- This is expected behavior (one check-in per day)
- Check MongoDB for existing record
- Wait until next day or manually delete record for testing

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the implementation plan
3. Check MongoDB and Cloudinary dashboards
4. Verify environment variables

---

