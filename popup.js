chrome.storage.local.get(["enabled"], (data) => {
    console.log("Stored state:", data.enabled);
    const isEnabled = data.enabled ?? true;
    document.getElementById("toggle").innerText = isEnabled ? "Disable Translations" : "Enable Translations";
});

document.getElementById("toggle").addEventListener("click", () => {
    chrome.storage.local.get(["enabled"], (data) => {
        console.log("Before toggle:", data.enabled);
        const newState = data.enabled === undefined ? true : !data.enabled;

        chrome.storage.local.set({ enabled: newState }, () => {
            console.log("After toggle:", newState);
            document.getElementById("toggle").innerText = newState ? "Disable Translations" : "Enable Translations";
        });
    });
});