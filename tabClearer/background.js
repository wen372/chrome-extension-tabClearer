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