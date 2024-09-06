import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TLoginStore } from "@/lib/model";
import useGlobalStore from "@/stores/useGlobalStore";
import useLoginStore from "@/stores/useLoginStore";
import { Navigate } from "react-router-dom";

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
    onSubmit,
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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-1 h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center mt-[15%] flex-col">
        <span className="text-2xl font-bold">Sign In</span>
        <span className="text-md">Enter your email address and password</span>
        <div className="w-2/5 flex gap-5 flex-col mt-5">
          <Input
            placeholder="Email"
            onChange={setEmail}
            value={email}
            error={emailError}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPassword}
            error={passwordError}
          />

          <div className="flex items-center justify-center flex-col">
            {serverError && (
              <span className="p-2 text-red-500">{serverError}</span>
            )}
            <Button isLoading={isLoading} onClick={onSubmit}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
