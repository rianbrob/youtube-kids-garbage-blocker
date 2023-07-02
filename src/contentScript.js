window.onload = function() {
    const button = document.getElementById('button');

    if (button) {
        button.click();

        // After the button click, send a message to the background script to open the next URL
        chrome.runtime.sendMessage({action: "openNextURL"});
    }
};
