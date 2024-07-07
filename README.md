# YouTube Refinery

Welcome to **YouTube Refinery**, a Chrome extension that helps you detoxify your YouTube experience. Define your own keywords and block unwanted channels to blur out irrelevant and distracting videos. Keep your YouTube homepage clean and focused on what truly matters to you!

## Features

- **Keyword Filtering**: Blur videos that are not relevant to your defined keywords.
- **Channel Blocking**: Automatically blur videos from channels you don't want to see.
- **Real-time Processing**: See the progress as videos are analyzed and blurred.
- **Persistent Settings**: Your keywords and blocked channels are saved, so you don't need to re-enter them each time.

## How It Works

1. **Define Filters**: Click the extension icon and enter your keywords and channels you want to block.
2. **Apply Filters**: Hit the "Apply Filters" button to start the filtering process.
3. **Enjoy a Clean YouTube**: Videos matching your criteria will be blurred, allowing you to focus on the content you care about.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/youtube-refinery.git
    ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable **Developer mode**.

4. Click **Load unpacked** and select the cloned repository folder.

5. The extension should now appear in your browser's toolbar.

## Usage

1. Click the YouTube Refinery icon in the Chrome toolbar.
2. Enter your desired keywords (comma-separated) and blocked channel names (comma-separated).
3. Click "Apply Filters".
4. Watch as irrelevant videos on YouTube are blurred out!

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Utilizes the Gemini API for relevance checking
- **Storage**: Chrome Storage API for saving user-defined filters

## Contributing

Feel free to fork this repository, create a branch, and submit a pull request. We welcome any contributions that enhance the functionality or user experience of this extension.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Gemini API](https://developers.google.com/gemini)
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)

---

Stay focused and enjoy a clutter-free YouTube experience with YouTube Refinery!
