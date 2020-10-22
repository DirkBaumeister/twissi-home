import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import deYaml from 'js-yaml-loader!../../translations/messages.de.yml';
import enYaml from 'js-yaml-loader!../../translations/messages.en.yml';

const splitPlurals = (object) => {
    const newObject = {};
    Object.keys(object).forEach((key) => {
        let elem = object[key];
        if (typeof elem === 'object') {
            newObject[key] = splitPlurals(elem);
            return;
        }
        elem = String(elem).replace(/%([^%]+(?=%))%/gi, '{{$1}}');

        if (typeof elem === 'string' && elem.includes('|')) {
            const plural = elem.split('|');
            newObject[key] = plural.shift();
            newObject[`${key}_plural`] = plural.shift();

            return;
        }

        newObject[key] = elem;
    });

    return newObject;
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            de: {
                translation: splitPlurals(deYaml),
            },
            en: {
                translation: splitPlurals(enYaml),
            },
        },
        lng: (window && window.locale) || 'en',
        fallbackLng: 'en',
        keySeparator: false,
    });

export default i18n;