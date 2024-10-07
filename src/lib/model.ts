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

export type TCustomerStore = {
  search: string;
  headers: Record<string, string>[];
  data: TCustomer[];
  setSearch: (search: string) => void;
  getAllCustomers: () => void;
} & TLoadingState;

export type TSOWStore = {
  search: string;
  headers: Record<string, string>[];
  data: TSOW[];
  setSearch: (search: string) => void;
  getAllSOW: () => void;
} & TLoadingState;

export type TCustomer = {
  customer_id: number;
  created_at: string;
  updated_at: string;
  customer_name: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_designation: string;
  address: string;
  email_id: string;
  contact_phone: string;
  contract_type: string;
  contract_start_date: string;
  contract_end_date: string;
  msa_location: string;
};

export type TSOW = {
  sow_id: number;
  customer_name: string;
  duration?: number;
  created_at: string;
  updated_at: string;
  sow_description: string;
  start_date: string;
  end_date: string;
  sow_value: string;
  business_unit: string;
  customer_spoc: string;
  reveal_spoc: string;
  customer: number;
};

export type TProjectDetailsStore = {
  id: string;
  resourceAllocationHeaders: Record<string, string>[];
  resourceAllocationLoading: boolean;
  setResourceAllocationLoading: (resourceAllocationLoading: boolean) => void;
  setId: (id: string) => void;
  getProjectDetails: () => void;
  getProjectAllocationDetails: () => void;
  data: TProjects;
  resources: TResourceAllocation[];
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
};

export type TResourceAllocation = {
  id: number;
  employee_name: string;
  next_available_date?: string;
  next_availability: number;
  bandwidth_available: number;
  created_at: string;
  updated_at: string;
  role: string;
  allocation_start_date: string;
  allocation_end_date?: string;
  billable: string;
  bandwidth_allocated: number;
  employee: number;
  project: number;
};

export type TEmployeeStore = {
  getAllEmployees: () => void;
  data: TEmployee[];
} & TLoadingState;

export type TEmployee = {
  id: number;
  created_at: string;
  updated_at: string;
  employee_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  employee_type: string;
  business_unit: string;
  location: string;
  joining_date: string;
  designation: string;
  team: string;
  status: string;
  job_level: string;
  active_status: string;
  reporting_to: number;
  projects: number[];
};
