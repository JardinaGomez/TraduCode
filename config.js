// In config.js
console.log("Config module loaded!");
const TRANSLATIONS = {
    if: "sí",
    else: "sino",
    for: "para",
    while: "mientras",
    function: "función",
    return: "retornar",
    print: "imprimir"
};
    
export function getTranslation(word) {
    return TRANSLATIONS[word] || word;
}

