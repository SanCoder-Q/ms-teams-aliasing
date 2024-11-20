chrome?.webNavigation?.onCompleted?.addListener((details) => {
  if (details.url.includes("https://teams.microsoft.com/v2")) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ["injected.js"]
    });
  }
});
