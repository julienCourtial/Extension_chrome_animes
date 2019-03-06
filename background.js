// Username of user on nautiljon website
let name_nautiljon;

// List of anime series the user is currently watching
let watching_anime_list = [];
let old_watching = [];

// List of episodes released on ADN
let adn_list = [];

// List of episodes released on Crunchyroll
let crunchyroll_list = [];

// List of episodes released on Wakanim
let wakanim_list = [];

// List of episodes released that the user didn't watch
let to_watch_list = [];
let old_to_watch = [];

// List of notifications
let notification_links_and_id = [];

// List of url of each episode in to_watch_list
let links = [];

//
let running;

// Standard callback function
function callback(error) {
  console.error(error);
}

// Callback function used when setting to_watch_list
// Updating the extension badge
function callback_to_watch_list() {
  browser.browserAction.setBadgeText({
    text: to_watch_list.length.toString()
  });
  browser.browserAction.setBadgeBackgroundColor({
    color: '#4688F1'
  });

}


function callback_to_watch_list_error(error) {
  console.error(error);
}

// Create a notification depending on the website the episodes were released
//  and add the link and id in the notification_links_and_id list
function createNotif(elem) {
  let creating;
  if (elem.from == "ADN") {
    creating = browser.notifications.create({
      "type": "basic",
      "iconUrl": "images/adn.png",
      "title": elem.title,
      "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur ADN!"
    });


  } else if (elem.from == "Crunchyroll") {
    creating = browser.notifications.create({
      "type": "basic",
      "iconUrl": "images/crunchyroll.png",
      "title": elem.title,
      "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur Crunchyroll!"
    });
  } else if (elem.from == "Wakanim") {
    creating = browser.notifications.create({
      "type": "basic",
      "iconUrl": "images/wakanim.jpg",
      "title": elem.title,
      "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur Wakanim!"
    });
  }
  creating.then(function push_notif(notificationId) {
    notification_links_and_id.push({
      id: notificationId,
      url: elem.link
    });
  });
}

// Store the watching_anime list by dividing it depending on the list size and
// the QUOTA BYTES PER ITEM from browser storage
function store_watching_anime_list() {
  console.log("storing watching list")
  let nb = sizeof(watching_anime_list) / browser.storage.sync.QUOTA_BYTES_PER_ITEM;
  let setting;
  if (nb > 3) {
    let div = Math.floor(watching_anime_list.length / 4);
    if (4 * div < watching_anime_list.length) {
      setting = browser.storage.sync.set({
        'nb_watching_anime_list': 5,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, 3 * div),
        'watching_anime_list4': watching_anime_list.slice(3 * div, 4 * div),
        'watching_anime_list5': watching_anime_list.slice(4 * div, watching_anime_list.length)
      });
    } else {
      setting = browser.storage.sync.set({
        'nb_watching_anime_list': 4,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, 3 * div),
        'watching_anime_list4': watching_anime_list.slice(3 * div, 4 * div)
      });
    }

  } else if (nb > 2) {
    let div = Math.floor(watching_anime_list.length / 3);
    if (3 * div < watching_anime_list.length) {
      setting = browser.storage.sync.set({
        'nb_watching_anime_list': 4,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, 3 * div),
        'watching_anime_list4': watching_anime_list.slice(3 * div, watching_anime_list.length)
      });
    } else {
      setting = browser.storage.sync.set({
        'nb_watching_anime_list': 3,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, 3 * div)
      });
    }

  } else if (nb > 1) {
    let div = Math.floor(watching_anime_list.length / 2);
    if (2 * div < watching_anime_list.length) {
      setting = browser.storage.sync.set({
        'nb_watching_anime_list': 3,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div),
        'watching_anime_list3': watching_anime_list.slice(2 * div, watching_anime_list.length)
      });
    } else {
      setting = browser.storage.sync.set({
        'nb_watching_anime_list': 2,
        'watching_anime_list1': watching_anime_list.slice(0, div),
        'watching_anime_list2': watching_anime_list.slice(div, 2 * div)
      });
    }

  } else {
    setting = browser.storage.sync.set({
      'nb_watching_anime_list': 1,
      'watching_anime_list1': watching_anime_list
    });
  }
  setting.then(() => {}, callback);

}

// Retrieve the watching anime list from each part on the browser storage
function retrieve_watching_anime_list() {
  browser.storage.sync.get([
    "nb_watching_anime_list",
    "watching_anime_list1",
    "watching_anime_list2",
    "watching_anime_list3",
    "watching_anime_list4",
    "watching_anime_list5"
  ]).then(function(result) {

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

  }, callback);
}


// Store the to_watch list by dividing it depending on the list size and
// the QUOTA BYTES PER ITEM from browser storage
function store_to_watch_list() {
  console.log("storing to watch list");
  let nb = sizeof(to_watch_list) / browser.storage.sync.QUOTA_BYTES_PER_ITEM;
  let setting;
  if (nb > 3) {
    let div = Math.floor(to_watch_list.length / 4);
    if (4 * div < to_watch_list.length) {
      setting = browser.storage.sync.set({
        'nb_to_watch_list': 5,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, 3 * div),
        'to_watch_list4': to_watch_list.slice(3 * div, 4 * div),
        'to_watch_list5': to_watch_list.slice(4 * div, to_watch_list.length)
      });
    } else {
      setting = browser.storage.sync.set({
        'nb_to_watch_list': 4,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, 3 * div),
        'to_watch_list4': to_watch_list.slice(3 * div, 4 * div)
      });
    }
  } else if (nb > 2) {
    let div = Math.floor(to_watch_list.length / 3);
    if (3 * div < to_watch_list.length) {
      setting = browser.storage.sync.set({
        'nb_to_watch_list': 4,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, 3 * div),
        'to_watch_list4': to_watch_list.slice(3 * div, to_watch_list.length)
      });
    } else {
      setting = browser.storage.sync.set({
        'nb_to_watch_list': 3,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, 3 * div)
      });
    }

  } else if (nb > 1) {
    let div = Math.floor(to_watch_list.length / 2);
    if (2 * div < to_watch_list.length) {
      setting = browser.storage.sync.set({
        'nb_to_watch_list': 3,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div),
        'to_watch_list3': to_watch_list.slice(2 * div, to_watch_list.length)
      });
    } else {
      setting = browser.storage.sync.set({
        'nb_to_watch_list': 2,
        'to_watch_list1': to_watch_list.slice(0, div),
        'to_watch_list2': to_watch_list.slice(div, 2 * div)
      });
    }

  } else {
    setting = browser.storage.sync.set({
      'nb_to_watch_list': 1,
      'to_watch_list1': to_watch_list
    });
  }
  setting.then(callback_to_watch_list, callback_to_watch_list_error);
}

// Retrieve the to_watch list from each part on the browser storage and create a
// notification if there are new epiosodes from another machine
function retrieve_to_watch_list() {
  browser.storage.sync.get([
    "nb_to_watch_list",
    "to_watch_list1",
    "to_watch_list2",
    "to_watch_list3",
    "to_watch_list4",
    "to_watch_list5"
  ]).then(function(result) {

    old_to_watch = to_watch_list;
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

    browser.browserAction.setBadgeText({
      text: to_watch_list.length.toString()
    });
    browser.browserAction.setBadgeBackgroundColor({
      color: '#4688F1'
    });

    //Compare the old list with the new one just retrieved and compare both of
    // them to see if there are new episodes
    if (old_to_watch.length != 0 && old_to_watch.length < to_watch_list.length) {
      let last_elem = old_to_watch[old_to_watch.length - 1];
      let last_index = to_watch_list.findIndex(function(elem) {
        return elem.title == last_elem.title;
      });
      for (let i = last_index + 1; i < to_watch_list.length; i++) {
        createNotif(to_watch_list[i]);
      }
    }


  }, callback);
}

// Retrieve the watching_anime list from the user list on the nautiljon website
function set_watching_anime_list_nautiljon() {
  // If the user set is nautiljon's username we can retrieve the list
  browser.storage.sync.get(["name_nautiljon"]).then(function(result) {
    if (result.name_nautiljon) {
      // Request the page of the user list on nautiljon
      $.get("https://www.nautiljon.com/membre/vu," + result.name_nautiljon + ",anime.html?format=&statut=1", function(data) {
        old_watching = watching_anime_list;
        watching_anime_list = [];
        var animes = [];
        let list = $($(data).find("tbody")[0]).find("tr");
        let size = list.length;

        // Loop on the anime list from page and retrieve everything that is needed
        list.each(function() {

          var animes = $(this).find("td");

          var licence = null;

          var already_in = false;

          for (var i = 0; !already_in && i < old_watching.length; i++) {
            if (old_watching[i].title == animes[0].childNodes[0].text) {
              already_in = true;
              watching_anime_list.push(old_watching[i]);
              watching_anime_list.sort(function(a, b) {
                return a.title.localeCompare(b.title);
              });
              if (watching_anime_list.length == size) {
                store_watching_anime_list();
              }
            }
          }
          if (!already_in) {
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
                editeur: licence,
                title_alt: title_alt,
                image: "https://www.nautiljon.com" + image,
                link: "https://www.nautiljon.com" + animes[0].childNodes[0].getAttribute("href"),
                description: synopsis,
                last_ep_notify: 0
              }
              watching_anime_list.push(item);
              watching_anime_list.sort(function(a, b) {
                return a.title.localeCompare(b.title);
              });
              if (watching_anime_list.length == size) {
                store_watching_anime_list();
              }

            });

          }

        });
      });
    }
  }, callback)
}

// Construct the ADN list from the RSS
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

// Construct the Crunchyroll list from the RSS
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
      let link = $(this).find("link").text().replace("http", "https");
      if (link.includes('/fr/')) {
        link.replace("www.crunchyroll.com/", "www.crunchyroll.com/fr/");
      }
      var item = {
        title: $(this).find("title").text(),
        link: link,
        img: image,
        seriesTitle: seriesTitle,
        from: "Crunchyroll"
      };
      crunchyroll_list.push(item);
    });
  });
}

// Since there is no RSS for Wakanim, construct the list from the front page of Wakanim.
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

// Look in the ADN list if the serie given has a new episode released
function set_to_watch_list_adn(serie) {
  if (adn_list) {
    var titles = serie.title.toLowerCase();
    if (serie.title_alt)
      titles = titles.concat(" /", serie.title_alt.toLowerCase());

    for (var i = adn_list.length - 1; i >= 0; i--) {
      let elem = adn_list[i];
      if (elem.title.includes("Épisode")) {

        var true_title = elem.title.split(" Épisode")[0].toLowerCase();
        true_title = true_title.replace("’", "'");
        let num_ep = parseInt(elem.title.split(" Épisode ")[1].split(" ")[0]);
        if (titles.includes(true_title)) {
          if (serie.last_ep_notify < num_ep) {
            serie.last_ep_notify = num_ep;
            to_watch_list.push(elem);
            createNotif(elem);
            store_to_watch_list();
            store_watching_anime_list();
            links.push(elem.link);
            browser.storage.sync.set({
              "links": links
            }).then(() => {}, callback);
          }
        }
      }
    }
  }
}

// Look in the Crunchyroll list if the serie given has a new episode released
function set_to_watch_list_crunchyroll(serie) {
  if (crunchyroll_list) {
    var titles = serie.title.toLowerCase();
    if (titles.includes("("))
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (serie.title_alt)
      titles = titles.concat(" /", serie.title_alt.toLowerCase());
    for (var i = crunchyroll_list.length - 1; i >= 0; i--) {
      let elem = crunchyroll_list[i];
      let num_ep = parseInt(elem.title.split(" - ")[1].split(" ")[1]);
      if (titles.includes(elem.seriesTitle.toLowerCase())) {
        if (serie.last_ep_notify < num_ep) {
          serie.last_ep_notify = num_ep;
          to_watch_list.push(elem);
          createNotif(elem);
          store_to_watch_list();
          store_watching_anime_list();
          links.push(elem.link);
          browser.storage.sync.set({
            "links": links
          });
        }
      }
    }
  }
}

// Look in the Wakanim list if the serie given has a new episode released
function set_to_watch_list_wakanim(serie) {
  if (wakanim_list) {
    var titles = serie.title.toLowerCase();
    if (titles.includes("("))
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (serie.title_alt)
      titles = titles.concat(" /", serie.title_alt.toLowerCase());

    for (var i = wakanim_list.length - 1; i >= 0; i--) {
      let elem = wakanim_list[i];
      if (elem.title.includes("Épisode")) {

        var true_title = elem.title;
        let num_ep = parseInt(elem.title.split("Épisode ")[1]);
        if (true_title.includes("-"))
          true_title = true_title.split(" -")[0];
        if (titles.includes(true_title.split(" Saison")[0].toLowerCase()) || titles.includes(true_title.split(" Arc")[0].toLowerCase())) {
          if (serie.last_ep_notify < num_ep) {
            serie.last_ep_notify = num_ep;
            to_watch_list.push(elem);
            createNotif(elem);
            store_to_watch_list();
            store_watching_anime_list();
            links.push(elem.link);
            browser.storage.sync.set({
              "links": links
            }).then(() => {}, callback);
          }
        }
      }
    }

  }
}

// Loop on the watching anime list and call the set to watch function corresponding to the
//  editor of the anime
function set_to_watch_list() {
  if (watching_anime_list) {
    for (var i = 0; i < watching_anime_list.length; i++) {
      let elem = watching_anime_list[i];
      if (elem.editeur != null) {
        editeurs = elem.editeur.split(" - ");
      } else {
        editeurs = [];
      }
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
  set_adn_list();
  set_crunchyroll_list();
  set_wakanim_list();
  setTimeout(set_to_watch_list, 60000);
  setTimeout(startup, 70000);
}
browser.runtime.onInstalled.addListener(function() {
  console.log("OnInstalled"); // browser.storage.sync.clear();
  retrieve_watching_anime_list();
  retrieve_to_watch_list();
  browser.storage.sync.get([
    "name_nautiljon", "links"
  ]).then(function(result) {

    if (result.name_nautiljon)
      name_nautiljon = result.name_nautiljon;

    if (result.links) {
      links = result.links;
    }
    startup();
    running = true;
  }, callback);
  browser.alarms.create("check_running", {
    'periodInMinutes': 1
  });
}); //also get the last dates pls
browser.runtime.onStartup.addListener(function() {
  console.log("OnStartup");
  retrieve_watching_anime_list();
  retrieve_to_watch_list();
  browser.storage.sync.get([
    "name_nautiljon", "links"
  ]).then(function(result) {

    if (result.name_nautiljon) {
      name_nautiljon = result.name_nautiljon;
    }

    if (result.links) {
      links = result.links;
    }
    running = true;
    startup();

  }, callback);
});
//ADD GET TO EVERY LIST TO SET THEM IN sync AND SET THE LIST IN sync WHEN CREATED
browser.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "check_running") {
    if (!running) {
      retrieve_watching_anime_list();
      retrieve_to_watch_list();
      browser.storage.sync.get(["name_nautiljon"]).then(function(result) {

        if (result.name_nautiljon)
          name_nautiljon = result.name_nautiljon;
        running = true;
        refresh();

      }, callback);
    }
  }
});

browser.notifications.onClicked.addListener(function(notificationId) {
  notification_links_and_id.forEach(function(elem) {
    if (elem.id == notificationId) {
      browser.tabs.create({
        'url': elem.url
      });
    }
  });
});
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.request == "refreshWatching") {
    set_watching_anime_list_nautiljon();
  } else if (request.request == "settingNautiljon" && request.pseudo) {
    browser.storage.sync.remove([
      "name_nautiljon",
      "nb_watching_anime_list",
      "watching_anime_list1",
      "watching_anime_list2",
      "watching_anime_list3",
      "watching_anime_list4",
      "watching_anime_list5"
    ]).then(function() {
      browser.storage.sync.set({
        "name_nautiljon": request.pseudo
      }).then(function() {
        set_watching_anime_list_nautiljon();
        sendResponse();
      }, callback);
    }, callback);
  } else if (request.request == "episodeSeen" && request.url) {
    var index = to_watch_list.findIndex(function(element) {
      if (element.link == request.url) {
        return true;
      }
      return false;
    });
    if (index != -1) {
      to_watch_list.splice(index, 1);
      store_to_watch_list();
    }

    index = links.findIndex(function(element) {
      if (element == request.url) {
        return true;
      }
      return false;
    });
    if (index != -1) {
      links.splice(index, 1);
      browser.storage.sync.set({
        "links": links
      }).then(() => {}, callback);
    }
  }
});

browser.storage.onChanged.addListener(function(changes, areaName) {
  if (changes.nb_to_watch_list || changes.to_watch_list1 || changes.to_watch_list2 || changes.to_watch_list3 || changes.to_watch_list4 || changes.to_watch_list5) {
    retrieve_to_watch_list();
    retrieve_watching_anime_list();
  } else if (changes.nb_watching_anime_list || changes.watching_anime_list1 || changes.watching_anime_list2 || changes.watching_anime_list3 || changes.watching_anime_list4 || changes.watching_anime_list5) {
    retrieve_watching_anime_list();
  } else if (changes.links) {
    links = changes.links.newValue;
  }
});