import React from 'react'

const Dashboard = () => {
  const dark=false;
  return (
    <div className={`${dark ? 'bg-black text-white':''} overflow-x-hidden h-screen`}>
      dashboard
    </div>
  )
}

export default Dashboard