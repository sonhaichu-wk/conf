"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fakerFactory(locale) {
    switch (locale) {
        case 'az':
            return Promise.resolve().then(() => require('faker/locale/az'));
        case 'cz':
            return Promise.resolve().then(() => require('faker/locale/cz'));
        case 'de':
            return Promise.resolve().then(() => require('faker/locale/de'));
        case 'de_AT':
            return Promise.resolve().then(() => require('faker/locale/de_AT'));
        case 'de_CH':
            return Promise.resolve().then(() => require('faker/locale/de_CH'));
        case 'en':
            return Promise.resolve().then(() => require('faker/locale/en'));
        case 'en_AU':
            return Promise.resolve().then(() => require('faker/locale/en_AU'));
        case 'en_BORK':
            return Promise.resolve().then(() => require('faker/locale/en_BORK'));
        case 'en_CA':
            return Promise.resolve().then(() => require('faker/locale/en_CA'));
        case 'en_GB':
            return Promise.resolve().then(() => require('faker/locale/en_GB'));
        case 'en_IE':
            return Promise.resolve().then(() => require('faker/locale/en_IE'));
        case 'en_IND':
            return Promise.resolve().then(() => require('faker/locale/en_IND'));
        case 'en_US':
            return Promise.resolve().then(() => require('faker/locale/en_US'));
        case 'en_au_ocker':
            return Promise.resolve().then(() => require('faker/locale/en_au_ocker'));
        case 'es':
            return Promise.resolve().then(() => require('faker/locale/es'));
        case 'es_MX':
            return Promise.resolve().then(() => require('faker/locale/es_MX'));
        case 'fa':
            return Promise.resolve().then(() => require('faker/locale/fa'));
        case 'fr':
            return Promise.resolve().then(() => require('faker/locale/fr'));
        case 'fr_CA':
            return Promise.resolve().then(() => require('faker/locale/fr_CA'));
        case 'ge':
            return Promise.resolve().then(() => require('faker/locale/ge'));
        case 'id_ID':
            return Promise.resolve().then(() => require('faker/locale/id_ID'));
        case 'it':
            return Promise.resolve().then(() => require('faker/locale/it'));
        case 'ja':
            return Promise.resolve().then(() => require('faker/locale/ja'));
        case 'ko':
            return Promise.resolve().then(() => require('faker/locale/ko'));
        case 'nb_NO':
            return Promise.resolve().then(() => require('faker/locale/nb_NO'));
        case 'nep':
            return Promise.resolve().then(() => require('faker/locale/nep'));
        case 'nl':
            return Promise.resolve().then(() => require('faker/locale/nl'));
        case 'pl':
            return Promise.resolve().then(() => require('faker/locale/pl'));
        case 'pt_BR':
            return Promise.resolve().then(() => require('faker/locale/pt_BR'));
        case 'ru':
            return Promise.resolve().then(() => require('faker/locale/ru'));
        case 'sk':
            return Promise.resolve().then(() => require('faker/locale/sk'));
        case 'sv':
            return Promise.resolve().then(() => require('faker/locale/sv'));
        case 'tr':
            return Promise.resolve().then(() => require('faker/locale/tr'));
        case 'uk':
            return Promise.resolve().then(() => require('faker/locale/uk'));
        case 'vi':
            return Promise.resolve().then(() => require('faker/locale/vi'));
        case 'zh_CN':
            return Promise.resolve().then(() => require('faker/locale/zh_CN'));
        case 'zh_TW':
            return Promise.resolve().then(() => require('faker/locale/zh_TW'));
        default:
            return Promise.resolve().then(() => require('faker/locale/en'));
    }
}
exports.fakerFactory = fakerFactory;
//# sourceMappingURL=faker-factory.js.map