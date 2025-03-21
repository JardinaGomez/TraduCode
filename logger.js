export class TraduCodeLogger {
    static async logError(error) {
        const errorData = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        // Store locally
        const { errors = [] } = await chrome.storage.local.get('errors');
        errors.push(errorData);
        await chrome.storage.local.set({ errors });

        // Send to background for potential remote logging
        chrome.runtime.sendMessage({
            action: 'logError',
            error: errorData
        });
    }

    static async getErrorLog() {
        const { errors } = await chrome.storage.local.get('errors');
        return errors || [];
    }

    static async clearErrors() {
        await chrome.storage.local.remove('errors');
    }
}
