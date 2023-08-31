import axios from 'axios';
// import {getvalueUrlContent} from '../../helpers/wrap-api';
import {API_URL} from "../../constants/envs";

export default updateTokenApp = async (body) => {
  try {
    // const API_STAFF_UPDATE = await getvalueUrlContent('API_STAFF_UPDATE')
    return await axios.put(`${API_URL}/api/auth/update/`,body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  }
};
