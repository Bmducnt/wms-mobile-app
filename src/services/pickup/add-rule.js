import axios from 'axios';
import { API_PICKUP_ADD_RULE } from "../../services/endpoints";


export default addRulePickup = async body => {
  try {
    return await axios.post(API_PICKUP_ADD_RULE, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
