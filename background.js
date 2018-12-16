let name_nautiljon;
let watching_anime_list = [];

let adn_list = [];

let crunchyroll_list = [];

let wakanim_list = [];

let to_watch_list = [];

let notification_links = [];
let running;

function callback() {
  if (chrome.runtime.lastError) 
    console.log(chrome.runtime.lastError);
  }

function callback_to_watch_list() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    chrome.browserAction.setBadgeText({text: to_watch_list.length.toString()});
    chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
  }

}

function store_watching_anime_list(watching_anime_list) {
  console.log("storing watching list")
  let nb = sizeof(watching_anime_list) / chrome.storage.sync.QUOTA_BYTES_PER_ITEM;
  if (nb > 3) {
    let div = Math.floor(watching_anime_list.length / 4);
    if (4 * div < watching_anime_list.length) {
      chrome.storage.sync.set({
        'nb_watching_anime_list': 5,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, 3 * div),
        'watching_anime_list4': watching_anime_list.slice(3 * div, 4 * div),
        'watching_anime_list5': watching_anime_list.slice(4 * div, watching_anime_list.length)
      }, callback());
    } else {
      chrome.storage.sync.set({
        'nb_watching_anime_list': 4,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, 3 * div),
        'watching_anime_list4': watching_anime_list.slice(3 * div, 4 * div)
      }, callback());
    }

  } else if (nb > 2) {
    let div = Math.floor(watching_anime_list.length / 3);
    if (3 * div < watching_anime_list.length) {
      chrome.storage.sync.set({
        'nb_watching_anime_list': 4,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, 3 * div),
        'watching_anime_list4': watching_anime_list.slice(3 * div, watching_anime_list.length)
      }, callback());
    } else {
      chrome.storage.sync.set({
        'nb_watching_anime_list': 3,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, 3 * div)
      }, callback());
    }

  } else if (nb > 1) {
    let div = Math.floor(watching_anime_list.length / 2);
    if (2 * div < watching_anime_list.length) {
      chrome.storage.sync.set({
        'nb_watching_anime_list': 3,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, watching_anime_list.length)
      }, callback());
    } else {
      chrome.storage.sync.set({
        'nb_watching_anime_list': 2,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div)
      }, callback());
    }

  } else {
    chrome.storage.sync.set({
      'nb_watching_anime_list': 1,
      'watching_anime_list1': watching_anime_list
    }, callback());
  }

}

function retrieve_watching_anime_list() {
  chrome.storage.sync.get([
    "nb_watching_anime_list",
    "watching_anime_list1",
    "watching_anime_list2",
    "watching_anime_list3",
    "watching_anime_list4",
    "watching_anime_list5"
  ], function(result) {
    if (chrome.runtime.lastError) 
      console.log(chrome.runtime.lastError);
    else {
      watching_anime_list = [];
      if (result.nb_watching_anime_list >= 1) {
        watching_anime_list = watching_anime_list.concat(result.watching_anime_list1);
      }
      if (result.nb_watching_anime_list >= 2) {
        watching_anime_list = watching_anime_list.concat(result.watching_anime_list2);
      }
      if (result.nb_watching_anime_list >= 3) {
        watching_anime_list = watching_anime_list.concat(result.watching_anime_list3);
      }
      if (result.nb_watching_anime_list >= 4) {
        watching_anime_list = watching_anime_list.concat(result.watching_anime_list4);
      }
      if (result.nb_watching_anime_list >= 5) {
        watching_anime_list = watching_anime_list.concat(result.watching_anime_list5);
      }
    }
  });
}

function store_to_watch_list() {
  console.log("storing to watch list");
  let nb = sizeof(to_watch_list) / chrome.storage.sync.QUOTA_BYTES_PER_ITEM;
  if (nb > 3) {
    let div = Math.floor(to_watch_list.length / 4);
    if (4 * div < to_watch_list.length) {
      chrome.storage.sync.set({
        'nb_to_watch_list': 5,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, 3 * div),
        'to_watch_list4': to_watch_list.slice(3 * div, 4 * div),
        'to_watch_list5': to_watch_list.slice(4 * div, to_watch_list.length)
      }, callback_to_watch_list());
    } else {
      chrome.storage.sync.set({
        'nb_to_watch_list': 4,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, 3 * div),
        'to_watch_list4': to_watch_list.slice(3 * div, 4 * div)
      }, callback_to_watch_list());
    }
  } else if (nb > 2) {
    let div = Math.floor(to_watch_list.length / 3);
    if (3 * div < to_watch_list.length) {
      chrome.storage.sync.set({
        'nb_to_watch_list': 4,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, 3 * div),
        'to_watch_list4': to_watch_list.slice(3 * div, to_watch_list.length)
      }, callback_to_watch_list());
    } else {
      chrome.storage.sync.set({
        'nb_to_watch_list': 3,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, 3 * div)
      }, callback_to_watch_list());
    }

  } else if (nb > 1) {
    let div = Math.floor(to_watch_list.length / 2);
    if (2 * div < to_watch_list.length) {
      chrome.storage.sync.set({
        'nb_to_watch_list': 3,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, to_watch_list.length)
      }, callback_to_watch_list());
    } else {
      chrome.storage.sync.set({
        'nb_to_watch_list': 2,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div)
      }, callback_to_watch_list());
    }

  } else {
    chrome.storage.sync.set({
      'nb_to_watch_list': 1,
      'to_watch_list1': to_watch_list
    }, callback_to_watch_list());
  }
}

function retrieve_to_watch_list() {
  chrome.storage.sync.get([
    "nb_to_watch_list",
    "to_watch_list1",
    "to_watch_list2",
    "to_watch_list3",
    "to_watch_list4",
    "to_watch_list5"
  ], function(result) {
    if (chrome.runtime.lastError) 
      console.log(chrome.runtime.lastError);
    else {
      to_watch_list = [];
      if (result.nb_to_watch_list >= 1) {
        to_watch_list = to_watch_list.concat(result.to_watch_list1);
      }
      if (result.nb_to_watch_list >= 2) {
        to_watch_list = to_watch_list.concat(result.to_watch_list2);
      }
      if (result.nb_to_watch_list >= 3) {
        to_watch_list = to_watch_list.concat(result.to_watch_list3);
      }
      if (result.nb_to_watch_list >= 4) {
        to_watch_list = to_watch_list.concat(result.to_watch_list4);
      }
      if (result.nb_to_watch_list >= 5) {
        to_watch_list = to_watch_list.concat(result.to_watch_list5);
      }

      chrome.browserAction.setBadgeText({text: to_watch_list.length.toString()});
      chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
    }
  });
}

//TODO a revoir
//TODO ne pas construire item avant de verifier s'il sera a ajouter
//TODO remove item in list when not on nautiljon anymore
function set_watching_anime_list_nautiljon(fonction) {
  console.log("calculating watching list");
  chrome.storage.sync.get(["name_nautiljon"], function(result) {
    if (result.name_nautiljon) {
      $.get("https://www.nautiljon.com/membre/vu," + result.name_nautiljon + ",anime.html?format=&statut=1", function(data) {
        var animes = [];
        $(data).find("tbody").each(function() {
          $(this).find("tr").each(function() {

            var animes = $(this).find("td");

            var licence = null;

            $.get("https://www.nautiljon.com" + animes[0].childNodes[0].getAttribute("href"), function(data2) {

              var info;
              var ul_array = $(data2).find("ul");
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
              for (var j = 0; j < info.length; j++) {
                var elem_li = info[j];

                var section = elem_li.textContent.split(" : ");
                var section_title = section.shift();
                var section_content = section.join(' : ');

                if (section_title === "Titre alternatif") {
                  title_alt = section_content;
                } else if (section_title === "Licencié en France") {
                  licencie = true;
                } else if (licencie && section_title === "Editeur") {
                  licence = section_content.split(' ')[1]

                  licencie = false;
                } else if (licencie && section_title === "Editeurs") {

                  var table = [];

                  editeurs = section_content.split(" -");

                  for (var m = 0; m < editeurs.length; m++) {
                    table.push(editeurs[m].split(" ")[1]);
                  }
                  licence = table.join(" - ");

                  licencie = false;
                }
              }

              let image = $(data2).find("#onglets_3_image");
              if (image.length > 0) {
                image = image[0].childNodes[0].getAttribute("src");
              }

              let synopsis = $(data2).find(".description")[0].textContent;
              if (synopsis.length > 300) 
                synopsis = synopsis.substring(0, 300) + "...";
              var item = {
                title: animes[0].childNodes[0].text,
                watched_episodes: animes[2].textContent.split(" /")[0],
                editeur: licence,
                title_alt: title_alt,
                image: "https://www.nautiljon.com" + image,
                link: "https://www.nautiljon.com" + animes[0].childNodes[0].getAttribute("href"),
                description: synopsis,
                last_ep_notify: 0
              }
              var add_to_list = true;

              for (var i = 0; add_to_list && i < watching_anime_list.length; i++) {
                if (watching_anime_list[i].title == item.title) 
                  add_to_list = false;
                }
              if (add_to_list) {
                watching_anime_list.push(item);
                watching_anime_list.sort(function(a, b) {
                  return a.title.localeCompare(b.title);
                });
                store_watching_anime_list(watching_anime_list);
              }
            });
          });
        });
      });
    }
  })
}

function set_adn_list() {
  adn_list = [];
  $.get("https://animedigitalnetwork.fr/rss", function(data) {
    var items = [];
    $(data).find("item").each(function() {
      var img = $(this).find("enclosure")[0].getAttribute("url");
      if (!img.includes("http")) {
        img = "https:" + img;
      }
      var item = {
        title: $(this).find("title").text(),
        link: $(this).find("link").text(),
        img: img,
        from: "ADN"
      };
      adn_list.push(item);
    });
  })
}

function set_crunchyroll_list() {
  crunchyroll_list = [];
  $.get("https://www.crunchyroll.com/rss?lang=frFR", function(data) {
    var items = [];
    $(data).find("item").each(function() {
      var image;
      var image_set = false;
      var seriesTitle;
      $(this)[0].childNodes.forEach(function(elem) {
        if (!image_set && elem.nodeName == "media:thumbnail") {
          image = elem.getAttribute("url");
          image_set = true;
        } else if (elem.nodeName == "crunchyroll:seriesTitle") {
          seriesTitle = elem.textContent;
        }
      });
      var item = {
        title: $(this).find("title").text(),
        link: $(this).find("link").text(),
        img: image,
        seriesTitle: seriesTitle,
        from: "Crunchyroll"
      };
      crunchyroll_list.push(item);
    });
  });
}

function set_wakanim_list() {
  wakanim_list = [];
  $.get("https://www.wakanim.tv/fr/v2", function(data) {
    var items = new Array();
    $(data).each(function(elem) {
      if ($(this)[0].nodeName.toLowerCase() == "section" && $(this)[0].classList[0] == "slider-section") {
        $(this)[0].childNodes.forEach(function(elem) {
          if (elem.nodeName.toLowerCase() == "div" && elem.classList[0] == "container") {
            var right_section = false;
            elem.childNodes.forEach(function(elem2) {
              if (elem2.nodeName.toLowerCase() == "header" && elem2.classList.value == "slider-section_header") {
                if (elem2.children[0].nodeName.toLowerCase() == "h2" && elem2.children[0].classList.value == "slider-section_title") {
                  if (elem2.children[0].textContent == "Derniers épisodes diffusés") {
                    right_section = true;
                  }
                }
              }
              if (right_section && elem2.nodeName.toLowerCase() == "div" && elem2.classList.value == "slider js-slider js-slider-lastEp") {
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
                  wakanim_list.push(item);
                }
                right_section = false;
              }
            });
          }
        });
      }
    });
  });
}

function set_to_watch_list_adn(item) {
  if (adn_list) {
    var titles = item.title.toLowerCase();
    if (item.title_alt) 
      titles = titles.concat(" /", item.title_alt.toLowerCase());
    
    for (var i = adn_list.length - 1; i >= 0; i--) {
      var elem = adn_list[i];
      if (elem.title.includes("Épisode")) {

        var true_title = elem.title.split(" Épisode")[0].toLowerCase();
        true_title = true_title.replace("’", "'");
        let num_ep = parseInt(elem.title.split(" Épisode ")[1].split(" ")[0]);
        if (titles.includes(true_title)) {
          if (item.last_ep_notify < num_ep) {
            item.last_ep_notify = num_ep;
            to_watch_list.push(elem);
            chrome.notifications.create({
              "type": "basic",
              "iconUrl": "images/adn.png",
              "title": elem.title,
              "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur ADN!"
            }, function push_notif(notificationId) {
              notification_links.push({id: notificationId, url: elem.link});
            });
            store_to_watch_list();
            store_watching_anime_list(watching_anime_list);
          }
        }
      }
    }
  }
}

function set_to_watch_list_crunchyroll(item) {
  if (crunchyroll_list) {
    var titles = item.title.toLowerCase();
    if (titles.includes("(")) 
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (item.title_alt) 
      titles = titles.concat(" /", item.title_alt.toLowerCase());
    for (var i = crunchyroll_list.length - 1; i >= 0; i--) {
      var elem = crunchyroll_list[i];
      let num_ep = parseInt(elem.title.split(" - ")[1].split(" ")[1]);
      if (titles.includes(elem.seriesTitle.toLowerCase())) {
        if (item.last_ep_notify < num_ep) {
          item.last_ep_notify = num_ep;
          to_watch_list.push(elem);
          chrome.notifications.create({
            "type": "basic",
            "iconUrl": "images/crunchyroll.png",
            "title": elem.title,
            "message": "Un nouvel épisode de " + elem.title.split(' - ')[0] + " est sorti sur Crunchyroll!"
          }, function push_notif(notificationId) {
            notification_links.push({id: notificationId, url: elem.link});
          });
          store_to_watch_list();
          store_watching_anime_list(watching_anime_list);
        }
      }
    }
  }
}

function set_to_watch_list_wakanim(item) {
  if (wakanim_list) {
    var titles = item.title.toLowerCase();
    if (titles.includes("(")) 
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (item.title_alt) 
      titles = titles.concat(" /", item.title_alt.toLowerCase());
    
    for (var i = wakanim_list.length - 1; i >= 0; i--) {
      elem = wakanim_list[i];
      if (elem.title.includes("Épisode")) {

        var true_title = elem.title;
        let num_ep = parseInt(elem.title.split("Épisode ")[1]);
        if (true_title.includes("-")) 
          true_title = true_title.split(" -")[0];
        if (titles.includes(true_title.split(" Saison")[0].toLowerCase()) || titles.includes(true_title.split(" Arc")[0].toLowerCase())) {
          if (item.last_ep_notify < num_ep) {
            item.last_ep_notify = num_ep;
            to_watch_list.push(elem);
            chrome.notifications.create({
              "type": "basic",
              "iconUrl": "images/wakanim.jpg",
              "title": elem.title,
              "message": "Un nouvel épisode de " + elem.title.split(' Saison')[0] + " est sorti sur Wakanim!"
            }, function push_notif(notificationId) {
              notification_links.push({id: notificationId, url: elem.link});
            });
            store_to_watch_list();
            store_watching_anime_list(watching_anime_list);
          }
        }
      }
    }

  }
}

function set_to_watch_list() {
  if (watching_anime_list) {
    for (var i = 0; i < watching_anime_list.length; i++) {
      var elem = watching_anime_list[i];
      editeurs = elem.editeur.split(" - ");
      editeur_found = false;
      for (var j = 0; !editeur_found && j < editeurs.length; j++) {
        if (editeurs[j] === "ADN" || editeurs[j] === "Kana") {
          set_to_watch_list_adn(elem);
          editeur_found = true;
        } else if (editeurs[j] === "Wakanim") {
          set_to_watch_list_wakanim(elem);
          editeur_found = true;
        } else if (editeurs[j] === "Crunchyroll") {
          set_to_watch_list_crunchyroll(elem);
          editeur_found = true;
        }
      }
    }
  }
}

function startup() {
  // set_watching_anime_list_nautiljon();
  set_adn_list();
  set_crunchyroll_list();
  set_wakanim_list();
  setTimeout(set_to_watch_list, 60000);
  // setTimeout(refresh, 300000);
  // setTimeout(startup, 30000);
  setTimeout(startup, 70000);
}
chrome.runtime.onInstalled.addListener(function() {
  console.log("OnInstalled"); // chrome.storage.sync.clear();
  retrieve_watching_anime_list();
  retrieve_to_watch_list();
  chrome.storage.sync.get(["name_nautiljon"], function(result) {
    if (chrome.runtime.lastError) 
      console.log(chrome.runtime.lastError);
    else {
      if (result.name_nautiljon) 
        name_nautiljon = result.name_nautiljon;
      }
    startup();
    running = true;
  });
  chrome.alarms.create("check_running", {'periodInMinutes': 1});
}); //also get the last dates pls
chrome.runtime.onStartup.addListener(function() {
  console.log("OnStartup");
  retrieve_watching_anime_list();
  retrieve_to_watch_list();
  chrome.storage.sync.get(["name_nautiljon"], function(result) {
    if (chrome.runtime.lastError) 
      console.log(chrome.runtime.lastError);
    else {
      if (result.name_nautiljon) 
        name_nautiljon = result.name_nautiljon;
      running = true;
      startup();
    }
  });
});
//ADD GET TO EVERY LIST TO SET THEM IN LOCAL AND SET THE LIST IN SYNC WHEN CREATED
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "check_running") {
    if (!running) {
      retrieve_watching_anime_list();
      retrieve_to_watch_list();
      chrome.storage.sync.get(["name_nautiljon"], function(result) {
        if (chrome.runtime.lastError) 
          console.log(chrome.runtime.lastError);
        else {
          if (result.name_nautiljon) 
            name_nautiljon = result.name_nautiljon;
          running = true;
          refresh();
        }
      });
    }
  }
});
chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (changes.nb_to_watch_list || changes.to_watch_list1 || changes.to_watch_list2 || changes.to_watch_list3 || changes.to_watch_list4 || changes.to_watch_list5) {
    retrieve_to_watch_list();
  }
});
chrome.notifications.onClicked.addListener(function(notificationId) {
  notification_links.forEach(function(elem) {
    if (elem.id == notificationId) {
      chrome.tabs.create({'url': elem.url});
    }
  });
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.request == "refreshWatching") {
    set_watching_anime_list_nautiljon();
  } else if (request.request == "settingNautiljon" && request.pseudo) {
    chrome.storage.sync.remove([
      "name_nautiljon",
      "nb_watching_anime_list",
      "watching_anime_list1",
      "watching_anime_list2",
      "watching_anime_list3",
      "watching_anime_list4",
      "watching_anime_list5"
    ], function() {
      chrome.storage.sync.set({
        "name_nautiljon": request.pseudo
      }, function() {
        set_watching_anime_list_nautiljon();
        sendResponse();
      });
    });
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (changes.nb_to_watch_list || changes.to_watch_list1 || changes.to_watch_list2 || changes.to_watch_list3 || changes.to_watch_list4 || changes.to_watch_list5) {
    retrieve_to_watch_list();
    retrieve_watching_anime_list();
  } else if (changes.nb_watching_anime_list || changes.watching_anime_list1 || changes.watching_anime_list2 || changes.watching_anime_list3 || changes.watching_anime_list4 || changes.watching_anime_list5) {
    retrieve_watching_anime_list();
  }
});
