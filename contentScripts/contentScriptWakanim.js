function removeFromList() {
  chrome.runtime.sendMessage({
    request: "episodeSeen",
    url: location.href
  }, function(response) {});

  // if ($("#check_anime")[0] == undefined) {
  //   var check = document.createElement("img");
  //   check.src = chrome.runtime.getURL("images/check.png");
  //   check.id = "check_anime";
  //   $("#episodeSeen")[0].append(check);
  // }
  $("#imgAnimeFR")[0].src = chrome.runtime.getURL("images/check.png");
}

function trackPlayer() {
  let player = $(".jw-video")[0];
  if (player == undefined) {
    setTimeout(trackPlayer, 10000);
  } else {
    console.log("PLAYER SET");
    // $(".vjs-dock-bottom")[0].onclick = removeFromList;
    player.addEventListener('ended', function(event) {
      removeFromList();
    });
  }
}

chrome.storage.sync.get(["links"], function(result) {
  if (result.links) {
    console.log(result.links);
    if (result.links.includes(location.href)) {
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
