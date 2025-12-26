import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { type UserData, type Chat } from "../assets/assets";
import axios, { type AxiosInstance } from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

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
  loadingUser: boolean | null;
  fetchUserChats: () => Promise<void>;
  token: string;
  settoken: React.Dispatch<React.SetStateAction<string>>;
  axios: AxiosInstance;
  createNewChat: () => Promise<string | undefined>;
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
  const [token, settoken] = useState(localStorage.getItem("token") || "");
  const [loadingUser, setloadingUser] = useState<boolean | null>(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setuser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setloadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) {
        return toast("Login to create new user");
      }

      navigate("/");
      await axios.get("/api/chat/create", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchUserChats();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const fetchUserChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setchats(data.chats);
        if (data.chats.length == 0) {
          await createNewChat();
          return fetchUserChats();
        } else {
          setselectedChat(data.chats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
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
    if (token) {
      fetchUser();
    } else {
      setuser(null);
      setloadingUser(null);
    }
    fetchUser();
  }, [token]);

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
    loadingUser,
    fetchUserChats,
    token,
    axios,
    settoken,
    createNewChat,
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
