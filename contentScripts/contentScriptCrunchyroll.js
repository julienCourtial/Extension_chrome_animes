function removeFromList() {
  chrome.runtime.sendMessage({
    request: "episodeSeen",
    url: location.href
  }, function(response) {});

  if ($("#check_anime")[0] == undefined) {
    var check = document.createElement("img");
    check.src = chrome.runtime.getURL("images/check.png");
    check.id = "check_anime";
    $("#episodeSeen")[0].append(check);
  }
}

chrome.storage.sync.get(["links"], function(result) {
  if (result.links) {
    if (result.links.includes(location.href)) {
      var div = $(".showmedia-submenu")[0];
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

    }

  }
});