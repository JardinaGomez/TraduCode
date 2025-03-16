chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes("googlesyndication.com") || tab.url.includes("doubleclick.net")) {
        console.warn("Skipping translation on ad domain:", tab.url);
        return;
    }

    chrome.storage.local.get(["enabled"], (data) => {
        const newState = !(data.enabled ?? true);
        chrome.storage.local.set({ enabled: newState }, () => {
            chrome.action.setBadgeText({
                text: newState ? "ON" : "OFF",
                tabId: tab.id,
            });
        });
    });
});
