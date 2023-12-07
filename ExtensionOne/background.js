chrome.runtime.onMessage.addListener((request, sendResponse) => {
  if (request.action === "shortenUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0];
      if (!tab) {
        console.log('No active tab found');
        return;
      }
      console.log('Active tab URL:', tab.url);

      fetch('https://www.sarbeh.com/api/Gextn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: tab.url })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          sendResponse({ shortUrl: data.shortUrl, message: "URL shortened successfully." });
        })
        .catch(error => {
          console.error('Error:', error);
          sendResponse({ action: "errorShortenUrl", error: error.toString() });
        });

    }).catch((error) => {
      console.error('Error querying tabs:', error);
      sendResponse({ action: "errorQueryingTabs", error: error.toString() });
    });
    return true;
  }
});
