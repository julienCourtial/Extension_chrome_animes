function startup_refresh(){
  console.log("startup_refresh");
  $.get("https://animedigitalnetwork.fr/rss", function(data) {
    var $XML = $(data);
    $XML.find("item").each(function() {
      console.log("One Item");
      // var $this = $(this),
      //     item = {
      //         title:       $this.find("title").text(),
      //         link:        $this.find("link").text(),
      //         description: $this.find("description").text(),
      //         pubDate:     $this.find("pubDate").text(),
      //         author:      $this.find("author").text()
      //     };
      // $('#content-div').append($('<h2/>').text(item.title));
      //etc...
    });
  });
}


chrome.runtime.onInstalled.addListener(startup_refresh);

chrome.runtime.onStartup.addListener(startup_refresh);
