function callback() {
  if (chrome.runtime.lastError) 
    console.log(chrome.runtime.lastError);
  }

var card = document.querySelector("#card_anime");

function display_to_watch_list() {
  var list_episode = $("#list_episode");
  list_episode[0].childNodes.forEach(function(elem) {
    elem.remove;
  });

  chrome.storage.sync.get(['to_watch_list'], function(result) {
    var to_watch_list = result.to_watch_list;
    to_watch_list.reverse();
    to_watch_list.forEach(function(elem) {

      var clone = document.importNode(card.content, true);
      var img = clone.querySelector("img");
      if (elem.img) 
        img.setAttribute("src", elem.img);
      var description = clone.querySelector(".description");
      description.textContent = elem.title;
      var remove = clone.querySelector(".remove")
      remove.onclick = function() {
        to_watch_list.forEach(function(e2, index) {
          if (e2.title == elem.title) 
            to_watch_list.splice(index, 1);
          to_watch_list.reverse();
          chrome.storage.sync.set({
            "to_watch_list": to_watch_list
          }, function() {
            if (chrome.runtime.lastError) {
              console.log(chrome.runtime.lastError);
            } else {
              chrome.browserAction.setBadgeText({text: to_watch_list.length.toString()});
              chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
            }
          });
          to_watch_list.reverse();
        });
      };

      var watch = clone.querySelector(".watch");
      watch.onclick = function() {
        chrome.tabs.create({'url': elem.link});
      }

      list_episode.append(clone);

    });
  });
}
display_to_watch_list();

chrome.storage.onChanged.addListener(function(changes, areaName) {
  window.location.reload();
});
