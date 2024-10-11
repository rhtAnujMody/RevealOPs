export default {
  API_URL: "http://ec2-65-2-84-82.ap-south-1.compute.amazonaws.com/",
  // API_URL:"http://ec2-52-66-181-232.ap-south-1.compute.amazonaws.com/",
  TOKEN: "token",
  REFRESH: "refresh",
  IS_AUTHENTICATED: "isAuthenticated",
  //apis
  ALL_PROJECTS: "api/projects/",
  ALL_CUSTOMERS: "api/customers/",
  ALL_EMPLOYEES: "api/employees/",
  ALL_SOWS: "api/sows/",
  EMPLOYEE_TIMELINE: "api/employees/{employee_id}/timeline/",
  UPDATE_EMPLOYEE_TIMELINE: "api/employees/{employee_id}/projects/{project_id}/timeline/",
  CREATE_RESOURCE_ALLOCATION : "api/projects/{project_pk}/allocations/",
};
