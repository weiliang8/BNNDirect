const loading_popup = "../layout/popup_loading.html";
const main_popup = "../layout/popup_main.html";
const main_Url = "bloomberg.com";

const articlePath = ["news/newsletters","news/articles", "opinion/articles","news/features","news/storythreads","en/news/"];

function checkArticleUrl2(url) {
  let path
    for (path of articlePath) {
        if (url.includes(path)) { //check if url match with any article path
            return true;
        }
    }
    return false;
}


function UrlReloadPopup(url) {
  if (url && checkArticleUrl2(url)) { //IN bloomberg.com ARTICLE PAGE
    chrome.action.setPopup({ popup: loading_popup });
  }

  else if (!(url && url.includes("bnnbloomberg.ca"))) { //IN .bnnbloomberg.ca
    chrome.action.setPopup({ popup: main_popup });
  } 
  
  else{ //IN OTHER WEBSITE IN bloomberg.com MAIN
    chrome.action.setPopup({ popup: main_popup });
  }

}

// UPDATE POPUP VIEW WHEN TAB URL CHANGES
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { //Event occur when url changes
  UrlReloadPopup(tab.url);
}
)
// UPDATE POPUP VIEW WHEN USER CHANGE TAB
chrome.tabs.onActivated.addListener((info) => { //Event occur when active tab in a window changes
  var url = "";

  handleGetUrl().then(function (result) {
    url = result;
    UrlReloadPopup(url);

    if (url.includes(main_Url))
     chrome.scripting
      .executeScript({
        target: { tabId: info.tabId },
        files: ["./scripts/contentScript.js"],
      })
  });
}
)

// === Get Tab URL ===
const handleGetUrl = async () => {
  const response = await getCurrentTabInfo();
  return response
};

async function getCurrentTabInfo() {
  try {
    const tabInfo = await chrome.tabs.query({ active: true, currentWindow: true })
    return tabInfo[0].url
  } catch (error) {
    console.log("An error occured!")
  }
}
// === ===



