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
  headers: Record<string, string>;
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
  isLoading: boolean;
  data: TProjects[];
  headers: any[];
  search: string;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSearch: (search: string) => void;
  clearSearch: () => void;
  getAllProjects: (page?: number) => Promise<void>;
  // ... other methods
} & TLoadingState;

export type TCustomerStore = {
  search: string;
  headers: Record<string, string>[];
  data: TCustomer[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSearch: (search: string) => void;
  getAllCustomers: () => void;
} & TLoadingState;

export type TSOWStore = {
  isLoading: boolean;
  headers: Record<string, string>[];
  data: TSOW[];
  search: string;
  currentPage: number;
  totalPages: number;
  setLoading: (isLoading: boolean) => void;
  setSearch: (search: string) => void;
  clearSearch: () => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  getAllSOW: (page: number) => Promise<void>;
} & TLoadingState;

export type TCustomer = {
  customer_id: string;
  customer_name: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_designation: string;
  email_id: string;
  contact_phone: string;
  contract_type: string;
  contract_start_date: string;
  msa_location: string;
  address : string,
};

export type TSOW = {
  sow_id: number;
  customer: number | string;
  customer_name: string;
  sow_description: string;
  sow_value: string;
  start_date: string;
  end_date?: string;
  customer_spoc: string;
  reveal_spoc: string;
  business_unit: string;
  duration: number | null;
  contract_url?: string;
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
  headers: Array<{ key: string; label: string }>;
  rows: T[];
  onClick?: (data: T) => void;
};

export type TAppHeader = {
  header: string;
  desc?: string;
  id: string;
};

export type TResourceAllocation = {
  id: number;
  employee: number;
  employee_name: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;
  bandwidth_allocated: string;
  // ... (any other fields)
};

export type TEmployeeStore = {
  getAllEmployees: () => void;
  getEmployeeTimeline: (employeeId: number) => Promise<TimelineItem[]>;
  data: TEmployee[];
  search: string;
  setSearch: (search: string) => void;
  headers: Record<string, string>[];
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
  bandwidth_available: string;
};

export interface SupersetDashboardProps {
  supersetUrl: string;
  dashboardId: string;
  username: string;
  password: string;
  guestUsername: string;
  guestFirstName: string;
  guestLastName: string;
  dashboardTitle: string;
}

export interface TimelineItem {
  id: number;
  project_id: number;
  project_name: string;
  role: string;
  allocation_start_date: string | null;
  allocation_end_date: string | null;
  bandwidth_allocated: string;
  billable: string;
}

export type TSOWDetailsStore = {
  isLoading: boolean;
  id: string;
  setId: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  data: TSOW;
  getSOWDetails: () => Promise<void>;
};

export type TCustomerDetailsStore = {
  isLoading: boolean;
  id: string;
  setId: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  data: TCustomer;
  getCustomerDetails: () => Promise<void>;
};
