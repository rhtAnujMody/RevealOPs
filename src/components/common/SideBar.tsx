import { cn, logoutUser } from "@/lib/utils";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import {
  LogOut,
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  BookUser,
  Airplay,
  ShieldCheck
} from "lucide-react";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const links = [
    {
      link: "/dashboard",
      header: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      link: "/customers",
      header: "Customers",
      icon: Users,
    },
    {
      link: "/sows",
      header: "SOWs",
      icon: FileText,
    },
    {
      link: "/projects",
      header: "Projects",
      icon: Briefcase,
    },
    {
      link: "/employees",
      header: "Employees",
      icon: BookUser,
    },
    {
      link: "/recruitment",
      header: "Recruitment",
      icon: Airplay,
    },
    {
      link: "/compliances",
      header: "Compliances",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white shadow-lg w-full">
      <div className="p-6 border-b border-gray-200">
        <img
          src={logo}
          className="h-10 cursor-pointer"
          onClick={handleLogoClick}
          alt="Logo"
        />
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.header}>
              <NavLink
                to={link.link}
                className={({ isActive: linkIsActive }) =>
                  cn(
                    "flex items-center py-2 px-6 transition-colors duration-150",
                    isActive(link.link)
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )
                }
              >
                <link.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{link.header}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logoutUser}
          className="flex items-center w-full px-6 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-150 rounded-lg"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
