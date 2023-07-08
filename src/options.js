const DEFAULT_URLS = [
    { name: "Default Channel 1", url: "https://defaultchannel1.com" },
    { name: "Default Channel 2", url: "https://defaultchannel2.com" },
    // ...
];

let urlList = [];

// Load the list from storage, or use the default list if no list has been saved
chrome.storage.sync.get(['urlList'], function(result) {
    if (result.urlList) {
        urlList = result.urlList;
        populateList(urlList);
    } else {
        populateList(DEFAULT_URLS);
    }
});

function populateList(urlList) {
    const urlListElement = document.getElementById('urlList');

    // Clear the list
    while (urlListElement.firstChild) {
        urlListElement.removeChild(urlListElement.firstChild);
    }

    // Sort the list by channel name
    urlList.sort((a, b) => a.name.localeCompare(b.name));

    // Add each URL to the list
    urlList.forEach(channel => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !channel.disabled;
        checkbox.onchange = function() {
            channel.disabled = !checkbox.checked;
            chrome.storage.sync.set({urlList: urlList});
        };

        const visitedLabel = document.createElement('span');
        visitedLabel.textContent = channel.isVisited ? ' (Visited)' : ' (Not visited)';

        listItem.textContent = channel.name;
        listItem.prepend(checkbox);
        listItem.appendChild(visitedLabel);
        urlListElement.appendChild(listItem);
    });
}

document.getElementById('refresh').addEventListener('click', () => {
    fetch(`https://raw.githubusercontent.com/rianbrob/youtube-kids-garbage-blocker/main/channels.json?cache=${Date.now()}`)
        .then(response => response.json())
        .then(newUrlList => {
            // Merge new list with old list, preserving the 'disabled' and 'isVisited' settings
            newUrlList.forEach(newChannel => {
                const oldChannel = urlList.find(channel => channel.url === newChannel.url);
                if (oldChannel) {
                    newChannel.disabled = oldChannel.disabled;
                    newChannel.isVisited = oldChannel.isVisited;
                }
            });

            urlList = newUrlList;
            populateList(urlList);
            chrome.storage.sync.set({urlList: newUrlList});
        });
});
