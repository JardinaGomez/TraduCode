document.getElementById("toggle").addEventListener("click", () => {
    chrome.storage.local.get(["enabled"], (data) => {
        const newState = !data.enabled ?? true; // If 'enabled' is undefined, set it to true
        chrome.storage.local.set({ enabled: newState }, () => {
            document.getElementById("toggle").innerText = newState
                ? "Disable Translations"
                : "Enable Translations";
        });
    });
});

// Initialize the button text based on stored state
chrome.storage.local.get(["enabled"], (data) => {
    const isEnabled = data.enabled ?? true; // Default to true if undefined
    document.getElementById("toggle").innerText = isEnabled
        ? "Disable Translations"
        : "Enable Translations";
});
