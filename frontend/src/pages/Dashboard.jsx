import React,{useState, useEffect} from 'react'
import Calendar from '../components/Calendar'
import ScheduleList from '../components/ScheduleList'
import Greetcard from '../components/Greetcard'
import CurrentClass from '../components/CurrentClass'
import StatCard from '../components/StatCard'
import { BsFileBarGraphFill } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { BsCalendar2DateFill } from "react-icons/bs";

const Dashboard = () => {

  const [stats, setStats] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const fetchData = async () => {
      try{
       const res = await fetch("http://localhost:5000/api/dashboard");  ////backend server address
      const data = await res.json();
      setStats(data.stats);
      setCurrentClass(data.currentClass);
      setStats(data.username || "User");
      }
      catch(err){
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='overflow-x-hidden p-4 space-y-6 m-2'>

 <div className="p-4 flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-2/3 flex flex-col gap-6 ">
        <Greetcard username={username}/>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard 
        title="Attendance" 
        value="85%" 
        subtext="Updated today" 
        icon={<BsFileBarGraphFill />} 
      />
      <StatCard 
        title="Tasks" 
        value="12" 
        subtext="Due this week" 
        icon={<SiGoogletasks />} 
      />
      <StatCard 
        title="Feedback" 
        value="5" 
        subtext="New responses" 
        icon={<VscFeedback/>} 
      />
      <StatCard 
        title="Events" 
        value="3" 
        subtext="Upcoming" 
        icon={<BsCalendar2DateFill />}
      />
    </div>
      </div>

      <div className="w-full md:w-1/3">
        <Calendar />
      </div>
    </div>



      <div className=" p-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
        <ScheduleList/>
        </div>
        <div className="w-full md:w-1/3">

        <CurrentClass
  subject={currentClass?.subject || "No subject"}
  time={currentClass?.time || "00:00 - 00:00"}
  location={currentClass?.location || "Not assigned"}
  teacher={currentClass?.teacher || "TBA"}
  progress={currentClass?.progress || 0}
  remaining={currentClass?.remaining || 0}
    />

        </div>
     </div>
    </div>  
  )
}

export default Dashboard






