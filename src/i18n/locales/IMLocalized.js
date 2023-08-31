import { I18n } from "i18n-js";
import memoize from 'lodash.memoize';
import translation from "../index";
import {I18nManager} from 'react-native';
// import RNLocalize from 'react-native-localize';

const i18n = new I18n(translation);

export const translationGetters = {
    // lazy requires
    vi: () => require('./vi'),
    en: () => require('./en'),
};

export const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfigChange = code => {
    const {languageTag, isRTL} = {languageTag: code, isRTL: false};
    translate.cache.clear();
    I18nManager.forceRTL(isRTL);
    i18n.translations = {
        [languageTag]: translationGetters[languageTag](),
    };
    i18n.locale = languageTag;
};
export const setI18nConfig = async (code) => {
    const fallback = {languageTag: code, isRTL: false};
    const {languageTag, isRTL} =  fallback;
    translate.cache.clear();
    I18nManager.forceRTL(isRTL);

    i18n.translations = {
        [languageTag]: translationGetters[languageTag](),
    };
    i18n.locale = languageTag;
};


// Change lang
// export const setI18nConfigChange = code => {
//     const {languageTag, isRTL} = {languageTag: code, isRTL: false};
//     translate.cache.clear();
//     I18nManager.forceRTL(isRTL);
//     i18n.translations = {
//         [languageTag]: translationGetters[languageTag](),
//     };
//     i18n.locale = languageTag;
// };
