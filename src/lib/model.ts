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
  setLoading: (isLoading: boolean) => void;
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

export type TLoginStore = {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  serverError: string;
  setEmail: (email: React.ChangeEvent<HTMLInputElement>) => void;
  setPassword: (password: React.ChangeEvent<HTMLInputElement>) => void;
  setEmailError: (emailError: string) => void;
  setPasswordError: (passwordError: string) => void;
  setServerError: (serverError: string) => void;
  onSubmit: () => void;
} & TLoadingState;

export type TProjectStore = {
  search: string;
  headers: Record<string, string>[];
  data: TProjects[];
  setSearch: (search: string) => void;
  getAllProjects: () => void;
} & TLoadingState;

export type TProjectDetailsStore = {
  id: string;
  setId: (id: string) => void;
  getProjectDetails: () => void;
  data: TProjects;
} & TLoadingState;

export type TProjects = {
  id: number;
  customer_name: string;
  master_project_id: string;
  child_project_id: string;
  project_name: string;
  description: string;
  project_type: string;
  service_offering: string;
  project_status: string;
  customer: number;
  sow: number;
};

export type TAppTable<T> = {
  headers: Record<string, string>[];
  rows: T[];
  onClick?: (data: T) => void;
  onEditClick?: (data: T) => void;
};

export type TAppHeader = {
  header: string;
  desc?: string;
  id?:string;
};
