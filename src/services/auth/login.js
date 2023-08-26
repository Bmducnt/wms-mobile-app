import axios from "axios";
import { TIME_OUT } from "../../constants/envs";
import { getvalueUrlContent } from "../../helpers/wrap-api";

export default loginService = async (data) => {
  try {
    const axiosInstance = axios.create();
    axios.defaults.headers = {
      "Content-Type": "application/json",
    };
    const API_AUTH = await getvalueUrlContent("API_AUTH");
    return await axiosInstance.post(API_AUTH, data, { timeout: TIME_OUT });
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  }
};
