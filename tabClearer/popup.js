document.addEventListener('DOMContentLoaded', function() {
    var clearTabsButton = document.getElementById('clearTabs');
    clearTabsButton.addEventListener('click', function() {
      //alert("Hello from your Chrome extension!");
      chrome.tabs.query({"currentWindow":true}, function(tabs) {
          for (i=0; i<tabs.length; i++){
            //checks if id is locked and removes if it is
            chrome.storage.local.get(tabs[i].id,function(result){
              
            });


            chrome.tabs.remove(tabs[i].id,function(){});
          }
      });
    }, false);
  }, false);

//eventlistener for locktab button
document.addEventListener('DOMContentLoaded', function() {

  chrome.storage.local.set({titus:"is awesome"},function(){

  });

  var lockTabButton = document.getElementById('lockTab');
  lockTabButton.addEventListener('click', function() {
  

  chrome.tabs.getSelected(null, function(tab) {
    var currentTabId = tab.id.toString();
    chrome.storage.local.get(currentTabId,function(result){
        result[currentTabId] == undefined ? lock() : unlock();
        //result.currentTabId == undefined ? lock() : unlock();
        alert(currentTabId);
    });
  });



  }, false);
}, false);

//checks if current tab is in storage
function isLocked(){

  alert(x);
}

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