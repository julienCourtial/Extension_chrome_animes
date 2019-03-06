function callback(error) {
  console.error(error);
}

function removeFromList() {
  browser.runtime.sendMessage({
    request: "episodeSeen",
    url: location.href
  }).then( function(response) {},callback);

  console.log("outside if");
  console.log($("#check_anime"));
  if ($("#check_anime")[0] == undefined) {
    console.log("in if");
    var check = document.createElement("img");
    check.src = browser.runtime.getURL("images/check.png");
    check.id = "check_anime";
    $("#episodeSeen")[0].append(check);
  }
}

browser.storage.sync.get(["links"]).then( function(result) {
  if (result.links) {
    if (result.links.includes(location.href)) {
      var div = $(".showmedia-submenu")[0];
      var link = document.createElement("a");
      link.id = "episodeSeen";
      var img = document.createElement("img");
      img.src = browser.runtime.getURL("images/logo_null32.png");
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
},callback);
