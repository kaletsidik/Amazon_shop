import axios from "axios";
const axiosInstance = axios.create({
  // baseURL:"http://127.0.0.1:5001/clone-3f208/us-central1/app"
  baseURL: "https://amazon-api-deploy-uc8c.onrender.com/",
});
export { axiosInstance };
