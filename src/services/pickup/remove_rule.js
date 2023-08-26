import axios from 'axios';
import { API_PICKUP_REMOVE_RULE } from "../../services/endpoints";


export default removeRulePickup = async body => {
  try {
    return await axios.put(API_PICKUP_REMOVE_RULE, body);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};
