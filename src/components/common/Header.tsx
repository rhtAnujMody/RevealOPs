import logo from "../../assets/Logo.svg";

export default function Header() {
  return (
    <div className="flex h-20 bg-white p-5 border-b">
      <img src={logo} />
    </div>
  );
}
