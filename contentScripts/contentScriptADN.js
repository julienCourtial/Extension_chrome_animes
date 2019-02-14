var site;

function removeFromList() {
  chrome.runtime.sendMessage({
    request: "episodeSeen",
    url: site
  }, function(response) {});
  console.log($("#logo-flag")[0].classList);
  $("#logo-flag")[0].classList.replace("icon-flag", "icon-anime-fr-check");
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
      var div = $(".action-line")[0].children[0];
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.id = "episodeSeen";
      var img = document.createElement("span");
      img.id = "logo-flag";
      img.classList.add("icon");
      img.classList.add("icon-flag");
      link.href = "";
      link.classList.add("adn-button");
      link.classList.add("adn-button-with-icon");
      link.append(img);
      var text = document.createElement("span");
      text.textContent = "Visionné";
      link.append(text);
      link.onclick = function(event) {
        event.preventDefault();
        removeFromList();
      };
      li.append(link);
      div.append(li);

      setTimeout(trackPlayer, 10000);

    }
  }
});