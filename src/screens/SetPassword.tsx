import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from "lucide-react";
import { apiRequest } from "@/network/apis";
import toast from "react-hot-toast";
import logo from "@/assets/Logo.svg";
import { cn } from "@/lib/utils";

function SetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
  });

  const checkPasswordStrength = (pass: string) => {
    setPasswordStrength({
      length: pass.length >= 8,
      number: /\d/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      uppercase: /[A-Z]/.test(pass),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest(
        "api/set-password/",
        "POST",
        {
          email,
          password,
          confirm_password: confirmPassword,
        }
      );

      if (response.ok) {
        toast.success("Password set successfully");
        navigate("/", { replace: true });
      } else {
        setError(response.error?.message || "Failed to set password");
      }
    } catch (error) {
      console.error("Error setting password:", error);
      setError("An error occurred while setting the password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <img 
              className="h-12 w-auto mx-auto mb-6 transform hover:scale-105 transition-transform duration-200" 
              src={logo} 
              alt="Reveal Logo" 
            />
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
              Set Your Password
            </h2>
            <p className="text-sm text-gray-600">
              Please set a secure password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className="pl-10 pr-10 border-gray-200 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Password requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(passwordStrength).map(([key, isValid]) => (
                    <div 
                      key={key}
                      className={cn(
                        "flex items-center text-sm",
                        isValid ? "text-green-600" : "text-gray-500"
                      )}
                    >
                      {isValid ? (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      {key === 'length' && '8+ characters'}
                      {key === 'number' && 'Number'}
                      {key === 'special' && 'Special character'}
                      {key === 'uppercase' && 'Uppercase letter'}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "pl-10 pr-10 border-gray-200 focus:ring-primary focus:border-primary transition-all duration-200",
                      confirmPassword && password !== confirmPassword && "border-red-300 focus:ring-red-500 focus:border-red-500"
                    )}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 animate-shake">
                <div className="flex">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className={cn(
                "w-full transition-all duration-200",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Setting password...
                </div>
              ) : (
                "Set Password"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-primary/90 to-blue-600/90">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white space-y-6 max-w-2xl">
            <h3 className="text-4xl font-bold">Welcome to Our Platform</h3>
            <p className="text-lg text-white/80">
              Set up your secure password to start managing your projects and resources efficiently.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">Secure Access</h4>
                <p className="text-sm text-white/70">Your data is protected with enterprise-grade security</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">Easy Management</h4>
                <p className="text-sm text-white/70">Streamlined interface for efficient project handling</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">Real-time Updates</h4>
                <p className="text-sm text-white/70">Stay informed with instant notifications</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">Team Collaboration</h4>
                <p className="text-sm text-white/70">Work together seamlessly with your team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetPassword; 