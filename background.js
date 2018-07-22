let watching_anime_list;
let adn_list;
let crunchyroll_list;
let to_watch_list = [];

//NOT WORKING
function set_watching_anime_list_my_anime_list() {
  $.get("animelist.xml", function(data) {
    var animes = new Array();
    var $XML = $(data);
    $XML.find("anime").each(function() {
      var status = $(this).find("my_status").text();
      if (status === "Watching") {
        var item = {
          title: $(this).find("series_title").text(),
          watched_episodes: $(this).find("my_watched_episodes").text()
        };
        animes.push(item);
      }
    });
    watching_anime_list = animes;
  });
}


function set_watching_anime_list_nautiljon() {
  $.get("https://www.nautiljon.com/membre/vu,jarlax,anime.html?format=&statut=1", function(data) {
    var animes = new Array();
    $(data).find("tbody").each(function() {
      $(this).find("tr").each(function() {
        var tab = $(this).find("td");
        var item = {
          title: tab[0].childNodes[0].text,
          link: tab[0].childNodes[0].getAttribute("href"),
          watched_episodes: tab[2].textContent.split(" /")[0],
        }

        animes.push(item);

      });

    });

    watching_anime_list = animes;
  });
}



function set_adn_list() {
  $.get("https://animedigitalnetwork.fr/rss", function(data) {
    var items = new Array();
    $(data).find("item").each(function() {
      var item = {
        title: $(this).find("title").text(),
        link: $(this).find("link").text(),
        img: $(this).find("enclosure")[0].getAttribute("url")
      };
      items.push(item);
    });

    adn_list = items;


  });
}



function set_crunchyroll_list() {
  $.get("http://www.crunchyroll.com/rss?lang=frFR", function(data) {
    var items = new Array();
    $(data).find("item").each(function() {
      var image;
      var image_set = false;
      var seriesTitle;
      $(this)[0].childNodes.forEach(function(elem) {
        if (elem.nodeName == "media:thumbnail" && !image_set) {
          image = elem.getAttribute("url");
          image_set = true;
        }else if(elem.nodeName == "crunchyroll:seriesTitle"){
          seriesTitle = elem.textContent;
        }
      });

      var item = {
        title: $(this).find("title").text(),
        link: $(this).find("link").text(),
        img: image,
        seriesTitle : seriesTitle
      };
      items.push(item);

    });

    crunchyroll_list = items;


  });
}



function set_to_watch_list_adn(item, title_alt) {
  if (adn_list) {

    var titles = item.title.toLowerCase()
    if (title_alt)
      titles = titles.concat(" /", title_alt.toLowerCase());
    adn_list.forEach(function(elem) {
      // titles.split(" / ").forEach(function(title_compare) {
        if (titles.includes(elem.title.split(" Épisode")[0].toLowerCase())) {

          var add_to_list = true;
          to_watch_list.forEach(function(to_watch) {
            if (to_watch.title == elem.title)
              add_to_list = false;
          });
          if (add_to_list)
            to_watch_list.push(elem);

          chrome.storage.sync.set({
            'to_watch_list': to_watch_list
          }, function() {
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
        }



      // });
    });
  }
}



function set_to_watch_list_crunchyroll(item, title_alt) {
  if (crunchyroll_list) {

    var titles = item.title.toLowerCase()
    if (titles.includes("("))
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (title_alt)
      titles = titles.concat(" /", title_alt.toLowerCase());
    crunchyroll_list.forEach(function(elem) {
      // titles.split(" / ").forEach(function(title_compare) {
        if (titles.includes(elem.seriesTitle.toLowerCase())) {

          var add_to_list = true;
          to_watch_list.forEach(function(to_watch) {
            if (to_watch.title == elem.title)
              add_to_list = false;
          });
          if (add_to_list)
            to_watch_list.push(elem);

          chrome.storage.sync.set({
            'to_watch_list': to_watch_list
          }, function() {
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
        }



      // });
    });
  }
}



function set_to_watch_list() {
  if (watching_anime_list) {
    watching_anime_list.forEach(function(elem) {
      $.get("https://www.nautiljon.com" + elem.link, function(data) {
        var info;
        var ul_array = $(data).find("ul");
        for(var i=0;i<ul_array.length;i++){
          if(ul_array[i].classList[0] == "mb10"){
            info=ul_array[i].childNodes;
          }
        }
        if(!info){
          console.log("Pas une bonne page nautiljon");
          return;
        }
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
              set_to_watch_list_adn(elem, title_alt);
            } else if (section_content.split(' ')[1] === "Crunchyroll") {
              set_to_watch_list_crunchyroll(elem, title_alt);
            }
            licencie = false;
          }
        });
      });
    });
  }
}



chrome.runtime.onInstalled.addListener(function() {
  console.log("OnInstalled");
  chrome.storage.sync.clear();
  set_watching_anime_list_nautiljon();
  set_adn_list();
  set_crunchyroll_list();
  set_to_watch_list();
  chrome.alarms.create("refresh", {
    'periodInMinutes': 1
  });
});

chrome.runtime.onStartup.addListener(function() {
  console.log("OnStartup");
  set_watching_anime_list_nautiljon();
  set_adn_list();
  set_crunchyroll_list();
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
    set_crunchyroll_list();
    set_to_watch_list();
  }
});



chrome.storage.onChanged.addListener(function(changes,areaName){
  if(changes.to_watch_list && changes.to_watch_list.newValue){
    changes.to_watch_list.newValue.forEach(function(elem){
      var inside =false;
      if(changes.to_watch_list.oldValue){
        changes.to_watch_list.oldValue.forEach(function(elem2){
          if(elem.title == elem2.title){
            inside =true;
          }
        });
      }
      if(!inside){
        var image;
        if(elem.img.includes("http:") || elem.img.includes("https:")){
          image = elem.img;
        }else{
          image = "https:"+elem.img;
        }
        chrome.notifications.create({
          "type": "basic",
          "iconUrl": image,
          "title": elem.title,
          "message": elem.title
        }, function() {
          if (chrome.runtime.lastError)
            console.log(chrome.runtime.lastError);
        });
      }
    });
  }
});
