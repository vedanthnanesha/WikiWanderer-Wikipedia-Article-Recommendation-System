// Extract article name
const articleName = document.querySelector('h1#firstHeading').textContent;

// Send the article name to the background script
chrome.runtime.sendMessage({ articleName: articleName });
