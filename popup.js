document.getElementById("toggle").addEventListener("click", () => {
    chrome.storage.local.get(["enabled"], (data) => {
        const newState = !data.enabled?? true; // If enabled is undefined, set it to true
        chrome.storage.local.set({ "enabled": newState }, () => {
            document.getElementById("toggle").innerText = newState ? "Disable Translations" : "Enable Translations";
        });
    });
});
