import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {LogOut, Menu, User, X} from "lucide-react";
import {assets} from "../assets/assets.js";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const Navbar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logout successful!");
        navigate("/login");
    }
    return (
        <div className="flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30">
            {/*Left side menu button and title*/}
            <div className="flex items-center gap-5">
                <button
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                    className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors">
                    {openSideMenu ? (
                        <X className="text-2xl" />
                    ): (
                        <Menu className="text-2xl" />
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <img src={assets.logo} alt="logo" className="w-12 h-12" />
                    <span className="text-2xl font-bold text-black truncate">Musify</span>
                </div>
            </div>

            {/*Right side - User info and logout*/}
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4 text-gray-600"/>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-32">
                        {user?.email}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {user?.role}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors duration-200">
                    <LogOut className="w-4 h-4"/>
                    <span className="hidden sm:inline text-sm font-medium">
                        Logout
                    </span>
                </button>
            </div>

            {/*Mobile side menu*/}
            {openSideMenu && (
                <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20">
                    <Sidebar activeMenu={activeMenu}/>
                </div>
            )}
        </div>
    )
}

export default Navbar;