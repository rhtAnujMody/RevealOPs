// Define the type for the navigation function
export type TNavigationFunction = (
  route: string,
  options: { replace: boolean }
) => void;

// Define the store's state and actions
export type TNavigationStore = {
  navigationFunction: TNavigationFunction | null;
  setNavigationFunction: (navFunction: TNavigationFunction) => void;
  navigate: (route: string, replace?: boolean) => void;
};

export type TGlobal = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

type TLoadingState = {
  isLoading: boolean;
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  serverError: string;
  setLoading: (isLoading: boolean) => void;
  setEmail: (email: React.ChangeEvent<HTMLInputElement>) => void;
  setPassword: (password: React.ChangeEvent<HTMLInputElement>) => void;
  setEmailError: (emailError: string) => void;
  setPasswordError: (passwordError: string) => void;
  setServerError: (serverError: string) => void;
  onSubmit: () => void;
};

export interface TLogin {
  message: string;
  refresh: string;
  access: string;
}

//API
export type TFetchResponse<T> = {
  data?: T;
  status: number;
  ok: boolean;
  error?: Record<string, string>;
};
export type TFetchError = {
  message: Record<string, string>;
  status?: number;
};

export type TLoginStore = {} & TLoadingState;
