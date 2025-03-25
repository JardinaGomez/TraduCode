/**
 * TraduCode - content.js
 * This script runs in the context of web pages and handles the translation of code blocks.
 */

(async function () {
    'use strict'; // Enforce strict mode, helps catch common coding errors and "bad" syntax

    // Configuration and state
    const EXTENSION_ID = chrome.runtime.id;
    let isEnabled = true; // 
    let translations = {}; // Translations dictionary
    // MutationObserver provides a way to react to changes in the DOM, DOM(Document Object Model) is a programming interface for HTML and XML documents.
    let observer = null; // MutationObserver for dynamically added code blocks 
    let tooltip = null; // Tooltip element for displaying translated code
    let tooltipTimer = null; // Timer for debouncing tooltip creation 

    // Checking if the script is running in an iframe
    const isInIframe = window.self !== window.top;

    // CSS styles for tooltip
    const tooltipStyles = `
        .traducode-tooltip {
            position: absolute;
            background-color: #f8f9fa;
            color: #202124;
            border: 1px solid #dadce0;
            border-radius: 4px;
            padding: 8px 12px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            max-width: 80vw;
            max-height: 50vh;
            overflow: auto;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            white-space: pre-wrap;
            pointer-events: none;
            transition: opacity 0.15s ease-in-out;
        }
        
        .traducode-highlight {
            background-color: rgba(255, 255, 0, 0.2);
            border-bottom: 1px dashed #ffc107;
        }
    `;

    // Initialize the extension 
    async function initialize() {
        try {
            // Load extension state
            const data = await chrome.storage.local.get(['enabled']); // Getting value of 'enabled' from local storage
            isEnabled = data.enabled === undefined ? true : data.enabled; // If 'enabled' is not defined, set it to true

            // Log initialization status
            console.log(`TraduCode initialized in ${isInIframe ? 'iframe' : 'main frame'} (Enabled: ${isEnabled})`);

            // Load translations
            await loadTranslations();

            // Apply styles to the page
            applyStyles();

            // Setup message listeners
            setupListeners();

            // Process existing code blocks
            if (isEnabled) {
                processExistingCodeBlocks();
                setupMutationObserver();
            }

            // Notify background script that content script is ready
            chrome.runtime.sendMessage({
                action: 'contentScriptReady',
                inIframe: isInIframe,
                url: window.location.href
            });
        } catch (error) {
            console.error('TraduCode initialization error:', error);
        }
    }

    // Load translations from extension's config
    async function loadTranslations() {
        try {
            // Try to load translations directly from config.js using dynamic import
            const configModule = await import(chrome.runtime.getURL('config.js'));

            if (configModule && configModule.TRANSLATIONS) {
                translations = configModule.TRANSLATIONS;
                console.log('Translations loaded from config module');
            } else {
                // Fallback to loading translations from storage
                const data = await chrome.storage.local.get(['translations']);
                if (data.translations) {
                    translations = data.translations;
                    console.log('Translations loaded from storage');
                } else {
                    // Hardcoded fallback if everything else fails
                    translations = {
                        'if': 'sí',
                        'else': 'sino',
                        'for': 'para',
                        'while': 'mientras',
                        'function': 'función',
                        'return': 'retornar',
                        'print': 'imprimir',

                    };
                    console.log('Using fallback translations');
                }
            }
        } catch (error) {
            console.error('Error loading translations:', error);
            // Hardcoded fallback
            translations = {
                'if': 'sí',
                'else': 'sino',
                'for': 'para',
                'while': 'mientras',
                'function': 'función',
                'return': 'retornar',
                'print': 'imprimir',

            };
        }
    }

    // Add styles to the document
    function applyStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = tooltipStyles;
        styleElement.setAttribute('data-traducode', 'true');
        document.head.appendChild(styleElement);
    }

    // Setup message listeners for background script communication
    function setupListeners() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'toggleEnabled') {
                isEnabled = request.enabled;

                if (isEnabled) {
                    processExistingCodeBlocks();
                    setupMutationObserver();
                } else {
                    disconnectObserver();
                    removeTooltip();
                }

                sendResponse({ success: true });
            } else if (request.action === 'loadTranslations') {
                loadTranslations()
                    .then(() => sendResponse({ success: true }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                return true; // Required for async response
            } else if (request.action === 'getStatus') {
                sendResponse({
                    enabled: isEnabled,
                    inIframe: isInIframe,
                    url: window.location.href
                });
            }
        });
    }

    // Process all existing code blocks on the page
    function processExistingCodeBlocks() {
        if (!isEnabled) return;

        const selector = 'pre, code, .code, .CodeMirror, [class*="code-"], [class*="language-"]';
        const codeElements = document.querySelectorAll(selector);

        console.log(`TraduCode found ${codeElements.length} code blocks`);
        codeElements.forEach(element => {
            // Add hover event listeners and 
            element.addEventListener('mouseover', handleCodeHover);
            element.addEventListener('mouseout', handleCodeOut);
            element.addEventListener('mousemove', handleCodeMove);
        });
    }

    // Setup MutationObserver to detect dynamically added code blocks
    function setupMutationObserver() {
        if (observer) return;

        observer = new MutationObserver((mutations) => {
            if (!isEnabled) return;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the node itself is a code element
                            if (isCodeElement(node)) {
                                node.addEventListener('mouseover', handleCodeHover);
                                node.addEventListener('mouseout', handleCodeOut);
                                node.addEventListener('mousemove', handleCodeMove);
                            }

                            // Check for code elements inside the added node
                            const selector = 'pre, code, .code, .CodeMirror, [class*="code-"], [class*="language-"]';
                            const codeElements = node.querySelectorAll(selector);

                            codeElements.forEach(element => {
                                element.addEventListener('mouseover', handleCodeHover);
                                element.addEventListener('mouseout', handleCodeOut);
                                element.addEventListener('mousemove', handleCodeMove);
                            });
                        }
                    }
                }
            }
        });

        // Start observing with configuration
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('TraduCode MutationObserver started');
    }

    // Disconnect MutationObserver when not needed
    function disconnectObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('TraduCode MutationObserver disconnected');
        }
    }

    // Check if an element is a code element
    function isCodeElement(element) {
        if (!element || !element.tagName) return false;

        const tagName = element.tagName.toLowerCase();
        if (tagName === 'pre' || tagName === 'code') return true;

        const className = element.className || '';
        return className.includes('code') || // look up more class names to add for FUTURE
            className.includes('language-') ||
            element.classList.contains('CodeMirror');
    }

    // Event handler for code hover
    function handleCodeHover(event) {
        if (!isEnabled) return;

        const target = event.currentTarget;

        // Debounce tooltip creation for performance
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => {
            try {
                const codeText = extractCodeText(target);
                if (!codeText || codeText.trim().length === 0) return;

                const translatedCode = translateCode(codeText);

                // Only show tooltip if there are actual translations
                if (translatedCode !== codeText) {
                    showTooltip(event, translatedCode);
                }
            } catch (error) {
                console.error('Error processing code hover:', error);
            }
        }, 200);
    }

    // Event handler for moving mouse over code
    function handleCodeMove(event) {
        if (tooltip) {
            positionTooltip(event);
        }
    }

    // Event handler for moving mouse out of code
    function handleCodeOut() {
        clearTimeout(tooltipTimer);
        removeTooltip();
    }

    // Extract text from code elements, handling various code block types
    function extractCodeText(element) {
        if (!element) return '';

        // Handle CodeMirror elements
        if (element.classList.contains('CodeMirror')) {
            const codeMirrorLines = element.querySelectorAll('.CodeMirror-line');
            if (codeMirrorLines && codeMirrorLines.length > 0) {
                return Array.from(codeMirrorLines)
                    .map(line => line.textContent)
                    .join('\n');
            }
        }

        // Handle syntax highlighters that use nested spans
        if (element.querySelector('span[class*="token"]') ||
            element.querySelector('[class*="hljs-"]')) {
            return element.innerText || element.textContent || '';
        }

        // Default case
        return element.innerText || element.textContent || '';
    }

    // Translate code using the translations dictionary
    function translateCode(code) {
        // checking for code
        if (!code || typeof code !== 'string' || Object.keys(translations).length === 0) {
            return code;
        }

        try {
            // Use regex to split code into tokens while preserving whitespace and punctuation
            const pattern = new RegExp(`(?<!["'#])(?:${Object.keys(translations).join('|')})\\b(?!["'#])`, 'g'); // this regex ignores words in quotes or comments (e.g. 'if', 'else', 'for')

            return code.replace(pattern, match => {
                return translations[match] || match; // replace with translation or keep original word
            });
        } catch (error) { // this catches if there is an error in the translation
            console.error('Translation error:', error);
            return code;
        }
    }

    // Check if a character is alphanumeric or underscore (valid in identifiers)
    function isIdentifierChar(char) {
        return /[a-zA-Z0-9_]/.test(char);
    }

    // Display tooltip with translated code
    function showTooltip(event, translatedCode) {
        removeTooltip(); // Remove any existing tooltip

        tooltip = document.createElement('div');
        tooltip.className = 'traducode-tooltip';
        tooltip.setAttribute('data-traducode', 'tooltip');

        // Highlight translated words
        const highlightedCode = translatedCode.replace(/(\b\w+\b)/g, (match, word) => {
            const originalWord = Object.keys(translations).find(key => translations[key].toLowerCase() === word.toLowerCase());
            if (originalWord) {
                return `<span class="translated-word" title="${originalWord}">${word}</span>`; // replace with highlighted word
            }
            return word; // keeping original word
        });

        tooltip.innerHTML = highlightedCode; // Set tooltip content
        document.body.appendChild(tooltip); // Append tooltip to body 
        positionTooltip(event); // Position tooltip near cursor
    }


    // Position tooltip near the mouse cursor
    function positionTooltip(event) {
        if (!tooltip) return;

        const gap = 15; // Gap between cursor and tooltip

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Get tooltip dimensions
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        // Calculate position (default is below and to the right of cursor)
        let left = event.pageX + gap;
        let top = event.pageY + gap;

        // Adjust if tooltip would go off-screen
        if (left + tooltipWidth > viewportWidth + window.scrollX) {
            left = event.pageX - tooltipWidth - 5;
        }

        if (top + tooltipHeight > viewportHeight + window.scrollY) {
            top = event.pageY - tooltipHeight - 5;
        }

        // Set final position
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    // Remove tooltip from DOM
    function removeTooltip() {
        if (tooltip && tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
            tooltip = null;
        }
    }

    // Handle errors gracefully
    function handleError(error, context = 'TraduCode') {
        console.error(`${context} error:`, error);

        // Report error to background script for logging
        try {
            chrome.runtime.sendMessage({
                action: 'logError',
                error: {
                    message: error.message,
                    stack: error.stack,
                    context: context,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (e) {
            // If we can't send the error, just log it locally
            console.error('Failed to report error:', e);
        }
    }

    // Check if a URL should be blocked
    function isBlockedUrl(url) {
        const blockedDomains = [
            'hbopenbid.pubmatic.com',
            'doubleclick.net',
            'ads.linkedin.com',
            'rtb-us-east.linkedin.com',
            'googlesyndication.com',
            'ads.pubmatic.com',
            'onetag-sys.com'
        ];
        return blockedDomains.some(domain => url.includes(domain));
    }

    // Start the extension
    try {
        // Check if we're in a blocked domain
        if (isBlockedUrl(window.location.href)) {
            console.log('TraduCode: Not running on blocked domain');
            return;
        }

        // Initialize extension
        initialize();

        // Setup error handler for uncaught errors
        window.addEventListener('error', (event) => {
            if (event.filename && event.filename.includes(EXTENSION_ID)) {
                handleError(event.error || new Error(event.message), 'Uncaught');
                event.preventDefault();
            }
        });
    } catch (error) {
        handleError(error, 'Initialization');
    }
})();
