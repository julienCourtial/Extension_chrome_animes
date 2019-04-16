// Username of user on nautiljon website
let nameNautiljon;

// List of anime series the user is currently watching
let watchingAnimeList = [];
let oldWatching = [];

// List of episodes released on ADN
let adnList = [];

// List of episodes released on Crunchyroll
let crunchyrollList = [];

// List of episodes released on Wakanim
let wakanimList = [];

// List of episodes released from the series the user is watching
let toWatchList = [];
let oldToWatch = [];

// List of notifications
let notificationLinksAndId = [];

// List of url of each episode in toWatchList
let links = [];

//
let running;

// Standard callback function
function callback() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  }
}

// Callback function used when setting toWatchList
// Update the extension badge
function callbackToWatchList() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    chrome.browserAction.setBadgeText({
      text: toWatchList.length.toString()
    });
    chrome.browserAction.setBadgeBackgroundColor({
      color: "#4688F1"
    });
  }
}

// Create a notification depending on the website the episodes were released
//  and add the link and id in the notificationLinksAndId list
function createNotif(elem) {
  if (elem.from == "ADN") {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "images/adn.png",
        title: elem.title,
        message: "Un nouvel épisode de " +
          elem.title.split(" Épisode")[0] +
          " est sorti sur ADN!"
      },
      function(notificationId) {
        notificationLinksAndId.push({
          id: notificationId,
          url: elem.link
        });
      }
    );
  } else if (elem.from == "Crunchyroll") {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "images/crunchyroll.png",
        title: elem.title,
        message: "Un nouvel épisode de " +
          elem.title.split(" Épisode")[0] +
          " est sorti sur Crunchyroll!"
      },
      function(notificationId) {
        notificationLinksAndId.push({
          id: notificationId,
          url: elem.link
        });
      }
    );
  } else if (elem.from == "Wakanim") {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "images/wakanim.jpg",
        title: elem.title,
        message: "Un nouvel épisode de " +
          elem.title.split(" Épisode")[0] +
          " est sorti sur Wakanim!"
      },
      function(notificationId) {
        notificationLinksAndId.push({
          id: notificationId,
          url: elem.link
        });
      }
    );
  }
}

// Store the watching_anime list by dividing it depending on the list size and
// the QUOTA BYTES PER ITEM from browser storage
function storeWatchingAnimeList() {
  console.log("storing watching list");
  let nbToDivide =
    sizeof(watchingAnimeList) / chrome.storage.sync.QUOTA_BYTES_PER_ITEM;
  if (nbToDivide > 3) {
    let div = Math.floor(watchingAnimeList.length / 4);
    if (4 * div < watchingAnimeList.length) {
      chrome.storage.sync.set({
          nbToDivide_watchingAnimeList: 5,
          watchingAnimeList1: watchingAnimeList.slice(0, div),
          watchingAnimeList2: watchingAnimeList.slice(div, 2 * div),
          watchingAnimeList3: watchingAnimeList.slice(2 * div, 3 * div),
          watchingAnimeList4: watchingAnimeList.slice(3 * div, 4 * div),
          watchingAnimeList5: watchingAnimeList.slice(
            4 * div,
            watchingAnimeList.length
          )
        },
        callback()
      );
    } else {
      chrome.storage.sync.set({
          nbToDivide_watchingAnimeList: 4,
          watchingAnimeList1: watchingAnimeList.slice(0, div),
          watchingAnimeList2: watchingAnimeList.slice(div, 2 * div),
          watchingAnimeList3: watchingAnimeList.slice(2 * div, 3 * div),
          watchingAnimeList4: watchingAnimeList.slice(3 * div, 4 * div)
        },
        callback()
      );
    }
  } else if (nbToDivide > 2) {
    let div = Math.floor(watchingAnimeList.length / 3);
    if (3 * div < watchingAnimeList.length) {
      chrome.storage.sync.set({
          nbToDivide_watchingAnimeList: 4,
          watchingAnimeList1: watchingAnimeList.slice(0, div),
          watchingAnimeList2: watchingAnimeList.slice(div, 2 * div),
          watchingAnimeList3: watchingAnimeList.slice(2 * div, 3 * div),
          watchingAnimeList4: watchingAnimeList.slice(
            3 * div,
            watchingAnimeList.length
          )
        },
        callback()
      );
    } else {
      chrome.storage.sync.set({
          nbToDivide_watchingAnimeList: 3,
          watchingAnimeList1: watchingAnimeList.slice(0, div),
          watchingAnimeList2: watchingAnimeList.slice(div, 2 * div),
          watchingAnimeList3: watchingAnimeList.slice(2 * div, 3 * div)
        },
        callback()
      );
    }
  } else if (nbToDivide > 1) {
    let div = Math.floor(watchingAnimeList.length / 2);
    if (2 * div < watchingAnimeList.length) {
      chrome.storage.sync.set({
          nbToDivide_watchingAnimeList: 3,
          watchingAnimeList1: watchingAnimeList.slice(0, div),
          watchingAnimeList2: watchingAnimeList.slice(div, 2 * div),
          watchingAnimeList3: watchingAnimeList.slice(
            2 * div,
            watchingAnimeList.length
          )
        },
        callback()
      );
    } else {
      chrome.storage.sync.set({
          nbToDivide_watchingAnimeList: 2,
          watchingAnimeList1: watchingAnimeList.slice(0, div),
          watchingAnimeList2: watchingAnimeList.slice(div, 2 * div)
        },
        callback()
      );
    }
  } else {
    chrome.storage.sync.set({
        nbToDivide_watchingAnimeList: 1,
        watchingAnimeList1: watchingAnimeList
      },
      callback()
    );
  }
}

// Retrieve the watching anime list from each part on the browser storage
function retrieveWatchingAnimeList() {
  chrome.storage.sync.get(
    [
      "nb_watchingAnimeList",
      "watchingAnimeList1",
      "watchingAnimeList2",
      "watchingAnimeList3",
      "watchingAnimeList4",
      "watchingAnimeList5"
    ],
    function(result) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else {
        watchingAnimeList = [];
        if (result.nb_watchingAnimeList >= 1) {
          watchingAnimeList = watchingAnimeList.concat(
            result.watchingAnimeList1
          );
        }
        if (result.nb_watchingAnimeList >= 2) {
          watchingAnimeList = watchingAnimeList.concat(
            result.watchingAnimeList2
          );
        }
        if (result.nb_watchingAnimeList >= 3) {
          watchingAnimeList = watchingAnimeList.concat(
            result.watchingAnimeList3
          );
        }
        if (result.nb_watchingAnimeList >= 4) {
          watchingAnimeList = watchingAnimeList.concat(
            result.watchingAnimeList4
          );
        }
        if (result.nb_watchingAnimeList >= 5) {
          watchingAnimeList = watchingAnimeList.concat(
            result.watchingAnimeList5
          );
        }
      }
    }
  );
}

// Store the to_watch list by dividing it depending on the list size and
// the QUOTA BYTES PER ITEM from browser storage
function storeToWatchList() {
  console.log("storing to watch list");
  let nbToDivide =
    sizeof(toWatchList) / chrome.storage.sync.QUOTA_BYTES_PER_ITEM;
  if (nbToDivide > 3) {
    let div = Math.floor(toWatchList.length / 4);
    if (4 * div < toWatchList.length) {
      chrome.storage.sync.set({
          nbToDivide_toWatchList: 5,
          toWatchList1: toWatchList.slice(0, div),
          toWatchList2: toWatchList.slice(div, 2 * div),
          toWatchList3: toWatchList.slice(2 * div, 3 * div),
          toWatchList4: toWatchList.slice(3 * div, 4 * div),
          toWatchList5: toWatchList.slice(4 * div, toWatchList.length)
        },
        callbackToWatchList()
      );
    } else {
      chrome.storage.sync.set({
          nbToDivide_toWatchList: 4,
          toWatchList1: toWatchList.slice(0, div),
          toWatchList2: toWatchList.slice(div, 2 * div),
          toWatchList3: toWatchList.slice(2 * div, 3 * div),
          toWatchList4: toWatchList.slice(3 * div, 4 * div)
        },
        callbackToWatchList()
      );
    }
  } else if (nbToDivide > 2) {
    let div = Math.floor(toWatchList.length / 3);
    if (3 * div < toWatchList.length) {
      chrome.storage.sync.set({
          nbToDivide_toWatchList: 4,
          toWatchList1: toWatchList.slice(0, div),
          toWatchList2: toWatchList.slice(div, 2 * div),
          toWatchList3: toWatchList.slice(2 * div, 3 * div),
          toWatchList4: toWatchList.slice(3 * div, toWatchList.length)
        },
        callbackToWatchList()
      );
    } else {
      chrome.storage.sync.set({
          nbToDivide_toWatchList: 3,
          toWatchList1: toWatchList.slice(0, div),
          toWatchList2: toWatchList.slice(div, 2 * div),
          toWatchList3: toWatchList.slice(2 * div, 3 * div)
        },
        callbackToWatchList()
      );
    }
  } else if (nbToDivide > 1) {
    let div = Math.floor(toWatchList.length / 2);
    if (2 * div < toWatchList.length) {
      chrome.storage.sync.set({
          nbToDivide_toWatchList: 3,
          toWatchList1: toWatchList.slice(0, div),
          toWatchList2: toWatchList.slice(div, 2 * div),
          toWatchList3: toWatchList.slice(2 * div, toWatchList.length)
        },
        callbackToWatchList()
      );
    } else {
      chrome.storage.sync.set({
          nbToDivide_toWatchList: 2,
          toWatchList1: toWatchList.slice(0, div),
          toWatchList2: toWatchList.slice(div, 2 * div)
        },
        callbackToWatchList()
      );
    }
  } else {
    chrome.storage.sync.set({
        nbToDivide_toWatchList: 1,
        toWatchList1: toWatchList
      },
      callbackToWatchList()
    );
  }
}

// Retrieve the to_watch list from each part on the browser storage and create a
// notification if there are new epiosodes from another machine
function retrieveToWatchList() {
  chrome.storage.sync.get(
    [
      "nb_toWatchList",
      "toWatchList1",
      "toWatchList2",
      "toWatchList3",
      "toWatchList4",
      "toWatchList5"
    ],
    function(result) {
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
      else {
        oldToWatch = toWatchList;
        toWatchList = [];
        if (result.nb_toWatchList >= 1) {
          toWatchList = toWatchList.concat(result.toWatchList1);
        }
        if (result.nb_toWatchList >= 2) {
          toWatchList = toWatchList.concat(result.toWatchList2);
        }
        if (result.nb_toWatchList >= 3) {
          toWatchList = toWatchList.concat(result.toWatchList3);
        }
        if (result.nb_toWatchList >= 4) {
          toWatchList = toWatchList.concat(result.toWatchList4);
        }
        if (result.nb_toWatchList >= 5) {
          toWatchList = toWatchList.concat(result.toWatchList5);
        }

        chrome.browserAction.setBadgeText({
          text: toWatchList.length.toString()
        });
        chrome.browserAction.setBadgeBackgroundColor({
          color: "#4688F1"
        });

        //Compare the old list with the new one just retrieved and compare both of
        // them to see if there are new episodes
        if (oldToWatch.length != 0 && oldToWatch.length < toWatchList.length) {
          let last_elem = oldToWatch[oldToWatch.length - 1];
          let last_index = toWatchList.findIndex(function(elem) {
            return elem.title == last_elem.title;
          });
          for (let i = last_index + 1; i < toWatchList.length; i++) {
            createNotif(toWatchList[i]);
          }
        }
      }
    }
  );
}

// Retrieve the watching_anime list from the user list on the nautiljon website
//TODO a revoir
function set_watchingAnimeList_nautiljon() {
  // If the user set is nautiljon's username we can retrieve the list
  chrome.storage.sync.get(["nameNautiljon"], function(result) {
    if (result.nameNautiljon) {
      // Request the page of the user list on nautiljon
      $.get(
        "https://www.nautiljon.com/membre/vu," +
        result.nameNautiljon +
        ",anime.html?format=&statut=1",
        function(data) {
          oldWatching = watchingAnimeList;
          watchingAnimeList = [];
          var animes = [];
          let list = $(data).find(".listing")[0].children;
          let size = list.length;
          // list.each(function() {
          // Loop on the anime list from page and retrieve everything that is needed
          for (let elem of list) {
            var licence = null;

            let last_ep_notify = 0;

            let title = elem.children[1].children[0].text;

            let link =
              "https://www.nautiljon.com" +
              elem.children[1].children[0].getAttribute("href");

            for (var i = 0; i < oldWatching.length; i++) {
              if (oldWatching[i].title == title) {
                last_ep_notify = oldWatching[i].last_ep_notify;
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
                var section_content = section.join(" : ");

                if (section_title === "Titre alternatif") {
                  title_alt = section_content;
                } else if (section_title === "Licencié en France") {
                  licencie = true;
                } else if (licencie && section_title === "Editeur") {
                  licence = section_content.split(" ")[1];

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
              };
              watchingAnimeList.push(item);
              watchingAnimeList.sort(function(a, b) {
                return a.title.localeCompare(b.title);
              });
              if (watchingAnimeList.length == size) {
                storeWatchingAnimeList();
                set_toWatchList();
              }
            });
          }

          storeWatchingAnimeList();
        }
      );
    }
  });
}

// Construct the ADN list from the RSS
function set_adnList() {
  adnList = [];
  $.get("https://animedigitalnetwork.fr/rss", function(data) {
    var items = [];
    $(data)
      .find("item")
      .each(function() {
        var img = $(this)
          .find("enclosure")[0]
          .getAttribute("url");
        if (!img.includes("http")) {
          img = "https:" + img;
        }
        var item = {
          title: $(this)
            .find("title")
            .text(),
          link: $(this)
            .find("link")
            .text(),
          img: img,
          from: "ADN"
        };
        adnList.push(item);
      });
  });
}

// Construct the Crunchyroll list from the RSS
function set_crunchyrollList() {
  crunchyrollList = [];
  $.get("https://www.crunchyroll.com/rss?lang=frFR", function(data) {
    var items = [];
    $(data)
      .find("item")
      .each(function() {
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
        let link = $(this)
          .find("link")
          .text()
          .replace("http", "https");
        if (!link.includes("/fr/")) {
          link.replace("www.crunchyroll.com/", "www.crunchyroll.com/fr/");
        }
        var item = {
          title: $(this)
            .find("title")
            .text(),
          link: link,
          img: image,
          seriesTitle: seriesTitle,
          from: "Crunchyroll"
        };
        crunchyrollList.push(item);
      });
  });
}

// Since there is no RSS for Wakanim, construct the list from the twitter page of Wakanim.
function set_wakanimList() {
  wakanimList = [];

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
                  let titles = tweet.text.split("\n");

                  //Removing emojis from tweet
                  let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|\uFE0F|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

                  titles[0] = titles[0].replace(regex, "");
                  titles[0] = titles[0].trim();

                  let title = "";

                  if (titles[2].includes("►Épisode")) {
                    title = titles[0] + " " + titles[2].split(":")[0].slice(1);
                  } else {
                    title = titles[0] + " " + titles[4].split(":")[0].slice(1);
                  }

                  let link = tweet.entities.urls[0].expanded_url;
                  let img = "";

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
                        wakanimList.push(item);
                      } else {
                        console.log(
                          "Status de la réponse: %d (%s)",
                          this.status,
                          this.statusText
                        );
                      }
                    }
                  };
                  req2.open("HEAD", link, true);
                  req2.send(null);
                }
              }
            } else {
              console.log(
                "Status de la réponse: %d (%s)",
                this.status,
                this.statusText
              );
            }
          }
        };

        req.open(
          "GET",
          "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=Wakanim&count=100",
          true
        );
        req.setRequestHeader("Authorization", "Bearer " + bearer);
        req.send(null);
      }
    }
  };
  fileReq.open("GET", chrome.runtime.getURL("bearer.txt"), true);
  fileReq.send(null);
}

// Look in the ADN list if the serie given has a new episode released
function set_toWatchList_adn(item) {
  if (adnList) {
    var titles = item.title.toLowerCase();
    if (item.title_alt)
      titles = titles.concat(" /", item.title_alt.toLowerCase());

    for (var i = adnList.length - 1; i >= 0; i--) {
      let elem = adnList[i];
      if (elem.title.includes("Épisode")) {
        var true_title = elem.title.split(" Épisode")[0].toLowerCase();
        let regex = /[^a-zA-Z0-9]/g;
        titles = titles.replace(regex, "");
        true_title = true_title.replace(regex, "");
        let num_ep = parseInt(elem.title.split(" Épisode ")[1].split(" ")[0]);
        if (titles.includes(true_title)) {
          if (item.last_ep_notify < num_ep) {
            item.last_ep_notify = num_ep;
            toWatchList.push(elem);
            createNotif(elem);
            storeToWatchList();
            storeWatchingAnimeList();
            links.push(elem.link);
            chrome.storage.sync.set({
              links: links
            });
          }
        }
      }
    }
  }
}

// Look in the Crunchyroll list if the serie given has a new episode released
function set_toWatchList_crunchyroll(item) {
  if (crunchyrollList) {
    var titles = item.title.toLowerCase();
    if (item.title_alt)
      titles = titles.concat(" /", item.title_alt.toLowerCase());
    for (var i = crunchyrollList.length - 1; i >= 0; i--) {
      let elem = crunchyrollList[i];
      let num_ep = null;
      if (elem.title.includes("Épisode")) {
        num_ep = parseInt(elem.title.split("Épisode ")[1].split(" -")[0]);
        let regex = /[^a-zA-Z0-9]/g;
        let true_title = elem.seriesTitle.toLowerCase().replace(regex, "");
        titles = titles.replace(regex, "");
        if (
          titles.includes(true_title) &&
          !elem.title.toLowerCase().includes("dub")
        ) {
          if (item.last_ep_notify < num_ep) {
            item.last_ep_notify = num_ep;
            toWatchList.push(elem);
            createNotif(elem);
            storeToWatchList();
            storeWatchingAnimeList();
            links.push(elem.link);
            chrome.storage.sync.set({
              links: links
            });
          }
        }
      }
    }
  }
}

// Look in the Wakanim list if the serie given has a new episode released
function set_toWatchList_wakanim(item) {
  if (wakanimList) {
    var titles = item.title.toLowerCase();
    if (titles.includes("("))
      titles = titles.concat(" / ", titles.split(" (")[0]);
    if (item.title_alt)
      titles = titles.concat(" /", item.title_alt.toLowerCase());

    for (var i = wakanimList.length - 1; i >= 0; i--) {
      let elem = wakanimList[i];
      if (elem.title.includes("Épisode")) {
        var true_title = elem.title;
        let num_ep = parseInt(elem.title.split("Épisode ")[1]);
        let regex = /[^a-zA-Z0-9]/g;
        true_title = true_title
          .split(" Épisode ")[0]
          .toLowerCase()
          .replace(regex, "");
        titles = titles.replace(regex, "");
        if (titles.includes(true_title)) {
          if (item.last_ep_notify < num_ep) {
            item.last_ep_notify = num_ep;
            toWatchList.push(elem);
            createNotif(elem);
            storeToWatchList();
            storeWatchingAnimeList();
            links.push(elem.link);
            chrome.storage.sync.set({
              links: links
            });
          }
        }
      }
    }
  }
}

// Loop on the watching anime list and call the set to watch function corresponding to the
//  editor of the anime
function set_toWatchList() {
  if (watchingAnimeList) {
    for (var i = 0; i < watchingAnimeList.length; i++) {
      var elem = watchingAnimeList[i];
      if (elem.editeur != null) {
        editeurs = elem.editeur.split(" - ");
      } else {
        editeurs = [];
      }
      editeur_found = false;
      for (var j = 0; !editeur_found && j < editeurs.length; j++) {
        if (editeurs[j] === "ADN" || editeurs[j] === "Kana") {
          set_toWatchList_adn(elem);
          editeur_found = true;
        } else if (editeurs[j] === "Wakanim") {
          set_toWatchList_wakanim(elem);
          editeur_found = true;
        } else if (editeurs[j] === "Crunchyroll") {
          set_toWatchList_crunchyroll(elem);
          editeur_found = true;
        }
      }
    }
  }
}

function startup() {
  // set_watchingAnimeList_nautiljon();
  set_adnList();
  set_crunchyrollList();
  set_wakanimList();
  setTimeout(set_toWatchList, 60000);
  // setTimeout(refresh, 300000);
  // setTimeout(startup, 30000);
  setTimeout(startup, 70000);
}
chrome.runtime.onInstalled.addListener(function() {
  console.log("OnInstalled"); // chrome.storage.sync.clear();
  retrieveWatchingAnimeList();
  retrieveToWatchList();
  chrome.storage.sync.get(["nameNautiljon", "links"], function(result) {
    if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
    else {
      if (result.nameNautiljon) {
        nameNautiljon = result.nameNautiljon;
      }
      if (result.links) {
        links = result.links;
      }
      running = true;
      startup();
    }
  });
  chrome.alarms.create("check_running", {
    periodInMinutes: 1
  });
}); //also get the last dates pls
chrome.runtime.onStartup.addListener(function() {
  console.log("OnStartup");
  retrieveWatchingAnimeList();
  retrieveToWatchList();
  chrome.storage.sync.get(["nameNautiljon", "links"], function(result) {
    if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
    else {
      if (result.nameNautiljon) {
        nameNautiljon = result.nameNautiljon;
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
      retrieveWatchingAnimeList();
      retrieveToWatchList();
      chrome.storage.sync.get(["nameNautiljon", "links"], function(result) {
        if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
        else {
          if (result.nameNautiljon) nameNautiljon = result.nameNautiljon;
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
  notificationLinksAndId.forEach(function(elem) {
    if (elem.id == notificationId) {
      chrome.tabs.create({
        url: elem.url
      });
    }
  });
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.request == "refreshWatching") {
    set_watchingAnimeList_nautiljon();
  } else if (request.request == "settingNautiljon" && request.pseudo) {
    chrome.storage.sync.remove(
      [
        "nameNautiljon",
        "nb_watchingAnimeList",
        "watchingAnimeList1",
        "watchingAnimeList2",
        "watchingAnimeList3",
        "watchingAnimeList4",
        "watchingAnimeList5"
      ],
      function() {
        chrome.storage.sync.set({
            nameNautiljon: request.pseudo
          },
          function() {
            set_watchingAnimeList_nautiljon();
            sendResponse();
          }
        );
      }
    );
  } else if (request.request == "episodeSeen" && request.url) {
    var index = toWatchList.findIndex(function(element) {
      if (element.link == request.url) {
        return true;
      }
      return false;
    });
    if (index != -1) {
      toWatchList.splice(index, 1);
      storeToWatchList();
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
        links: links
      });
    }
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (
    changes.nb_toWatchList ||
    changes.toWatchList1 ||
    changes.toWatchList2 ||
    changes.toWatchList3 ||
    changes.toWatchList4 ||
    changes.toWatchList5
  ) {
    retrieveToWatchList();
    retrieveWatchingAnimeList();
  } else if (
    changes.nb_watchingAnimeList ||
    changes.watchingAnimeList1 ||
    changes.watchingAnimeList2 ||
    changes.watchingAnimeList3 ||
    changes.watchingAnimeList4 ||
    changes.watchingAnimeList5
  ) {
    retrieveWatchingAnimeList();
  } else if (changes.links) {
    links = changes.links.newValue;
  }
});