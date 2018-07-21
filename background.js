function set_watching_anime_list_my_anime_list() {
  $.get("animelist.xml", function(data) {
    var animes = new Array();
    var $XML = $(data);
    $XML.find("anime").each(function() {
      // console.log("One anime found");
      var status = $(this).find("my_status").text();
      if (status === "Watching") {
        var item = {
          title: $(this).find("series_title").text(),
          watched_episodes: $(this).find("my_watched_episodes").text()
        };
        animes.push(item);
      }
    });
    chrome.storage.sync.set({
      'watching_anime_list': animes
    }, function() {
      if (chrome.runtime.lastError) {
        console.log(lastError);
      }
    });
  });
}


function set_watching_anime_list_nautiljon() {
  $.get("https://www.nautiljon.com/membre/vu,jarlax,anime.html", function(data) {
    var animes = new Array();
    $(data).find("tbody").each(function() {
      $(this).find("tr").each(function() {
        var tab = $(this).find("td");
        if (tab[3].childNodes[0].childNodes[0].childNodes[1].getAttribute("selected") === "selected") {
          var item = {
            title: tab[0].childNodes[0].text,
            link: tab[0].childNodes[0].getAttribute("href"),
            watched_episodes: tab[2].childNodes[2].childNodes[0].textContent,
          }
          animes.push(item);
        }
      });

    });
    chrome.storage.sync.set({
      'watching_anime_list': animes
    }, function() {
      if (chrome.runtime.lastError) {
        console.log(lastError);
      }
    });
  });
}



function set_adn_list() {
  $.get("https://animedigitalnetwork.fr/rss", function(data) {
    var items = new Array();
    var $XML = $(data);
    $XML.find("item").each(function() {
      var item = {
        title: $(this).find("title").text(),
        link: $(this).find("link").text(),
        img: $(this).find("enclosure")[0].getAttribute("url")
      };
      items.push(item);
    });

    chrome.storage.sync.set({
      'adn_list': items
    }, function() {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    });


  });
}


function set_to_watch_list_adn(item, title_alt) {
  chrome.storage.sync.get(['adn_list'], function(result) {
    if (chrome.runtime.lastError)
      console.log(chrome.runtime.lastError);
    else if (result.adn_list) {
      var titles = item.title.toLowerCase()
      if (title_alt)
        titles = titles.concat(" /", title_alt.toLowerCase());
      result.adn_list.forEach(function(elem) {
        titles.split(" / ").forEach(function(title_compare) {
          if (elem.title.split(" Épisode")[0].toLowerCase() == title_compare) {
            chrome.storage.sync.get(['to_watch_list'],function(result){
              var to_watch_list;

              if(chrome.runtime.lastError){
                console.log(chrome.runtime.lastError);
              }else{
                if(result.to_watch_list){
                  to_watch_list = result.to_watch_list;
                }else{
                  to_watch_list = [];
                }

                var add_to_list = true;
                to_watch_list.forEach(function(to_watch){
                  if(to_watch.title == elem.title)
                    add_to_list = false;
                });
                if(add_to_list)
                  to_watch_list.push(elem);

                chrome.storage.sync.set({
                  'to_watch_list': to_watch_list
                }, function() {
                  if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                  }else{
                    console.log("TO WATCH LIST SET");
                  }
                });
              }



            });

          }

        });
      });
    }
  });
}




function set_to_watch_list() {
  chrome.storage.sync.get(['watching_anime_list'], function(result) {
    if (chrome.runtime.lastError)
      console.log(chrome.runtime.lastError);
    else {
      if (result.watching_anime_list) {
        result.watching_anime_list.forEach(function(elem) {
          $.get("https://www.nautiljon.com" + elem.link, function(data) {
            var info = $(data).find("ul")[17].childNodes;
            var licencie = false;
            var title_alt = null;
            info.forEach(function(elem_li) {
              var section = elem_li.textContent.split(" : ");
              var section_title = section.shift();
              var section_content = section.join('');
              if (section_title === "Titre alternatif") {
                title_alt = section_content;
              } else if (section_title === "Licencié en France") {
                licencie = true;
              } else if (licencie && section_title === "Editeur") {
                if (section_content.split(' ')[1] === "ADN" || section_content.split(' ')[1] === "Kana") {
                  console.log("Licencié par ADN");
                  set_to_watch_list_adn(elem, title_alt);
                }
                licencie = false;
              }
            });
            // if(info[13].childNodes[0].textContent === "Licencié en France : "){
            //   console.log("Licencié en France");
            //   info[14].
            // }
          });
        });
      }
    }
  })
}



chrome.runtime.onInstalled.addListener(function() {
  console.log("OnInstalled");
  chrome.storage.sync.clear();
  set_watching_anime_list_nautiljon();
  set_adn_list();
  set_to_watch_list();
  chrome.alarms.create("refresh", {
    'periodInMinutes': 1
  });
});

chrome.runtime.onStartup.addListener(function() {
  console.log("OnStartup");
  set_watching_anime_list_nautiljon();
  set_adn_list();
  set_to_watch_list();
  chrome.alarms.create("refresh", {
    'periodInMinutes': 1
  });
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "refresh") {
    console.log("REFRESHING");
    set_watching_anime_list_nautiljon();
    set_adn_list();
    set_to_watch_list();
  }
});
