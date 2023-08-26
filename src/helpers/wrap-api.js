import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 *
 * @param expireInMinutes
 * @returns {Date}
 */

/**
 *
 * @param null
 * @returns {null}
 */
export const clearAsyncStorage = async () => {
  const keysFetch = await AsyncStorage.getAllKeys();
  const keysNeedRemove = [];
  keysFetch.forEach((element) => {
    if (element !== "staff_email" && element !== "password_hind") {
      keysNeedRemove.push(element);
    }
  });
  await AsyncStorage.multiRemove(keysNeedRemove);
};

export const getExpireDate = async (expireInMinutes) => {
  const now = new Date();
  let expireTime = new Date(now);
  expireTime.setMinutes(now.getMinutes() + expireInMinutes);
  return expireTime;
};

export const getCachedUrlContent = async () => {
  let data = null;

  if (data === null) {
    data = fetch("https://api.jsonbin.io/v3/b/64c36ba68e4aa6225ec66d2b")
      .then((response) => response.json())
      .then((apiRes) => {
        const dataFetch = apiRes?.record;
        for (var key in dataFetch) {
          if (dataFetch.hasOwnProperty(key)) {
            AsyncStorage.setItem(key, dataFetch[key]);
          }
        }
        return;
      });
  }
  return data;
};

/**
 *
 * @param cachekey
 * @returns {cacheValue}
 */
export const getvalueUrlContent = async (cacheKey) => {
  let cache_value = await AsyncStorage.getItem(cacheKey);
  return cache_value;
};
