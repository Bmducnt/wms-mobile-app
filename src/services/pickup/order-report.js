
import axios from 'axios';
import { API_PICKUP_EMAIL_RULE } from "../../services/endpoints";

export default getOrderSeller = async (seller_email) => {
  try {
    return await axios.get(API_PICKUP_EMAIL_RULE+seller_email);
  } catch (e) {
    if (e.response) {
      return e.response;
    } else {
      return e;
    }
  };
};