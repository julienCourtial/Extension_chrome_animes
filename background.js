let name_nautiljon;
let watching_anime_list = [];
let old_watching = [];

let adn_list = [];

let crunchyroll_list = [];

let wakanim_list = [];

let to_watch_list = [];
let old_to_watch = [];

let notification_links_and_id = [];
let links = [];
let running;

function callback() {
  if (chrome.runtime.lastError)
    console.log(chrome.runtime.lastError);
}

function callback_to_watch_list() {
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

}

function createNotif(elem) {
  if (elem.from == "ADN") {
    chrome.notifications.create({
      "type": "basic",
      "iconUrl": "images/adn.png",
      "title": elem.title,
      "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur ADN!"
    }, function push_notif(notificationId) {
      notification_links_and_id.push({
        id: notificationId,
        url: elem.link
      });
    });
  } else if (elem.from == "Crunchyroll") {
    chrome.notifications.create({
      "type": "basic",
      "iconUrl": "images/crunchyroll.png",
      "title": elem.title,
      "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur Crunchyroll!"
    }, function push_notif(notificationId) {
      notification_links_and_id.push({
        id: notificationId,
        url: elem.link
      });
    });
  } else if (elem.from == "Wakanim") {
    chrome.notifications.create({
      "type": "basic",
      "iconUrl": "images/wakanim.jpg",
      "title": elem.title,
      "message": "Un nouvel épisode de " + elem.title.split(' Épisode')[0] + " est sorti sur Wakanim!"
    }, function push_notif(notificationId) {
      notification_links_and_id.push({
        id: notificationId,
        url: elem.link
      });
    });
  }
}

function store_watching_anime_list() {
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

      chrome.browserAction.setBadgeText({
        text: to_watch_list.length.toString()
      });
      chrome.browserAction.setBadgeBackgroundColor({
        color: '#4688F1'
      });

      if (old_to_watch.length != 0 && old_to_watch.length < to_watch_list.length) {
        let last_elem = old_to_watch[old_to_watch.length - 1];
        let last_index = to_watch_list.findIndex(function(elem) {
          return elem.title == last_elem.title;
        });
        for (let i = last_index + 1; i < to_watch_list.length; i++) {
          createNotif(to_watch_list[i]);
        }
      }

    }
  });
}

//TODO a revoir
function set_watching_anime_list_nautiljon() {
  chrome.storage.sync.get(["name_nautiljon"], function(result) {
    if (result.name_nautiljon) {
      $.get("https://www.nautiljon.com/membre/vu," + result.name_nautiljon + ",anime.html?format=&statut=1", function(data) {
        old_watching = watching_anime_list;
        watching_anime_list = [];
        var animes = [];
        let list = $(data).find(".listing")[0].children;
        let size = list.length;
        // list.each(function() {
        for (let elem of list) {

          var licence = null;

          let last_ep_notify = 0;

          let title = elem.children[1].children[0].text;

          let link = "https://www.nautiljon.com" + elem.children[1].children[0].getAttribute("href");

          for (var i = 0; i < old_watching.length; i++) {
            if (old_watching[i].title == title) {
              last_ep_notify = old_watching[i].last_ep_notify;
              break;
            }
          }
          $.get(link, function(data2) {
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
              title: title,
              editeur: licence,
              title_alt: title_alt,
              image: "https://www.nautiljon.com" + image,
              link: link,
              description: synopsis,
              last_ep_notify: last_ep_notify
            }
            watching_anime_list.push(item);
            watching_anime_list.sort(function(a, b) {
              return a.title.localeCompare(b.title);
            });
            if (watching_anime_list.length == size) {
              store_watching_anime_list();
              set_to_watch_list();
            }

          });

        }

        store_watching_anime_list();
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
      let link = $(this).find("link").text().replace("http", "https");
      if (!link.includes('/fr/')) {
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

function set_wakanim_list() {
  wakanim_list = [];

  const fileReq = new XMLHttpRequest();
  fileReq.onreadystatechange = function(event) {
    // XMLHttpRequest.DONE === 4
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        let bearer = this.responseText;


        const req = new XMLHttpRequest();

        req.onreadystatechange = function(event) {
          // XMLHttpRequest.DONE === 4
          if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
              let tweets = JSON.parse(this.responseText);
              for (let tweet of tweets) {
                if (tweet.text.includes("►Épisode")) {
                  let titles = tweet.text.split('\n');

                  //Removing emojis from tweet
                  let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|\uFE0F|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

                  titles[0] = titles[0].replace(regex, '');
                  titles[0] = titles[0].trim();

                  let title = "";

                  if (titles[2].includes('►Épisode')) {
                    title = titles[0] + " " + (titles[2].split(':')[0]).slice(1);
                  } else {
                    title = titles[0] + " " + (titles[4].split(':')[0]).slice(1);
                  }


                  let link = tweet.entities.urls[0].expanded_url;
                  let img = '';

                  if (tweet.entities.media) {
                    img = tweet.entities.media[0].media_url_https;
                  }

                  const req2 = new XMLHttpRequest();
                  req2.onreadystatechange = function(event) {
                    if (this.readyState === XMLHttpRequest.DONE) {
                      if (this.status === 200) {
                        let item = {
                          title: title,
                          link: this.responseURL,
                          img: img,
                          from: "Wakanim"
                        };
                        wakanim_list.push(item);
                      } else {
                        console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
                      }
                    }

                  }
                  req2.open('HEAD', link, true);
                  req2.send(null);

                }
              }
            } else {
              console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
          }
        };

        req.open('GET', 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=Wakanim&count=100', true);
        req.setRequestHeader("Authorization", "Bearer " + bearer);
        req.send(null);
      }
    }
  }
  fileReq.open('GET', chrome.runtime.getURL("bearer.txt"), true);
  fileReq.send(null);

}

function set_to_watch_list_adn(item) {
  if (adn_list) {
    var titles = item.title.toLowerCase();
    if (item.title_alt)
      titles = titles.concat(" /", item.title_alt.toLowerCase());

    for (var i = adn_list.length - 1; i >= 0; i--) {
      let elem = adn_list[i];
      if (elem.title.includes("Épisode")) {

        var true_title = elem.title.split(" Épisode")[0].toLowerCase();
        let regex = /[^a-zA-Z0-9]/g;
        titles = titles.replace(regex, "");
        console.log(titles);
        true_title = true_title.replace(regex, "");
        console.log(true_title);
        let num_ep = parseInt(elem.title.split(" Épisode ")[1].split(" ")[0]);
        if (titles.includes(true_title)) {
          if (item.last_ep_notify < num_ep) {
            item.last_ep_notify = num_ep;
            to_watch_list.push(elem);
            createNotif(elem);
            store_to_watch_list();
            store_watching_anime_list();
            links.push(elem.link);
            chrome.storage.sync.set({
              "links": links
            });
          }
        }
      }
    }
  }
}

function set_to_watch_list_crunchyroll(item) {
  if (crunchyroll_list) {
    var titles = item.title.toLowerCase();
    if (item.title_alt)
      titles = titles.concat(" /", item.title_alt.toLowerCase());
    for (var i = crunchyroll_list.length - 1; i >= 0; i--) {
      let elem = crunchyroll_list[i];
      let num_ep = parseInt(elem.title.split(" - ")[1].split(" ")[1]);
      let regex = /[^a-zA-Z0-9]/g;
      let true_title = elem.seriesTitle.toLowerCase().replace(regex, "");
      titles = titles.replace(regex, "");
      if (titles.includes(true_title) && !elem.title.toLowerCase().includes("dub")) {
        if (item.last_ep_notify < num_ep) {
          item.last_ep_notify = num_ep;
          to_watch_list.push(elem);
          createNotif(elem);
          store_to_watch_list();
          store_watching_anime_list();
          links.push(elem.link);
          chrome.storage.sync.set({
            "links": links
          });
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
      let elem = wakanim_list[i];
      if (elem.title.includes("Épisode")) {
        var true_title = elem.title;
        let num_ep = parseInt(elem.title.split("Épisode ")[1]);
        let regex = /[^a-zA-Z0-9]/g;
        true_title = true_title.split(" Épisode ")[0].toLowerCase().replace(regex, "");
        titles = titles.replace(regex, "");
        if (titles.includes(true_title)) {
          if (item.last_ep_notify < num_ep) {
            item.last_ep_notify = num_ep;
            to_watch_list.push(elem);
            createNotif(elem);
            store_to_watch_list();
            store_watching_anime_list();
            links.push(elem.link);
            chrome.storage.sync.set({
              "links": links
            });
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
  chrome.storage.sync.get([
    "name_nautiljon", "links"
  ], function(result) {
    if (chrome.runtime.lastError)
      console.log(chrome.runtime.lastError);
    else {
      if (result.name_nautiljon) {
        name_nautiljon = result.name_nautiljon;
      }
      if (result.links) {
        links = result.links;
      }
      running = true;
      startup();
    }
  });
  chrome.alarms.create("check_running", {
    'periodInMinutes': 1
  });
}); //also get the last dates pls
chrome.runtime.onStartup.addListener(function() {
  console.log("OnStartup");
  retrieve_watching_anime_list();
  retrieve_to_watch_list();
  chrome.storage.sync.get([
    "name_nautiljon", "links"
  ], function(result) {
    if (chrome.runtime.lastError)
      console.log(chrome.runtime.lastError);
    else {
      if (result.name_nautiljon) {
        name_nautiljon = result.name_nautiljon;
      }

      if (result.links) {
        links = result.links;
      }
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
      chrome.storage.sync.get(["name_nautiljon", "links"], function(result) {
        if (chrome.runtime.lastError)
          console.log(chrome.runtime.lastError);
        else {
          if (result.name_nautiljon)
            name_nautiljon = result.name_nautiljon;
          if (result.links) {
            links = result.links;
          }
          running = true;
          startup();
        }
      });
    }
  }
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  notification_links_and_id.forEach(function(elem) {
    if (elem.id == notificationId) {
      chrome.tabs.create({
        'url': elem.url
      });
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
      chrome.storage.sync.set({
        "links": links
      });
    }
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (changes.nb_to_watch_list || changes.to_watch_list1 || changes.to_watch_list2 || changes.to_watch_list3 || changes.to_watch_list4 || changes.to_watch_list5) {
    retrieve_to_watch_list();
    retrieve_watching_anime_list();
  } else if (changes.nb_watching_anime_list || changes.watching_anime_list1 || changes.watching_anime_list2 || changes.watching_anime_list3 || changes.watching_anime_list4 || changes.watching_anime_list5) {
    retrieve_watching_anime_list();
  } else if (changes.links) {
    links = changes.links.newValue;
  }
});