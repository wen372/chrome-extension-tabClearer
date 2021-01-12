//eventlistener
document.addEventListener('DOMContentLoaded', function () {

  //eventlistener for clearTabs button
  var clearTabsButton = document.getElementById('clearTabs');
  clearTabsButton.addEventListener('click', function () {
    //alert("Hello from your Chrome extension!");
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
  }, false);

  //eventlistener for lockTab button
  var lockTabButton = document.getElementById('lockTab');
  lockTabButton.addEventListener('click', function () {
    chrome.tabs.getSelected(null, function (tab) {
      var currentTabId = tab.id.toString();
      chrome.storage.local.get(currentTabId, function (result) {
        result[currentTabId] == undefined ? lock() : unlock();
      });

    });
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
              var option = document.createElement("option");
              option.text = tab.title;
              //sends new title to scrollSelect html
              scrollSelect.add(option);
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
}, false);





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