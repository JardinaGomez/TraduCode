chrome.runtime.onInstalled.addListener(() => {
    // Initialize storage with default state (enabled)
    chrome.storage.local.set({ enabled: true });
});

chrome.action.onClicked.addListener((tab) => {
    // Toggle translations directly from the action button (optional)
    chrome.storage.local.get(["enabled"], (data) => {
        const newState = !(data.enabled ?? true);   // If 'enabled' is undefined, set it to true
        chrome.storage.local.set({ enabled: newState }, () => {
            chrome.action.setBadgeText({
                text: newState ? "ON" : "OFF",
                tabId: tab.id,
            });
        });
    });
});
