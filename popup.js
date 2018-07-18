

// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     });
//   };

function test() {
  var list_episode = $("#list_episode");

  chrome.storage.sync.get(['items_adn'],function(result){
    var items_adn = result.items_adn;
    for(var i=0;i<items_adn.length;i++){
      list_episode.append($('<div/>').text(items_adn[i].title));
    }
  })
}

test();

chrome.storage.onChanged.addListener(function(changes,areaName){
  console.log("OnChanged Listener");
  if(changes.items_adn){
    console.log("Items ADN modified");
  }
})
