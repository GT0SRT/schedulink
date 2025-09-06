import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import DashboardPage from './pages/Dashboard'
import Schedule from './pages/Schedule';
import Attendance from './pages/Attendance';
import { Feedback } from './pages/Feedback';
// import Tasks from './pages/Tasks';
import Tasks from './pages/Tasks';


import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<><Layout /></>}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="Tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
