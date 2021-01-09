document.addEventListener('DOMContentLoaded', function() {
    var clearTabsButton = document.getElementById('clearTabs');
    clearTabsButton.addEventListener('click', function() {
      //alert("Hello from your Chrome extension!");
      chrome.tabs.query({}, function(tabs) {
        var tabIds = [];
        tabs.forEach(element => tabIds.push(element.id.toString()));
        chrome.storage.local.get(tabIds,function(result){
            var removeArr = []
            tabIds.forEach(element => {
            if(result[element] == undefined){
                removeArr.push(parseInt(element));
            }
            });
            chrome.tabs.remove(removeArr,function(){});
        });
        
      });
    }, false);
  }, false);

//eventlistener for locktab button
document.addEventListener('DOMContentLoaded', function() {

  var lockTabButton = document.getElementById('lockTab');
  lockTabButton.addEventListener('click', function() {
  chrome.tabs.getSelected(null, function(tab) {
    var currentTabId = tab.id.toString();
    chrome.storage.local.get(currentTabId,function(result){
        result[currentTabId] == undefined ? lock() : unlock();
    });
  });

  }, false);
}, false);

//"locks" current tab by saving in storage
function lock(){
  chrome.tabs.getSelected(null, function(tab) {
    var currentId = tab.id.toString();
    var dictionary = {};
    dictionary[currentId] = 0;
    chrome.storage.local.set(dictionary,function(){});
    alert("locked tab");
  });
}


//"unlocks" current tab by removing from storage
function unlock(){
  chrome.tabs.getSelected(null, function(tab) {
    var currentId = tab.id.toString();
    chrome.storage.local.remove(currentId,function(){});
    alert("unlocked tab");
  });
}