async function sendMessage(message) {
  const runtime = chrome.runtime || browser.runtime;
  try {
    return new Promise((resolve, reject) => {
      runtime.sendMessage(message, response => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(response);
        }
      });
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}


document.getElementById("shortenButton").addEventListener("click", async function () {
  try {
    const response = await sendMessage({ action: "shortenUrl" });
    console.log("Response from background script:", response);

    // Tambahkan ini untuk debugging
    if (!response || !response.shortUrl) {
      console.error('Invalid response or shortUrl is missing:', response);
      return; 
    }
    const messageDiv = document.getElementById("message");
    messageDiv.innerText = response.message;

    const a = document.createElement("a");
    a.href = response.shortUrl;
    let url = new URL(response.shortUrl);
    a.textContent = url.hostname.replace('www.', '') + url.pathname;
    a.target = "_blank";
    a.classList.add("block", "text-black", "text-2xl", "underline", "mt-4");
    messageDiv.appendChild(a);

    const button = document.createElement("button");
    button.textContent = "Copy";
    button.classList.add("px-4", "py-2", "bg-green-700", "text-white", "rounded", "mt-4");
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(response.shortUrl)
        .then(() => console.log('URL copied to clipboard'))
        .catch(err => console.error('Failed to copy URL: ', err));
    });
    messageDiv.appendChild(button);
  } catch (error) {
    console.error("Error in sendMessage or response handling:", error);
  }
});



