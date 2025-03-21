document.addEventListener('DOMContentLoaded', async () => {
    const toggle = document.getElementById('toggle');
    const statusText = document.getElementById('statusText');
    //const translationCount = document.getElementById('translations');
    //  const adsBlocked = document.getElementById('adsBlocked');

    // Load initial state
    const { enabled } = await chrome.storage.local.get('enabled');
    toggle.checked = enabled;
    statusText.textContent = enabled ? 'Enabled' : 'Disabled';

    // Setup toggle handler
    toggle.addEventListener('change', async () => {
        const newState = toggle.checked;
        await chrome.storage.local.set({ enabled: newState });
        statusText.textContent = newState ? 'Enabled' : 'Disabled';

        // Send message to active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, {
                action: 'toggleEnabled',
                enabled: newState
            });
        }
    });

    // Load stats
    // chrome.storage.local.get(['translations', 'adsBlocked'], (data) => {
    //     translationCount.textContent = data.translationCount || 0;
    //     adsBlocked.textContent = data.adsBlocked || 0;
    // });
});
