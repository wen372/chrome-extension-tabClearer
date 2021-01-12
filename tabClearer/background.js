//listens for "iconCheck" message from visualLockUnlock to set icon for each tab
chrome.runtime.onMessage.addListener(function(msg) 
{
    if(msg.iconCheck){
    chrome.tabs.getSelected(null, function(tab) {
        var currentTabId = tab.id.toString();
        chrome.storage.local.get(currentTabId,function(result){
            if (result[currentTabId] != undefined){
                chrome.browserAction.setIcon({tabId: tab.id, path: 'images/locked.png'});
            } 
        });
      });
    }
});

//listens for tab closing and checks if tab is in locked storage and deletes it from storage if it is
chrome.tabs.onRemoved.addListener(function(tabid) {
    var currentTabId = tabid.toString();
    chrome.storage.local.get(currentTabId,function(result){
        if (result[currentTabId] != undefined){
            chrome.storage.local.remove(currentTabId, function () { });
        } 
    });
});


//"locks" current tab by saving in storage
function lock() {
    chrome.tabs.getSelected(null, function (tab) {
        var currentId = tab.id.toString();
        var dictionary = {};
        dictionary[currentId] = 0;
        chrome.storage.local.set(dictionary, function () { });
        chrome.browserAction.setIcon({ tabId: tab.id, path: 'images/locked.png' });
    });
  }
  
//"unlocks" current tab by removing from storage
function unlock() {
    chrome.tabs.getSelected(null, function (tab) {
        var currentId = tab.id.toString();
        chrome.storage.local.remove(currentId, function () { });
        chrome.browserAction.setIcon({ tabId: tab.id, path: 'images/unlocked.png' });
    });
}

function clearUnlockedTabs() {
    chrome.tabs.query({}, function (tabs) {
        var tabIds = [];
        tabs.forEach(element => tabIds.push(element.id.toString()));
        chrome.storage.local.get(tabIds, function (result) {
          var removeArr = []
          tabIds.forEach(element => {
            if (result[element] == undefined) {
              removeArr.push(parseInt(element));
            }
          });
          chrome.tabs.remove(removeArr, function () { });
        });
      });
}

/* Toggles the lock on the selected Tab */
function toggleSelectedTabLock() {
    chrome.tabs.getSelected(null, function (tab) {
        var currentTabId = tab.id.toString();
        chrome.storage.local.get(currentTabId, function (result) {
          result[currentTabId] == undefined ? lock() : unlock();
        });
    });
}