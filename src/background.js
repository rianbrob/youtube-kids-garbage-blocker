let urlIndex = 0;
let urlList = [];

// chrome.storage.sync.get(['urlList'], function(result) {
//     if (result.urlList) {
//         urlList = result.urlList;
//     }
// });

function openNextURL() {
    if (urlIndex >= urlList.length) {
        return
        // urlIndex = 0; // Reset index if it's larger than array length
    }

    // Skip disabled URLs
    while (urlList[urlIndex].disabled || urlList[urlIndex].isVisited) {
        urlIndex++;
        if (urlIndex >= urlList.length) {
            // urlIndex = 0; // Reset index if it's larger than array length
        }
    }

    if (urlList[urlIndex].url) {
        const url = `${urlList[urlIndex].url}/about`
        chrome.tabs.create({ url }, function(tab) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['contentScript.js']
            });
        });
    
        urlList[urlIndex].isVisited = true;
        chrome.storage.sync.set({urlList: urlList});
    }

    urlIndex++;
}

chrome.action.onClicked.addListener((tab) => {
    // openNextURL();
    urlIndex = 0
    chrome.storage.sync.get(['urlList'], function(result) {
        if (result.urlList) {
            urlList = result.urlList;
        }
        openNextURL();
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openNextURL') {
        openNextURL();
    }
});

chrome.contextMenus.create({
    id: "settings",
    title: "Settings",
    contexts: ["action"],
    // onclick: function() {
    //     chrome.runtime.openOptionsPage();
    // }
});
