import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  dummyUserData,
  dummyChats,
  type UserData,
  type Chat,
} from "../assets/assets";

interface AppContextType {
  navigate: ReturnType<typeof useNavigate>;
  user: UserData | null;
  setuser: React.Dispatch<React.SetStateAction<UserData | null>>;
  fetchUser: () => Promise<void>;
  chats: Chat[];
  setchats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setselectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  theme: "light" | "dark";
  settheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setuser] = useState<UserData | null>(null);
  const [chats, setchats] = useState<Chat[]>([]);
  const [selectedChat, setselectedChat] = useState<Chat | null>(null);
  const [theme, settheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  const fetchUser = async () => {
    setuser(dummyUserData);
  };

  const fetchUserChats = async () => {
    setchats(dummyChats);
    setselectedChat(null);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setchats([]);
      setselectedChat(null);
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  const value: AppContextType = {
    navigate,
    user,
    setuser,
    fetchUser,
    chats,
    setchats,
    selectedChat,
    setselectedChat,
    theme,
    settheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }

  return context;
};
