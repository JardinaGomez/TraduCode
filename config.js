// In config.js
console.log("Config module loaded!");
const TRANSLATIONS = {
    if: "sí",
    else: "sino",
    for: "para",
    while: "mientras",
};

export const getTranslation = (word) => TRANSLATIONS[word] || word;
