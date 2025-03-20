
// In background.js
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('TraduCode extension installed or updated:', details.reason);
    
    // Set default settings
    if (details.reason === 'install') {
        await chrome.storage.local.set({ enabled: true });
    }
    
    // Register ad blocking rules
    await registerAdBlockingRules();
});

// Additional event listeners...


// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
    if (!tab || !tab.url) {
        console.error("No active tab or URL found.");
        return;
    }

    const blockedDomains = ["googlesyndication.com", "doubleclick.net"];
    if (blockedDomains.some(domain => tab.url.includes(domain))) {
        console.warn("Skipping translation on ad domain:", tab.url);
        return;
    }

    chrome.storage.local.get(["enabled"], (data) => {
        if (data.enabled) {
            console.log("Extension is enabled, running on:", tab.url);
        } else {
            console.log("Extension is disabled.");
        }
    });

    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: false },
            function: () => console.log("Running only on main frame.")
        });

        //  Send message to content script to load translations
        chrome.tabs.sendMessage(tab.id, { action: "loadTranslations" });

    } catch (err) {
        console.error("Failed to execute script:", err);
    }
     //  Tell content script to load translations
     chrome.tabs.sendMessage(tab.id, { action: "loadTranslations" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error sending message to content script:", chrome.runtime.lastError);
        } else {
            console.log("Response from content script:", response);
        }
    });
});


// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchData") {
        fetch(request.url)
            .then(response => response.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Required for asynchronous sendResponse
    }
});

