var site;

function removeFromList() {
  chrome.runtime.sendMessage({
    request: "episodeSeen",
    url: site
  }, function(response) {});

  if ($("#check_anime")[0] == undefined) {
    var check = document.createElement("img");
    check.src = chrome.runtime.getURL("images/check.png");
    check.id = "check_anime";
    $("#episodeSeen")[0].append(check);
  }
}

function trackPlayer() {
  let player = $("#adn-video-js_html5_api")[0];
  if (player == undefined) {
    setTimeout(trackPlayer, 10000);
  } else {
    $(".vjs-dock-bottom")[0].onclick = removeFromList;
    player.addEventListener('ended', function(event) {
      removeFromList();
    });
  }
}

chrome.storage.sync.get(["links"], function(result) {
  if (result.links) {
    let isLink = false;
    site = location.href;
    for (let link of result.links) {
      if (site.includes(link)) {
        site = link;
        isLink = true;
        break;
      }
    }
    if (isLink) {
      var div = $(".share")[0];

      var link = document.createElement("a");
      link.id = "episodeSeen";
      var img = document.createElement("img");
      img.src = chrome.runtime.getURL("images/logo_null32.png");
      link.href = "";
      link.append(img);
      var text = document.createElement("span");
      text.textContent = "Visionné";
      link.append(text);
      link.onclick = function(event) {
        event.preventDefault();
        removeFromList();
      };
      div.append(link);

      setTimeout(trackPlayer, 10000);

    }
  }
});
