var site;

function callback(error) {
  console.error(error);
}

function removeFromList() {
  browser.runtime.sendMessage({
    request: "episodeSeen",
    url: site
  }).then(function(response) {}, callback);
  $("#imgAnimeFR")[0].src = browser.runtime.getURL("images/check.png");
}

function trackPlayer() {
  let player = $(".jw-video")[0];
  if (player == undefined) {
    setTimeout(trackPlayer, 10000);
  } else {
    $(".episodeNextEp")[0].onclick = removeFromList;
    player.addEventListener('ended', function(event) {
      removeFromList();
    });
  }
}

browser.storage.sync.get(["links"]).then(function(result) {
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
      img.src = browser.runtime.getURL("images/logo_null32.png");
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
}, callback);