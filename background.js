let watching_anime_list = [];

let adn_list = [];
let last_adn_date = new Date('2018-01-01');
// let last_adn_date = new Date();
let call_set_adn = 0;
let end_set_adn = 0;

let crunchyroll_list = [];
let last_crunchyroll_date = new Date('2018-01-01');
let call_set_crunchyroll = 0;
let end_set_crunchyroll = 0;

let wakanim_list = [];
let last_ep_wakanim = null;
let call_set_wakanim = 0;
let end_set_wakanim = 0;

let to_watch_list = [];

let running;

function callback() {
  if (chrome.runtime.lastError)
    console.log(chrome.runtime.lastError);
}
//NOT WORKING
// function set_watching_anime_list_my_anime_list() {
//   $.get("animelist.xml", function(data) {
//     var animes = new Array();
//     var $XML = $(data);
//     $XML.find("anime").each(function() {
//       var status = $(this).find("my_status").text();
//       if (status === "Watching") {
//         var item = {
//           title: $(this).find("series_title").text(),
//           watched_episodes: $(this).find("my_watched_episodes").text()
//         };
//         animes.push(item);
//       }
//     });
//     watching_anime_list = animes;
//   });
// }


function set_watching_anime_list_nautiljon() {
  $.get("https://www.nautiljon.com/membre/vu,jarlax,anime.html?format=&statut=1", function(data) {
    var animes = [];
    $(data).find("tbody").each(function() {
      $(this).find("tr").each(function() {
        var tab = $(this).find("td");
        var item = {
          title: tab[0].childNodes[0].text,
          link: tab[0].childNodes[0].getAttribute("href"),
          watched_episodes: tab[2].textContent.split(" /")[0],
        }
        var add_to_list = true;
        watching_anime_list.forEach(function(elem) {
          if (elem.title == item.title)
            add_to_list = false;
        });

        if (add_to_list) {
          watching_anime_list.push(item);
          chrome.storage.sync.set({
            'watching_anime_list': watching_anime_list
          }, callback());
        }


      });

    });

  });
}



function set_adn_list() {
  $.get("https://animedigitalnetwork.fr/rss", function(data) {
    var items = [];
    $(data).find("item").each(function() {
      var item = {
        title: $(this).find("title").text(),
        link: $(this).find("link").text(),
        img: $(this).find("enclosure")[0].getAttribute("url"),
        from: "ADN",
        date: new Date($(this).find("pubDate").text())
      };
      items.push(item);
    });

    items.reverse().forEach(function(elem) {
      if (elem.date > last_adn_date) {
        adn_list.push(elem);
        // chrome.storage.sync.set({'adn_list' : adn_list},callback());
        last_adn_date = elem.date;
        // chrome.storage.sync.set({'last_adn_date' : last_adn_date},callback());
      }
    });

  });
}



function set_crunchyroll_list() {
  $.get("http://www.crunchyroll.com/rss?lang=frFR", function(data) {
    var items = [];
    $(data).find("item").each(function() {
      var image;
      var image_set = false;
      var seriesTitle;
      $(this)[0].childNodes.forEach(function(elem) {
        if (elem.nodeName == "media:thumbnail" && !image_set) {
          image = elem.getAttribute("url");
          image_set = true;
        } else if (elem.nodeName == "crunchyroll:seriesTitle") {
          seriesTitle = elem.textContent;
        }
      });

      var item = {
        title: $(this).find("title").text(),
        link: $(this).find("link").text(),
        date: new Date($(this).find("pubDate").text()),
        img: image,
        seriesTitle: seriesTitle,
        from: "Crunchyroll"
      };
      items.push(item);

      // chrome.storage.sync.set({'crunchyroll_list' : crunchyroll_list},callback());


    });
    items.reverse().forEach(function(elem) {
      if (elem.date >= last_crunchyroll_date) {
        crunchyroll_list.push(elem);
        // chrome.storage.sync.set({'crunchyroll_list' : crunchyroll_list},callback());
        last_crunchyroll_date = elem.date;
        // chrome.storage.sync.set({'last_crunchyroll_date' : last_crunchyroll_date},callback());
      }
    });

  });
}



function set_wakanim_list() {
  $.get("https://www.wakanim.tv/fr/v2", function(data) {
    var items = new Array();
    $(data).each(function(elem) {
      if ($(this)[0].nodeName.toLowerCase() == "section" && $(this)[0].classList[0] == "slider-section") {
        $(this)[0].childNodes.forEach(function(elem) {

          if (elem.nodeName.toLowerCase() == "div" && elem.classList[0] == "container") {
            elem.childNodes.forEach(function(elem2) {
              if (elem2.nodeName.toLowerCase() == "div" && elem2.classList.value == "slider js-slider js-slider-lastEp") {
                var list_last_ep = elem2.children[0].children[0].children[0].children;
                for (var i = 0; i < list_last_ep.length; i++) {
                  var num_ep;
                  var saison;
                  var series;
                  var image;
                  var link;
                  for (var j = 0; j < list_last_ep[i].children.length; j++) {
                    if (list_last_ep[i].children[j].classList[0] == "slider_item_image") {
                      num_ep = list_last_ep[i].children[j].children[1].textContent.trim();
                      link = list_last_ep[i].children[j].children[1].getAttribute("href");
                      image = list_last_ep[i].children[j].children[0].children[0].getAttribute("src");
                    } else if (list_last_ep[i].children[j].classList[0] == "slider_item_description") {
                      saison = list_last_ep[i].children[j].children[0].children[2].textContent;
                      series = list_last_ep[i].children[j].children[0].children[0].textContent;
                    }
                  };
                  var item = {
                    title: series + " " + saison + " Épisode " + num_ep,
                    link: "https://www.wakanim.tv" + link,
                    img: "https:" + image,
                    from: "Wakanim"
                  };
                  items.push(item);
                  // var add_to_list = true;
                  // if (wakanim_list) {
                  //   wakanim_list.forEach(function(elem) {
                  //     if (elem.title == item.title)
                  //       add_to_list = false;
                  //   });
                  // }
                  // if (add_to_list) {
                  //   wakanim_list.push(item);

                  // chrome.storage.sync.set({'wakanim_list' : wakanim_list},callback());
                  // }

                }
              }
            });
          }
        });

      }

    });

    if (!last_ep_wakanim) {
      items.reverse();
      items.forEach(function(elem) {
        wakanim_list.push(elem);
        last_ep_wakanim = elem;
      });
    } else {
      var continuer = true;
      items.forEach(function(elem) {
        if (continuer && elem.title != last_ep_wakanim.title) {
          wakanim_list.push(elem);

        }else{
          continuer = false;
        }


      });
    }

  });
}



function set_to_watch_list_adn(item, title_alt) {
  if (adn_list) {

    var titles = item.title.toLowerCase();
    if (title_alt)
      titles = titles.concat(" /", title_alt.toLowerCase());
    adn_list.forEach(function(elem, index) {
      if (titles.includes(elem.title.split(" Épisode")[0].toLowerCase())) {

        var add_to_list = true;
        to_watch_list.forEach(function(to_watch) {
          if (to_watch.title == elem.title)
            add_to_list = false;
        });
        if (add_to_list) {
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

      }
    });
    end_set_adn++;

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

    });
    end_set_crunchyroll++;

  }
}




function set_to_watch_list_wakanim(item, title_alt) {
  if (wakanim_list) {

    var titles = item.title.toLowerCase()
    if (titles.includes("("))
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (title_alt)
      titles = titles.concat(" /", title_alt.toLowerCase());
    wakanim_list.forEach(function(elem) {
      if (titles.includes(elem.title.split(" Saison")[0].toLowerCase())) {
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

    });
    end_set_wakanim++;

  }
}


function check_adn_clear() {
  if (call_set_adn == end_set_adn) {
    adn_list = [];
    call_set_adn = 0;
    end_set_adn = 0;
  } else {
    setTimeout(check_adn_clear, 10000);
  }
}


function check_crunchyroll_clear() {
  if (call_set_crunchyroll == end_set_crunchyroll) {
    crunchyroll_list = [];
    call_set_crunchyroll = 0;
    end_set_crunchyroll = 0;
  } else {
    setTimeout(check_crunchyroll_clear, 10000);
  }
}

function check_wakanim_clear() {
  if (call_set_wakanim == end_set_wakanim) {
    wakanim_list = [];
    call_set_wakanim = 0;
    end_set_wakanim = 0;
  } else {
    setTimeout(check_wakanim_clear, 10000);
  }
}

function set_to_watch_list() {
  if (watching_anime_list) {
    setTimeout(check_adn_clear, 10000);
    setTimeout(check_crunchyroll_clear, 10000);
    setTimeout(check_wakanim_clear, 10000);
    watching_anime_list.forEach(function(elem) {
      $.get("https://www.nautiljon.com" + elem.link, function(data) {
        console.clear();

        var info;
        var ul_array = $(data).find("ul");
        for (var i = 0; i < ul_array.length; i++) {
          if (ul_array[i].classList[0] == "mb10") {
            info = ul_array[i].childNodes;
          }
        }
        if (!info) {
          console.log("Pas une bonne page nautiljon");
          return;
        }
        var licencie = false;
        var title_alt = null;
        info.forEach(function(elem_li, index) {
          var section = elem_li.textContent.split(" : ");
          var section_title = section.shift();
          var section_content = section.join('');

          if (section_title === "Titre alternatif") {
            title_alt = section_content;
          } else if (section_title === "Licencié en France") {
            licencie = true;
          } else if (licencie && section_title === "Editeur") {
            if ((section_content.split(' ')[1] === "ADN" || section_content.split(' ')[1] === "Kana")) {
              call_set_adn++;
              set_to_watch_list_adn(elem, title_alt);
            } else if (section_content.split(' ')[1] === "Crunchyroll") {
              call_set_crunchyroll++;
              set_to_watch_list_crunchyroll(elem, title_alt);
            } else if (section_content.split(' ')[1] === "Wakanim") {
              call_set_wakanim++;
              set_to_watch_list_wakanim(elem, title_alt);
            }

            licencie = false;
          } else if (licencie && section_title === "Editeurs") {
            var editeur_set = false;
            section_content.split(' -').forEach(function(editeur) {
              if ((editeur.split(' ')[1] === "ADN" || editeur.split(' ')[1] === "Kana") && !editeur_set) {
                call_set_adn++;
                set_to_watch_list_adn(elem, title_alt);
                editeur_set = true;
              } else if (editeur.split(' ')[1] === "Crunchyroll" && !editeur_set) {
                call_set_crunchyroll++;
                set_to_watch_list_crunchyroll(elem, title_alt);
                editeur_set = true;
              } else if (section_content.split(' ')[1] === "Wakanim" && !editeur_set) {
                call_set_wakanim++;
                set_to_watch_list_wakanim(elem, title_alt);
                editeur_set = true;
              }

            });
            licencie = false;
          }
        });

      });
    });
  }
}


function refresh() {
  console.log("REFRESH");
  // chrome.notifications.create({
  //   "type": "basic",
  //   "iconUrl": "images/get_started48.png",
  //   "title": "REFRESHING",
  //   "message": "L'extension a été rafraichit"
  // }, function() {
  //   if (chrome.runtime.lastError)
  //     console.log(chrome.runtime.lastError);
  // });
  set_to_watch_list();
  set_watching_anime_list_nautiljon();
  // adn_list = [];
  set_adn_list();
  set_crunchyroll_list();
  set_wakanim_list();


  setTimeout(refresh, 60000);
}

function startup() {
  set_watching_anime_list_nautiljon();
  set_adn_list();
  set_crunchyroll_list();
  set_wakanim_list();

  setTimeout(refresh, 60000);
}


chrome.runtime.onInstalled.addListener(function() {
  running = true;
  console.log("OnInstalled");
  chrome.storage.sync.clear();
  startup();
  chrome.alarms.create("check_running", {
    'periodInMinutes': 1
  });
});

//also get the last dates pls
chrome.runtime.onStartup.addListener(function() {
  running = true;
  console.log("OnStartup");
  chrome.storage.sync.get(["to_watch_list"], function(result) {
    if (chrome.runtime.lastError)
      console.log(chrome.runtime.lastError);
    else if (result.to_watch_list) {
      to_watch_list = result.to_watch_list;
      running = true;
      refresh();
    }
  });
});


//ADD GET TO EVERY LIST TO SET THEM IN LOCAL AND SET THE LIST IN SYNC WHEN CREATED
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "check_running") {
    if (!running) {
      chrome.storage.sync.get(["to_watch_list"], function(result) {
        if (chrome.runtime.lastError)
          console.log(chrome.runtime.lastError);
        else if (result.to_watch_list) {
          to_watch_list = result.to_watch_list;
          running = true;
          refresh();
        }
      });
    }
  }
});


chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (changes.to_watch_list && changes.to_watch_list.newValue) {
    if (changes.to_watch_list.oldValue) {
      if (changes.to_watch_list.oldValue.length < changes.to_watch_list.newValue.length) {
        changes.to_watch_list.newValue.forEach(function(elem) {
          var inside = false;
          if (changes.to_watch_list.oldValue) {
            changes.to_watch_list.oldValue.forEach(function(elem2) {
              if (elem.title == elem2.title) {
                inside = true;
              }
            });
          }
          if (!inside) {

            if (elem.from == "ADN") {
              chrome.notifications.create({
                "type": "basic",
                "iconUrl": "images/adn.png",
                "title": elem.title,
                "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur ADN!"
              }, callback());

            } else if (elem.from == "Crunchyroll") {
              chrome.notifications.create({
                "type": "basic",
                "iconUrl": "images/crunchyroll.png",
                "title": elem.title,
                "message": "Un nouvel épisode de " + elem.title.split(' - ')[0] + " est sorti sur Crunchyroll!"
              }, callback());
            } else if (elem.from == "Wakanim") {
              chrome.notifications.create({
                "type": "basic",
                "iconUrl": "images/wakanim.jpg",
                "title": elem.title,
                "message": "Un nouvel épisode de " + elem.title.split(' Saison')[0] + " est sorti sur Wakanim!"
              }, callback());
            }
          }
        });
      } else {
        to_watch_list = changes.to_watch_list.newValue;
      }
    }else{

      changes.to_watch_list.newValue.forEach(function(elem) {
        var inside = false;
        if (changes.to_watch_list.oldValue) {
          changes.to_watch_list.oldValue.forEach(function(elem2) {
            if (elem.title == elem2.title) {
              inside = true;
            }
          });
        }
        if (!inside) {

          if (elem.from == "ADN") {
            chrome.notifications.create({
              "type": "basic",
              "iconUrl": "images/adn.png",
              "title": elem.title,
              "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur ADN!"
            }, callback());

          } else if (elem.from == "Crunchyroll") {
            chrome.notifications.create({
              "type": "basic",
              "iconUrl": "images/crunchyroll.png",
              "title": elem.title,
              "message": "Un nouvel épisode de " + elem.title.split(' - ')[0] + " est sorti sur Crunchyroll!"
            }, callback());
          } else if (elem.from == "Wakanim") {
            chrome.notifications.create({
              "type": "basic",
              "iconUrl": "images/wakanim.jpg",
              "title": elem.title,
              "message": "Un nouvel épisode de " + elem.title.split(' Saison')[0] + " est sorti sur Wakanim!"
            }, callback());
          }
        }
      });
    }
  }
});
