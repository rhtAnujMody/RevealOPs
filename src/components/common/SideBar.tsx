import { cn, logoutUser } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import { LogOut } from "lucide-react";

export default function SideBar() {
  const links = [
    {
      link: "/dashboard",
      header: "Dashboard",
    },
    {
      link: "/customer-management",
      header: "Customer Management",
    },
    {
      link: "/sow-management",
      header: "SOW Management",
    },
    {
      link: "/project-management",
      header: "Project Management",
    },
    {
      link: "/employee-management",
      header: "Employee Management",
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      <div className="pt-6 pl-5 ">
        <img src={logo} className="h-10" />
      </div>
      <div className="flex flex-col flex-1">
        <div className="mt-10 ml-5 mr-5 flex basis-[90%] ">
          <ul className="rounded-lg">
            {links.map((link) => (
              <li key={link.header}>
                <NavLink
                  to={link.link}
                  className={({ isActive }) =>
                    cn(
                      "flex py-4 px-2 text-md font-medium rounded-lg",
                      isActive && "bg-[#F0F2F5]"
                    )
                  }
                >
                  {link.header}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="flex flex-1 items-center ml-5 gap-3 cursor-pointer"
          onClick={logoutUser}
        >
          <LogOut />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
