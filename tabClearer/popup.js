/*
  This is including the helper functions from bgPage. 
  This includes lock, unlock, and clearTabs. 
*/
var bgPage = chrome.extension.getBackgroundPage();


//eventlistener
document.addEventListener('DOMContentLoaded', function () {

  //eventlistener for clearTabs button
  var clearTabsButton = document.getElementById('clearTabs');
  clearTabsButton.addEventListener('click', function () {
    bgPage.clearUnlockedTabs();
  }, false);

  //eventlistener for lockTab button
  var lockTabButton = document.getElementById('lockTab');
  lockTabButton.addEventListener('click', function () {
    bgPage.toggleSelectedTabLock();
  }, false);




//loads view for locked tabs 
var scrollSelect = document.getElementById("scrollSelect");

//looks through storage to find all lock tab titles
chrome.storage.local.get(null, function (items) {
  var allKeys = Object.keys(items);
  allKeys.forEach(key => {
    //*** fix this line to check if the tabID we get is actually still active
    if (Number.isInteger(parseInt(key))) {
      chrome.tabs.get(parseInt(key), function (tab) {
        chrome.windows.getCurrent(function (window) {
          var option = document.createElement("option");
          option.text = tab.title.substring(0,21) + " :  " + tab.url;
          option.value = tab.id;
          /* This is to distinguish to users the locked tabs in the current window */
          if (window.id == tab.windowId) {
            option.style.backgroundColor = "lightgreen";
          }
          scrollSelect.add(option);
        });  
      });
    }
  })
});

    




  /* Event listener to change the elements within the expanded view */
  document.getElementById("scrollSelect").addEventListener("click", function(e) {
    // e.target will be the item that was clicked on
    var tabId = parseInt(e.target.value);
    chrome.tabs.update(tabId, {selected: true}, function(){});
  })
}, false);