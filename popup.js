

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

  chrome.storage.sync.get(['to_watch_list'],function(result){
    var to_watch_list = result.to_watch_list;
    to_watch_list.forEach(function(elem){
        list_episode.append($('<div/>').text(elem.title));
    });
  })
}

test();
