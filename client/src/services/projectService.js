import API from "./api";

export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);
export const getProjectsProgress = () => API.get("/projects/progress");
export const getProjectTaskSummary = (projectId) =>
  API.get(`/projects/${projectId}/summary`);