  import { useEffect } from 'react';
  import { Route, Routes } from 'react-router-dom';
  import './App.css';
  import Layout from './components/Layout';
  import DashboardPage from './pages/Dashboard';
  import Schedule from './pages/Schedule';
  import Attendance from './pages/Attendance';
  import Feedback from './pages/Feedback';
  import Tasks from './pages/Tasks';
  import Profile from './pages/Profile';
  import { ToastContainer } from 'react-toastify';
  import Signin from './pages/Signin';
  import Signup from './pages/Signup';
  import useUserStore from './store/userStore';
  import PrivateRoute from './components/PrivateRoute';
  import { Overview } from './pages/Overview';
  import { Teachers } from './pages/Teachers';
  import { Students } from './pages/Students';
  import { ManageSchedules } from './pages/ManageSchedules';
  import ReportAbsencePage from './pages/ReportAbsence';

  import  MyClasses  from './pages/MyClasses';
  import Test from './pages/Test';
  import QRScanner from './components/QRScanner';
  import TrackAttendance from './pages/TrackAttendance';

  function App() {
    const fetchUser = useUserStore((state) => state.fetchUser);
    useEffect(() => {
      fetchUser();
    }, []);

    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="attendance" element={<TrackAttendance />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="Tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="reportabsence" element={<ReportAbsencePage />} />



            <Route path="overview" element={<Overview />} />
            <Route path="schedules" element={<ManageSchedules />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="MyClasses" element={<MyClasses />} />
            {/* <Route path="reports" element={<Reports />} /> */}
            {/* <Route path="help" element={<Help />} /> */}
            <Route path="test" element={<TrackAttendance />} />
          </Route>
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          {/* <Route path="test" element={<TrackAttendance />} /> */}
        </Routes>
      </>
    );
  }

  export default App;