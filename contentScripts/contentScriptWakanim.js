var site;

function removeFromList() {
  chrome.runtime.sendMessage({
    request: "episodeSeen",
    url: site
  }, function(response) {});
  $("#imgAnimeFR")[0].src = chrome.runtime.getURL("images/check.png");
}

function trackPlayer() {
  let player = document.querySelector("video");
  if (player == undefined) {
    setTimeout(trackPlayer, 10000);
  } else {
    if (document.querySelector(".episodeNextEp")) {
      document.querySelector(".episodeNextEp").onclick = removeFromList;
    }
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
      var div = $(".episodeBtns")[0];

      var link = document.createElement("a");
      link.id = "episodeSeen";
      link.classList.add("episodeBtns-item");
      var img = document.createElement("img");
      img.id = "imgAnimeFR";
      img.src = chrome.runtime.getURL("images/logo_null32.png");
      link.href = "";
      link.append(img);
      var text = document.createElement("span");
      text.classList.add("episodeBtns-text");
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