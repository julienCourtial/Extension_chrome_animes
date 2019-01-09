console.log("COUCOU");

chrome.storage.sync.get(["notification_links"], function(result) {
  if (result.notification_links) {
    if (result.notification_links.includes(location.href)) {
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
        chrome.runtime.sendMessage({
          request: "episodeSeen",
          url: location.href
        }, function(response) {});
        let index = result.notification_links.findIndex(function(element) {
          if (element == location.href) {
            return true;
          }
          return false;
        });
        if (index != -1) {
          result.notification_links.splice(index, 1);
          chrome.storage.sync.set({"notification_links": result.notification_links});
        }

      };
      div.append(link);
    }
  }
});
