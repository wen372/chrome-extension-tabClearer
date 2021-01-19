//listens for update of tab and updates the icon if locked
chrome.tabs.onUpdated.addListener(function(tab){
    var currentTabId = tab.id.toString();
        chrome.storage.local.get(currentTabId,function(result){
            if (result[currentTabId] != undefined){
                chrome.browserAction.setIcon({tabId: tab.id, path: 'images/locked.png'});
            } 
        });
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

//listens for update and re-enables the icons for locked tabs
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "update"){
        chrome.storage.local.get(null, function (items) {
            var allKeys = Object.keys(items);
            allKeys.forEach(key => {
                chrome.browserAction.setIcon({tabId: parseInt(key), path: 'images/locked.png'});
            })
        });
    }
});


//"locks" current tab by saving in storage
function lock() {
    chrome.tabs.getSelected(null, function (tab) {
        var currentId = tab.id.toString();
        var dictionary = {};
        dictionary[currentId] = 0;
        chrome.storage.local.set(dictionary, function () { });
        chrome.browserAction.setIcon({ tabId: tab.id, path: 'images/locked.png' });

        //adds title + url to scrollArea view
        var _popup = chrome.extension.getViews( { type: 'popup' } )[0];
        scrollSelect = _popup.document.getElementById('scrollSelect');
        var option = document.createElement("option");
        option.text = tab.title.substring(0,21) + " :  " + tab.url;
        option.value = tab.id;
        option.style.backgroundColor = "lightgreen";
        scrollSelect.append(option);
        

    });

  }
  
//"unlocks" current tab by removing from storage
function unlock() {
    chrome.tabs.getSelected(null, function (tab) {
        var currentId = tab.id.toString();
        chrome.storage.local.remove(currentId, function () { });
        chrome.browserAction.setIcon({ tabId: tab.id, path: 'images/unlocked.png' });
        
        //removes title + url from scrollArea
        var _popup = chrome.extension.getViews( { type: 'popup' } )[0];
        scrollSelect = _popup.document.getElementById('scrollSelect');
        for (i=0;i<scrollSelect.options.length;i++){
            if(scrollSelect.options[i].value == currentId){
                scrollSelect.options[i] = null;
            }
        }
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

// Handler for lock keyboard shortcut
chrome.commands.onCommand.addListener(function(command) {
    if (command == "toggle-lock-selected-tab") {
        toggleSelectedTabLock();
    } else if (command == "clear-unlocked-tabs") {
        clearUnlockedTabs();
    }
  });


/*
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.command) {
        case "start":
            alert("working");
    }
  
    return true;
  });
  */
