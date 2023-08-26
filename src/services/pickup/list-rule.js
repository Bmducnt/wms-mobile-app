import axios from 'axios';
import { API_PICKUP_LIST_RULE } from "../../services/endpoints";
export default getListRulePickup = async (params) => {
  try {
    return await axios.get(API_PICKUP_LIST_RULE,{params});
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};