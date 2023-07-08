function clickButton(selector) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(button => button.click());
}

// const sleep = time => new Promise(resolve => setTimeout(resolve, time));

function waitForSelector(selector) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) {
      resolve(el);
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        // Once we have resolved we don't need the observer anymore
        observer.disconnect();
      });
    })
    .observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
}

async function blockChannelForKids() {
  // flag
  await waitForSelector('[aria-label="Report user"]');
  clickButton('[aria-label="Report user"]'); 

  // block channel for kids
  await waitForSelector('#items > ytd-menu-service-item-renderer:nth-child(2)'); 
  clickButton('#items > ytd-menu-service-item-renderer:nth-child(2)'); 

  // 'Similar videos may still be available'
  await waitForSelector('#confirm-button > yt-button-shape > button');
  clickButton('#confirm-button > yt-button-shape > button'); 

  await waitForSelector('[aria-label="Block"]'); 
  clickButton('[aria-label="Block"]'); 

  chrome.runtime.sendMessage({action: "openNextURL"});
}

blockChannelForKids();
