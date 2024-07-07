chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'applyFilters') {
        console.log('Received applyFilters message');
        activateFilter(true);
    }
});

async function activateFilter(showProgress = false) {
    console.log('Activating filter...');
    chrome.storage.local.get(['keywords', 'channelNames'], async (data) => {
        const keywords = data.keywords ? data.keywords.split(',').map(keyword => keyword.trim()) : [];
        const channelNames = data.channelNames ? data.channelNames.split(',').map(name => name.trim().toLowerCase()) : [];
        const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
        const maxVideos = videoElements.length; // customize this

        console.log(`Found ${videoElements.length} videos`);
        console.log(`Applying filters for the first ${maxVideos} videos`);

        for (let i = 0; i < Math.min(videoElements.length, maxVideos); i++) {
            const video = videoElements[i];
            const channelNameElement = video.querySelector('#channel-name');
            const titleElement = video.querySelector('#video-title');
            if (!channelNameElement || !titleElement) continue;

            const channelName = channelNameElement.innerText.trim().toLowerCase();
            const title = titleElement.innerText.trim();

            console.log(`Processing video: "${title}" from channel: "${channelName}"`);

            if (channelNames.includes(channelName)) {
                video.style.filter = 'blur(10px)';
                if (showProgress) {
                    sendProgressUpdate(i, maxVideos, title);
                }
                console.log(`Blurred video: "${title}" from channel: "${channelName}" (blocked channel)`);
            } else {
                const prompt = `Provide ONLY relevance percentage score of '${title}' to these topics: ${keywords.join(', ')}`;
                console.log(`Sending prompt to Gemini: ${prompt}`);
                const relevanceScores = await fetchGeminiAPI(prompt);
                console.log(`Relevance scores for "${title}": ${relevanceScores}`);
                if (shouldBlurVideo(relevanceScores)) {
                    video.style.filter = 'blur(10px)';
                    if (showProgress) {
                        sendProgressUpdate(i, maxVideos, title);
                    }
                    console.log(`Blurred video: "${title}" from channel: "${channelName}" (irrelevant content)`);
                } else {
                    if (showProgress) {
                        sendProgressUpdate(i, maxVideos);
                    }
                    console.log(`Did not blur video: "${title}" from channel: "${channelName}" (relevant content)`);
                }
            }
        }
    });
}

async function fetchGeminiAPI(prompt) {
    const apiKey = ''; // Using the Gemini's API key
    const baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=';

    const url = new URL(baseUrl+apiKey);
    const data = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    { "text": prompt }
                ]
            }
        ]
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        console.log(`Sending request to Gemini API: ${url}`);
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(`Received response from Gemini API: ${JSON.stringify(responseData)}`);
        return responseData.candidates[0].content.parts[0].text; 
    } catch (error) {
        console.error('Error fetching Gemini API:', error);
        return '';
    }
}

function shouldBlurVideo(relevanceScores) {
    const scores = relevanceScores.split('\n').map(line => {
        const match = line.match(/: (\d+)%/);
        return match ? parseInt(match[1], 10) : 0;
    });
    console.log(`Parsed relevance scores: ${scores}`);
    return scores.some(score => score >= 50);
}

function sendProgressUpdate(currentIndex, maxVideos, bannedVideo = null) {
    const progress = ((currentIndex + 1) / maxVideos) * 100;
    chrome.runtime.sendMessage({ action: 'updateProgress', progress, bannedVideo });
}
