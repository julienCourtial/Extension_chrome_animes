function callback() {
  if (chrome.runtime.lastError)
    console.log(chrome.runtime.lastError);
}

function display_to_watch_list() {
  var list_episode = $("#list_episode");
  list_episode[0].childNodes.forEach(function(elem){
    elem.remove;
  });

  chrome.storage.sync.get(['to_watch_list'], function(result) {
    var to_watch_list = result.to_watch_list;
    to_watch_list.reverse();
    to_watch_list.forEach(function(elem) {
      var elem_display = $('<div/>').hover(function() {
        $(this).css("background-color", "#37474f");
      }, function() {
        $(this).css("background-color", "#263238");
      });
      elem_display[0].classList.add("row");
      elem_display[0].style.borderColor = "#37474f";
      elem_display[0].style.borderStyle = "solid";
      elem_display[0].style.borderRadius = "5px";
      var col1 = $("<div/>)");
      col1[0].classList.add("col");
      col1[0].classList.add("s6");
      var image = $('<img/>');
      if (elem.img.includes("http:") || elem.img.includes("https:"))
        image[0].setAttribute("src", elem.img);
      else {
        image[0].setAttribute("src", "https:" + elem.img);
        // image[0].style.width = "160px";

      }
      image[0].classList.add("responsive-img");
      col1[0].append(image[0]);
      elem_display[0].append(col1[0]);
      var col2 = $("<div/>)").text(elem.title);
      col2[0].classList.add("col");
      col2[0].classList.add("s5");
      col2[0].style.paddingTop = "15px";
      elem_display[0].append(col2[0]);

      var icon = $("<i/>").text("cancel");

      icon[0].classList.add("blue-grey-text");
      icon[0].classList.add("text-lighten-4");
      icon.hover(function(){
        $(this)[0].style.cursor = "pointer";
        $(this)[0].classList.replace("text-lighten-4","text-darken-4");
      }, function(){
        $(this)[0].style.cursor = "auto";
        $(this)[0].classList.replace("text-darken-4","text-lighten-4");
      });
      icon[0].classList.add("material-icons");
      icon[0].onclick = function(){
        to_watch_list.forEach(function(e2,index){
          if(e2.title == elem.title)
            to_watch_list.splice(index,1);
          to_watch_list.reverse();
          chrome.storage.sync.set({"to_watch_list" : to_watch_list},function(){
            if (chrome.runtime.lastError) {
              console.log(chrome.runtime.lastError);
            } else {
              chrome.browserAction.setBadgeText({
                text: to_watch_list.length.toString()
              });
              chrome.browserAction.setBadgeBackgroundColor({
                color: '#4688F1'
              });
            }
          });
          to_watch_list.reverse();
        });
      };
      var col3 = $("<div/>");
      col3[0].append(icon[0]);
      col3[0].classList.add("col");
      col3[0].classList.add("s1");
      col3[0].style.marginTop = "30px";
      col3[0].style.paddingLeft = "5px";
      elem_display[0].append(col3[0]);
      col2[0].onclick = function() {
        chrome.tabs.create({
          'url': elem.link
        });
      };
      col1[0].onclick = function() {
        chrome.tabs.create({
          'url': elem.link
        });
      };
      // console.log(col1);
      // elem_display[0].onclick = function() {
      //   chrome.tabs.create({
      //     'url': elem.link
      //   });
      // };


      list_episode.append(elem_display);

    });
  });
}

display_to_watch_list();

chrome.storage.onChanged.addListener(function(changes, areaName) {
  window.location.reload();
});
