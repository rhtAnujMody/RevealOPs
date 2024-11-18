import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TLoginStore } from "@/lib/model";
import useGlobalStore from "@/stores/useGlobalStore";
import useLoginStore from "@/stores/useLoginStore";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/Logo.svg";
import { apiRequest } from "@/network/apis";

function Login() {
  const isAuthenticated = useGlobalStore((state) => state.isAuthenticated);
  const {
    isLoading,
    email,
    password,
    emailError,
    passwordError,
    serverError,
    setEmail,
    setPassword,
    onSubmit: originalOnSubmit,
  } = useLoginStore((state: TLoginStore) => ({
    isLoading: state.isLoading,
    email: state.email,
    password: state.password,
    setLoading: state.setLoading,
    setEmail: state.setEmail,
    setPassword: state.setPassword,
    emailError: state.emailError,
    passwordError: state.passwordError,
    serverError: state.serverError,
    onSubmit: state.onSubmit,
  }));

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest<{ message: string }>(
        "api/login/",
        "POST",
        {
          email,
          password,
        }
      );

      if (response.ok) {
        if (response.data?.message === "Please set your password first") {
          navigate("/set-password", { state: { email } });
        } else {
          await originalOnSubmit();
        }
      } else {
        if (response.error?.error) {
          useLoginStore.setState({ serverError: response.error.error });
        } else if (typeof response.error === 'string') {
          useLoginStore.setState({ serverError: response.error });
        } else {
          useLoginStore.setState({ 
            serverError: "An error occurred during login" 
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      useLoginStore.setState({ 
        serverError: "An unexpected error occurred. Please try again." 
      });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // @ts-ignore
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setEmail(e.target.value);
  };

  // @ts-ignore
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setPassword(e.target.value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img className="h-12 w-auto" src={logo} alt="Reveal Logo" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="you@example.com"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="pl-10 pr-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                  {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
                </div>

                {serverError && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{serverError}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
    </div>
  );
}

export default Login;
