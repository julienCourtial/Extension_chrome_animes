let watching_anime_list = [];

let adn_list = [];
let last_ep_adn;

let crunchyroll_list = [];
let last_ep_crunchyroll;

let wakanim_list = [];
let last_ep_wakanim;

let to_watch_list = [];

let notification_links = [];
let running;

function callback() {
  if (chrome.runtime.lastError)
    console.log(chrome.runtime.lastError);
}

//TODO a revoir
function set_watching_anime_list_nautiljon() {
  $.get("https://www.nautiljon.com/membre/vu,jarlax,anime.html?format=&statut=1", function(data) {
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
            var section_content = section.join('');

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

          var item = {
            title: animes[0].childNodes[0].text,
            watched_episodes: animes[2].textContent.split(" /")[0],
            editeur: licence,
            title_alt: title_alt
          }
          var add_to_list = true;

          for (var i = 0; i < watching_anime_list.length; i++) {
            if (watching_anime_list[i].title == item.title)
              add_to_list = false;
          }

          if (add_to_list) {
            watching_anime_list.push(item);
            chrome.storage.sync.set({
              'watching_anime_list': watching_anime_list
            }, callback());
          }

        });

      });

    });

  });
}

function set_adn_list() {
  var after_last = false;
  for (var i = adn_list.length - 1; i >= 0; i--) {
    if (after_last)
      adn_list.splice(i, 1);
    else if (adn_list[i].title == last_ep_adn.title) {
      after_last = true;
      adn_list.splice(i, 1);
    }

  }

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
      items.push(item);
    });

    items.reverse();
    if (!last_ep_adn) {
      for (var i = 0; i < items.length; i++) {
        adn_list.push(items[i]);
        last_ep_adn = items[i];
      }
    } else {
      var after_last = false;
      for (var i = 0; i < items.length; i++) {
        if (after_last) {
          adn_list.push(items[i]);
          last_ep_adn = items[i];
        } else if (items[i].title == last_ep_adn.title) {
          after_last = true;
        }
      }
      if (!after_last) {
        items.forEach(function(elem) {
          adn_list.push(elem);
          last_ep_adn = elem;
        });
      }
    }
    chrome.storage.sync.set({
      "last_ep_adn": last_ep_adn
    }, callback());

  })
}

function set_crunchyroll_list() {

  var after_last = false;
  for (var i = crunchyroll_list.length - 1; i >= 0; i--) {
    if (after_last)
      crunchyroll_list.splice(i, 1);
    else if (crunchyroll_list[i].title == last_ep_crunchyroll.title) {
      after_last = true;
      crunchyroll_list.splice(i, 1);
    }

  }

  $.get("http://www.crunchyroll.com/rss?lang=frFR", function(data) {
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
        date: new Date($(this).find("pubDate").text()),
        from: "Crunchyroll"
      };
      items.push(item);

    });

    items.reverse();
    if (!last_ep_crunchyroll) {
      for (var i = 0; i < items.length; i++) {
        crunchyroll_list.push(items[i]);
        last_ep_crunchyroll = items[i];
      }
    } else {
      var after_last = false;
      for (var i = 0; i < items.length; i++) {
        if (after_last) {
          crunchyroll_list.push(items[i]);
          last_ep_crunchyroll = items[i];
        } else if (items[i].title == last_ep_crunchyroll.title) {
          after_last = true;
        }
      }

      if (!after_last) {
        items.forEach(function(elem) {
          crunchyroll.push(elem);
          last_ep_crunchyroll = elem;
        });
      }
    }
    chrome.storage.sync.set({
      "last_ep_crunchyroll": last_ep_crunchyroll
    }, callback());

  });
}

function set_wakanim_list() {

  var after_last = false;
  for (var i = wakanim_list.length - 1; i >= 0; i--) {
    if (after_last)
      wakanim_list.splice(i, 1);
    else if (wakanim_list[i].title == last_ep_wakanim.title) {
      after_last = true;
      wakanim_list.splice(i, 1);
    }

  }

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
                  items.push(item);

                }
                right_section = false;
              }
            });
          }
        });

      }

    });
    items.reverse();
    if (!last_ep_wakanim) {
      for (var i = 0; i < items.length; i++) {
        wakanim_list.push(items[i]);
        last_ep_wakanim = items[i];
      }
    } else {
      var after_last = false;
      for (var i = 0; i < items.length; i++) {
        if (after_last) {
          wakanim_list.push(items[i]);
          last_ep_wakanim = items[i];
        } else if (items[i].title == last_ep_wakanim.title) {
          after_last = true;
        }
      }

      if (!after_last) {
        items.forEach(function(elem) {
          wakanim_list.push(elem);
          last_ep_wakanim = elem;
        });
      }
    }
    chrome.storage.sync.set({
      "last_ep_wakanim": last_ep_wakanim
    }, callback());

  });
}

function set_to_watch_list_adn(item) {
  if (adn_list) {

    var titles = item.title.toLowerCase();
    if (item.title_alt)
      titles = titles.concat(" /", item.title_alt.toLowerCase());
    adn_list.forEach(function(elem) {
      if (titles.includes(elem.title.split(" Épisode")[0].toLowerCase())) {
        var add_to_list = true;
        for (var i = 0; add_to_list && i < to_watch_list.length; i++) {
          if (to_watch_list[i].title == elem.title) {

            add_to_list = false;
          }

        }
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

  }
}

function set_to_watch_list_crunchyroll(item) {
  if (crunchyroll_list) {

    var titles = item.title.toLowerCase()
    if (titles.includes("("))
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (item.title_alt)
      titles = titles.concat(" /", item.title_alt.toLowerCase());
    crunchyroll_list.forEach(function(elem) {
      if (titles.includes(elem.seriesTitle.toLowerCase())) {
        var add_to_list = true;
        for (var i = 0; add_to_list && i < to_watch_list.length; i++) {
          if (to_watch_list[i].title == elem.title) {
            add_to_list = false;
          }
        }
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

  }
}

function set_to_watch_list_wakanim(item) {
  if (wakanim_list) {

    var titles = item.title.toLowerCase()
    if (titles.includes("("))
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (item.title_alt)
      titles = titles.concat(" /", item.title_alt.toLowerCase());
    for (var i = wakanim_list.length - 1; i >= 0; i--) {
      elem = wakanim_list[i];
      if (titles.includes(elem.title.split(" Saison")[0].toLowerCase())) {
        var add_to_list = true;
        for (var j = 0; j < to_watch_list.length; j++) {
          if (to_watch_list[j].title == elem.title)
            add_to_list = false;
        }
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
  set_watching_anime_list_nautiljon();
  set_adn_list();
  set_crunchyroll_list();
  set_wakanim_list();
  setTimeout(set_to_watch_list, 60000);

  // setTimeout(refresh, 300000);
  // setTimeout(startup, 30000);
  setTimeout(startup, 70000);
}

chrome.runtime.onInstalled.addListener(function() {
  console.log("OnInstalled");
  chrome.storage.sync.clear();
  chrome.storage.sync.get([
    "to_watch_list", "last_ep_wakanim", "last_ep_adn", "last_ep_crunchyroll"
  ], function(result) {
    if (chrome.runtime.lastError)
      console.log(chrome.runtime.lastError);
    else {
      if (result.to_watch_list)
        to_watch_list = result.to_watch_list;

      if (result.last_ep_wakanim)
        last_ep_wakanim = result.last_ep_wakanim;

      if (result.last_ep_adn)
        last_ep_adn = result.last_ep_adn;

      if (result.last_ep_crunchyroll)
        last_ep_crunchyroll = result.last_ep_crunchyroll;

      chrome.browserAction.setBadgeText({
        text: to_watch_list.length.toString()
      });
      chrome.browserAction.setBadgeBackgroundColor({
        color: '#4688F1'
      });
    }

    startup();
    running = true;
  });
  chrome.alarms.create("check_running", {
    'periodInMinutes': 1
  });
});

//also get the last dates pls
chrome.runtime.onStartup.addListener(function() {
  console.log("OnStartup");
  chrome.storage.sync.get([
    "to_watch_list", "last_ep_adn", "last_ep_crunchyroll", "last_ep_wakanim"
  ], function(result) {
    if (chrome.runtime.lastError)
      console.log(chrome.runtime.lastError);
    else {
      console.log(result);
      if (result.to_watch_list)
        to_watch_list = result.to_watch_list;

      if (result.last_ep_wakanim)
        last_ep_wakanim = result.last_ep_wakanim;

      if (result.last_ep_adn)
        last_ep_adn = result.last_ep_adn;

      if (result.last_ep_crunchyroll)
        last_ep_crunchyroll = result.last_ep_crunchyroll;

      running = true;
      chrome.browserAction.setBadgeText({
        text: to_watch_list.length.toString()
      });
      chrome.browserAction.setBadgeBackgroundColor({
        color: '#4688F1'
      });
      startup();
    }
  });

});

//ADD GET TO EVERY LIST TO SET THEM IN LOCAL AND SET THE LIST IN SYNC WHEN CREATED
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "check_running") {
    if (!running) {
      chrome.storage.sync.get([
        "to_watch_list", "last_ep_adn", "last_ep_crunchyroll", "last_ep_wakanim"
      ], function(result) {
        if (chrome.runtime.lastError)
          console.log(chrome.runtime.lastError);
        else {

          if (result.to_watch_list)
            to_watch_list = result.to_watch_list;

          if (result.last_ep_wakanim)
            last_ep_wakanim = result.last_ep_wakanim;

          if (result.last_ep_adn)
            last_ep_adn = result.last_ep_adn;

          if (result.last_ep_crunchyroll)
            last_ep_crunchyroll = result.last_ep_crunchyroll;

          running = true;
          chrome.browserAction.setBadgeText({
            text: to_watch_list.length.toString()
          });
          chrome.browserAction.setBadgeBackgroundColor({
            color: '#4688F1'
          });
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
            for (var i = 0; !inside && i < changes.to_watch_list.oldValue.length; i++) {
              if (elem.title == changes.to_watch_list.oldValue[i].title) {
                inside = true;
              }
            }
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
        // console.log(to_watch_list);
      }
    } else {
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
            }, function(notificationId) {
              notification_links.push({
                id: notificationId,
                url: elem.link
              });
            });

          } else if (elem.from == "Crunchyroll") {
            chrome.notifications.create({
              "type": "basic",
              "iconUrl": "images/crunchyroll.png",
              "title": elem.title,
              "message": "Un nouvel épisode de " + elem.title.split(' - ')[0] + " est sorti sur Crunchyroll!"
            }, function(notificationId) {
              notification_links.push({
                id: notificationId,
                url: elem.link
              });
            });
          } else if (elem.from == "Wakanim") {
            chrome.notifications.create({
              "type": "basic",
              "iconUrl": "images/wakanim.jpg",
              "title": elem.title,
              "message": "Un nouvel épisode de " + elem.title.split(' Saison')[0] + " est sorti sur Wakanim!"
            }, function(notificationId) {
              notification_links.push({
                id: notificationId,
                url: elem.link
              });
            });
          }
        }
      });
    }
  }
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  console.log(notification_links);
  notification_links.forEach(function(elem) {
    console.log(notificationId);
    console.log(elem);
    if (elem.id == notificationId) {
      chrome.tabs.create({
        'url': elem.link
      });

    }
  });
});
