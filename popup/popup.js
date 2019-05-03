function callback() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  }
}

$(document).ready(function() {
  $(".tabs").tabs();
});
$(document).ready(function() {
  $(".fixed-action-btn").floatingActionButton();
});

function displayToWatchList() {
  var card = document.querySelector("#cardAnime");
  var listEpisode = document.querySelector("#listEpisode");
  var toWatchList = [];
  chrome.storage.sync.get(
    ["nbToWatchList", "toWatchList1", "toWatchList2", "toWatchList3", "toWatchList4", "toWatchList5"],
    function(result) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else {
        if (result.nbToWatchList >= 1) {
          toWatchList = toWatchList.concat(result.toWatchList1);
        }
        if (result.nbToWatchList >= 2) {
          toWatchList = toWatchList.concat(result.toWatchList2);
        }
        if (result.nbToWatchList >= 3) {
          toWatchList = toWatchList.concat(result.toWatchList3);
        }
        if (result.nbToWatchList >= 4) {
          toWatchList = toWatchList.concat(result.toWatchList4);
        }
        if (result.nbToWatchList >= 5) {
          toWatchList = toWatchList.concat(result.toWatchList5);
        }

        toWatchList.reverse();

        for (let elem of toWatchList) {
          let clone = document.importNode(card.content, true);
          let img = clone.querySelector("img");
          if (elem.img) {
            img.setAttribute("src", elem.img);
          }
          let description = clone.querySelector(".description");
          description.textContent = elem.title;
          let remove = clone.querySelector("#remove");
          remove.onclick = function(event) {
            event.preventDefault();
            chrome.runtime.sendMessage(
              {
                request: "episodeSeen",
                url: elem.link
              },
              function(response) {
                if (chrome.runtime.lastError) {
                  console.log(chrome.runtime.lastError);
                } else {
                  console.log(response);
                }
              }
            );
          };

          let watch = clone.querySelector("#watch");
          watch.onclick = function() {
            chrome.tabs.create({
              url: elem.link
            });
          };

          listEpisode.append(clone);
        }
      }
    }
  );
}

function displayWatchingList() {
  let card = document.querySelector("#cardWatching");
  let div = document.querySelector("#watchingList");

  chrome.storage.sync.get(
    [
      "nbWatchingAnimeList",
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
        let watchingAnimeList = [];
        if (result.nbWatchingAnimeList >= 1 && result.watchingAnimeList1) {
          watchingAnimeList = watchingAnimeList.concat(result.watchingAnimeList1);
        }
        if (result.nbWatchingAnimeList >= 2 && result.watchingAnimeList2) {
          watchingAnimeList = watchingAnimeList.concat(result.watchingAnimeList2);
        }
        if (result.nbWatchingAnimeList >= 3 && result.watchingAnimeList3) {
          watchingAnimeList = watchingAnimeList.concat(result.watchingAnimeList3);
        }
        if (result.nbWatchingAnimeList >= 4 && result.watchingAnimeList4) {
          watchingAnimeList = watchingAnimeList.concat(result.watchingAnimeList4);
        }
        if (result.nbWatchingAnimeList >= 5 && result.watchingAnimeList5) {
          watchingAnimeList = watchingAnimeList.concat(result.watchingAnimeList5);
        }
        if (watchingAnimeList.length == 0) {
          div.textContent = "Vous n'avez aucune série dans votre liste nautiljon";
        } else {
          watchingAnimeList.forEach(function(elem) {
            let clone = document.importNode(card.content, true);
            let img = clone.querySelector("img");
            if (elem.image) {
              img.setAttribute("src", elem.image);
            }
            let title = clone.querySelector(".card-title");
            title.textContent = elem.title;
            let lastEp = clone.querySelector("#lastEp");
            lastEp.textContent = "Dernier épisode sorti : " + elem.lastEpNotify;
            let description = clone.querySelector("#description");
            description.textContent = elem.description;

            let more = clone.querySelector("#more");
            more.onclick = function() {
              chrome.tabs.create({
                url: elem.link
              });
            };

            div.append(clone);
          });
        }
        document.querySelector("#refresh").style.visibility = "visible";
        document.querySelector("#refresh").onclick = function() {
          chrome.runtime.sendMessage(
            {
              request: "refreshWatching"
            },
            function(response) {
              if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
              } else {
                console.log(response);
              }
            }
          );
        };
        document.querySelector("#changePseudo").style.visibility = "visible";
        document.querySelector("#changePseudo").onclick = function() {
          // chrome.storage.sync.remove("nameNautiljon");
          document.querySelector("#watchingList").textContent = "";
          displayFormNautiljon();
        };
      }
    }
  );
}

function displayFormNautiljon() {
  let card = document.querySelector("#formNautiljon");
  let div = document.querySelector("#watchingList");
  div.append(document.importNode(card.content, true));
  document.querySelector("#refresh").style.visibility = "hidden";
  document.querySelector("#changePseudo").style.visibility = "hidden";
  document.querySelector("#startButton").onclick = function() {
    chrome.runtime.sendMessage(
      {
        request: "settingNautiljon",
        pseudo: document.querySelector("#pseudo").value
      },
      function(response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          console.log(response);
        }
      }
    );
  };
  document.querySelector("#cancelButton").onclick = function() {
    document.querySelector("#watchingList").textContent = "";
    displayWatchingList();
  };
  document.onkeyup = function(event) {
    if (event.keyCode == 13 && event.target == document.querySelector("#pseudo")) {
      chrome.runtime.sendMessage(
        {
          request: "settingNautiljon",
          pseudo: document.querySelector("#pseudo").value
        },
        function(response) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
          } else {
            console.log(response);
          }
        }
      );
    }
  };
}

chrome.storage.sync.get(["nameNautiljon"], function(result) {
  if (result.nameNautiljon) {
    displayToWatchList();
    displayWatchingList();
  } else {
    document.querySelector("#listEpisode").textContent = "";
    let init = document.querySelector("#startToWatch");
    let toAdd = document.importNode(init.content, true);
    document.querySelector("#listEpisode").append(toAdd);
    displayFormNautiljon();
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (
    changes.nbToWatchList ||
    changes.toWatchList1 ||
    changes.toWatchList2 ||
    changes.toWatchList3 ||
    changes.toWatchList4 ||
    changes.toWatchList5
  ) {
    document.querySelector("#listEpisode").textContent = "";
    displayToWatchList();
  } else if (
    changes.nbWatchingAnimeList ||
    changes.watchingAnimeList1 ||
    changes.watchingAnimeList2 ||
    changes.watchingAnimeList3 ||
    changes.watchingAnimeList4 ||
    changes.watchingAnimeList5
  ) {
    document.querySelector("#watchingList").textContent = "";
    displayWatchingList();
  } else if (changes.nameNautiljon) {
    document.querySelector("#watchingList").textContent = "";
    displayWatchingList();
  }
  // window.location.reload();
});
