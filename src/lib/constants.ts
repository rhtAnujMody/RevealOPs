export default {
  API_URL: "http://ec2-3-110-55-32.ap-south-1.compute.amazonaws.com/",
  // API_URL: "https://reveal-ops-prod-339068582.ap-south-1.elb.amazonaws.com/",
  TOKEN: "token",
  REFRESH: "refresh",
  IS_AUTHENTICATED: "isAuthenticated",
  //apis
  ALL_PROJECTS: "api/projects/",
  ALL_CUSTOMERS: "api/customers/",
  ALL_EMPLOYEES: "api/employees/",
  ALL_SOWS: "api/sows/",
  EMPLOYEE_TIMELINE: "api/employees/{employee_id}/timeline/",
  UPDATE_EMPLOYEE_TIMELINE: "api/employees/{employee_id}/projects/{project_id}/timeline/{allocation_id}/",
  CREATE_RESOURCE_ALLOCATION : "api/projects/{project_pk}/allocations/",
  DELETE_EMPLOYEE_TIMELINE: 'api/employees/{employee_id}/projects/{project_id}/timeline/{allocation_id}/',
  DELETE_PROJECT_ALLOCATION: 'api/projects/{project_id}/allocations/{allocation_id}/',
  UPDATE_PROJECT_ALLOCATION: '/api/projects/{project_id}/allocations/{allocation_id}/',
};
