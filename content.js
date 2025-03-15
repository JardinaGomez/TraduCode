import { getTranslation } from chrome.runtime.getURL("config.js");


class CodeTranslator {
    constructor() {
        this.tooltip = null;
        this.init();
    }
    init() {
        document.addEventListener("mouseover", (event) => {
            const target = event.target;
        
            // Prevent cross-origin frame errors
            try {
                if (window.origin !== event.origin) return;
            } catch (e) {
                console.warn("Cross-origin access blocked:", e);
                return;
            }
        
            // Check if the hovered element contains text
            if (target && target.nodeType === Node.ELEMENT_NODE) {
                const text = target.textContent.trim();
                const translatedText = getTranslation(text);
        
                if (text !== translatedText) {
                    this.showTooltip(event, translatedText);
                }
            }
        });

        document.addEventListener("mouseout", () => this.removeTooltip());
    }

    showTooltip(event, translatedText) {
        if (this.tooltip) this.tooltip.remove();

        // Create tooltip element
        this.tooltip = document.createElement("div");
        this.tooltip.className = "translation-tooltip";
        this.tooltip.innerText = translatedText;

        document.body.appendChild(this.tooltip);
        this.positionTooltip(event);
    }

    positionTooltip(event) {
        if (this.tooltip) {
            this.tooltip.style.left = `${event.pageX + 10}px`;
            this.tooltip.style.top = `${event.pageY + 10}px`;
        }
    }

    removeTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
}

// Initialize the translator when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => new CodeTranslator());