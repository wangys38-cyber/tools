import { en } from './en.js';
import { zh } from './zh.js';

export let currentLang = localStorage.getItem('appLanguage') || 'zh';
export let t = currentLang === 'zh' ? zh : en;

export function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLanguage', lang);
    t = lang === 'zh' ? zh : en;
}

export function translate(key) {
    const keys = key.split('.');
    let result = t;
    
    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            return key;
        }
    }
    
    return result;
}

export function refreshUI() {
    // Refresh all text elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = translate(key);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Refresh placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const text = translate(key);
        if (text) {
            element.placeholder = text;
        }
    });
}