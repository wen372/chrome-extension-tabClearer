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

  //eventlistener for expandButton
  var lockTabButton = document.getElementById('lockedPageViewButton');
  lockTabButton.addEventListener('click', function () {

    //checks if window is closed or open
    var pageClosed = lockTabButton.innerText == "<";

    if (pageClosed) {
      var element = document.getElementsByClassName("lockedPageViewHidden");
      for (i = 0; i < element.length; i++) {
        element[i].classList.add('lockedPageView');
        element[i].classList.remove('lockedPageViewHidden');
      }
      document.body.style.minWidth = 400 + 'px';
      document.body.style.minHeight = 130 + 'px';
      lockTabButton.innerText = ">";

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

    }
    else {
      var element = document.getElementsByClassName("lockedPageView");
      for (i = 0; i < element.length; i++) {
        element[i].classList.add('lockedPageViewHidden');
        element[i].classList.remove('lockedPageView');
      }
      document.body.style.minWidth = 200 + 'px';
      document.body.style.minHeight = 130 + 'px';
      lockTabButton.innerText = "<";

      var select = document.getElementById('scrollSelect');

      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    }
  });

  /* Event listener to change the elements within the expanded view */
  document.getElementById("scrollSelect").addEventListener("click", function(e) {
    // e.target will be the item that was clicked on
    var tabId = parseInt(e.target.value);
    chrome.tabs.update(tabId, {selected: true}, function(){});
  })
}, false);