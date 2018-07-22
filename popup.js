// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     });
//   };

function test() {
  var list_episode = $("#list_episode");

  chrome.storage.sync.get(['to_watch_list'], function(result) {
    var to_watch_list = result.to_watch_list;
    to_watch_list.forEach(function(elem) {
      var elem_display = $('<div/>').hover(function() {
        $(this).css("background-color", "#e6e6e6");
      }, function() {
        $(this).css("background-color", "white");
      });
      elem_display[0].classList.add("row");
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
      elem_display[0].onclick = function() {
        chrome.tabs.create({
          'url': elem.link
        });
      };


      list_episode.append(elem_display);

    });
  });
}

test();
