import { getTranslation } from "./config.js";

class CodeTranslator {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    init() {
        document.addEventListener("mouseover", (event) => {
            // Target <pre>, <code>, or elements with common code-related classes
            const target = event.target.closest("pre, code, [class*='code'], [class*='syntax'], [data-code]");
            if (target) {
                this.showTooltip(event, target);
            }
        });

        document.addEventListener("mouseout", () => this.removeTooltip());
    }

    showTooltip(event, element) {
        if (this.tooltip) this.tooltip.remove();

        const originalText = element.innerText;
        const translatedText = this.translateCode(originalText);

        this.tooltip = document.createElement("div");
        this.tooltip.className = "translation-tooltip";
        this.tooltip.innerText = translatedText;

        document.body.appendChild(this.tooltip);
        this.positionTooltip(event);
    }

    translateCode(code) {
        return code.split(/\s+/).map(getTranslation).join(" ");
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
