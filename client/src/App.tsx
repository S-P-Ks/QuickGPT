import "./App.css";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { useState } from "react";
import { assets } from "./assets/assets";
import Loading from "./pages/Loading";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";

function App() {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const { user } = useAppContext();

  if (pathname === "/loading") {
    return <Loading />;
  }

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          alt=""
          onClick={() => setisMenuOpen(true)}
        />
      )}

      {user ? (
        <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setisMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
}

export default App;
