document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['keywords', 'channelNames'], (data) => {
        if (data.keywords) {
            document.getElementById('keywords').value = data.keywords;
        }
        if (data.channelNames) {
            document.getElementById('channelNames').value = data.channelNames;
        }
    });
});

document.getElementById('filterButton').addEventListener('click', () => {
    const keywords = document.getElementById('keywords').value;
    const channelNames = document.getElementById('channelNames').value;

    chrome.storage.local.set({ keywords, channelNames }, () => {
        console.log('Filters saved.');
    });

    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('bannedList').innerHTML = '';

    console.log('Sending message to apply filters');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'applyFilters' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError.message);
            } else {
                console.log('Message sent to content script');
            }
        });
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateProgress') {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = request.progress + '%';

        const bannedList = document.getElementById('bannedList');
        if (request.bannedVideo) {
            const li = document.createElement('li');
            li.textContent = request.bannedVideo;
            bannedList.appendChild(li);
        }
    }
});
