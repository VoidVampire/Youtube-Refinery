chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ keywords: [], channelNames: [], filterActive: false }, () => {
        console.log('Initial filters set.');
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ filterActive: false }, () => {
        console.log('Filter deactivated on startup.');
    });
});
