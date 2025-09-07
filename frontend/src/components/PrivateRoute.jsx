import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUserStore();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let timer;
    if (loading) {
      setShowLoader(true);
    } else {
      timer = setTimeout(() => setShowLoader(false), 1000);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  if (showLoader) {
    return (
      <div className="flex justify-center items-center mt-[60%] md:mt-[16%]">
        <ClimbingBoxLoader 
          color="#2C3E86"
          loading={true}
          size={12}
          speedMultiplier={1.5} 
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;