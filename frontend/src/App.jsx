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
import { ReportAbsence } from './pages/ReportAbsence';
import { MyClasses } from './pages/MyClasses';

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
          <Route path="attendance" element={<Attendance />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="Tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reportabsence" element={<ReportAbsence />} />
          <Route path="overview" element={<Overview />} />
          <Route path="schedules" element={<ManageSchedules />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="MyClasses" element={<MyClasses />} />
          {/* <Route path="reports" element={<Reports />} /> */}
          {/* <Route path="help" element={<Help />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;