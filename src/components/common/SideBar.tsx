import { NavLink } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import { cn } from "@/lib/utils";

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
      link: "/project-allocation",
      header: "Project Allocation",
    },
    {
      link: "/employee-management",
      header: "Employee Management",
    },
  ];

  return (
    <div className="flex flex-1  flex-col">
      <div className="pt-6 pl-6 ">
        <img src={logo} className="h-10" />
      </div>
      <div className="mt-10 ml-6">
        <ul>
          {links.map((link) => (
            <li key={link.header}>
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  cn(
                    "flex py-4 px-2 text-lg font-medium",
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
    </div>
  );
}
