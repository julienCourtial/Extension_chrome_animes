function startup_refresh() {
  console.log("startup_refresh");
  $.get("https://animedigitalnetwork.fr/rss", function(data) {
    var items = new Array();
    var $XML = $(data);
    $XML.find("item").each(function() {
      var item = {
        title: $(this).find("title").text(),
        link: $(this).find("link").text(),
        img: $(this).find("enclosure")[0].getAttribute("url")
      };
      items.push(item);
    });

    chrome.storage.sync.set({
      'items_adn': items
    }, function() {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else {
        chrome.browserAction.setBadgeText({
          text: items.length.toString()
        });
        chrome.browserAction.setBadgeBackgroundColor({
          color: '#FF0000'
        });
        console.log("Items ADN set");
      }
    });


  });
}


chrome.runtime.onInstalled.addListener(function(){
  startup_refresh();
  chrome.alarms.create("refresh", {
    'periodInMinutes': 1
  });
});

chrome.runtime.onStartup.addListener(function(){
  startup_refresh();
  chrome.alarms.create("refresh", {
    'periodInMinutes': 1
  });
});

chrome.alarms.onAlarm.addListener(function(alarm){
  if(alarm.name == "refresh"){
    console.log("REFRESHING");
    // startup_refresh();
    // chrome.storage.sync.set({'items_adn': 0},function(){
    //   if(chrome.runtime.lastError)
    //     console.log(chrome.runtime.lastError);
    // })
  }
})
