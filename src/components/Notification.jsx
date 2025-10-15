import { useState, useEffect } from "react";

const Notification = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-500 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
      } ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      {message}
      <button onClick={onClose} className="ml-2 font-bold">×</button>
    </div>
  );
};

export default Notification;
