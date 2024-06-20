import React, { useEffect, useState } from 'react';

const ErrorMessage = ({ message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(false);
      setTimeout(() => {
        setShow(true);
      }, 0); 
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 p-4 w-11/12 max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
    >
      <div className="text-center text-red-600">
        {message}
      </div>
    </div>
  );
};

export default ErrorMessage;
