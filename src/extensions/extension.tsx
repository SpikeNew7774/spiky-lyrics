import { Interval } from "@spikerko/web-modules/Scheduler";
import "../css/default.css";
import fetchLyrics from "../functions/fetchLyrics";
import { lineLyrics, runLiiInt, ScrollingIntervalTime, scrollToActiveLine, staticLyrics, stopLyricsInInt, syllableLyrics } from "../functions/lyrics";
import storage from "../functions/storage";
import { setSettingsMenu } from "../functions/settings";

(async () => {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Lets set out the Settings Menu
  setSettingsMenu();

  storage.set("fetchedFirst", "false");
  storage.set("lastFetchedUri", null)
  storage.set("intRunning", "false")

  const fontElement = document.createElement("link");
  fontElement.href = "https://fonts.spikerko.org/lyrics/source.css";
  fontElement.rel = "stylesheet";
  fontElement.type = "text/css";
  document.head.appendChild(fontElement);

  const cssElem = document.createElement("link");
  cssElem.href = "/spicetify-routes-spicy-lyrics.css";
  cssElem.rel = "stylesheet";
  cssElem.type = "text/css";
  document.head.appendChild(cssElem);

  // Lets set out Dynamic Background (spicy-dynamic-bg) to the now playing bar

  let lastImgUrl;

  /* Spicetify.Player.addEventListener("songchange", (event) => {
      const cover = event.data.item.metadata.image_url;
      applyDynamicBackgroundToNowPlayingBar(cover)
  }); */

  const lowQMode = storage.get("lowQMode");
  const lowQModeEnabled = lowQMode && lowQMode === "true";

  function applyDynamicBackgroundToNowPlayingBar(coverUrl: string) {
    const nowPlayingBar = document.querySelector<HTMLElement>(".Root__right-sidebar aside.NowPlayingView");

    try {
      if (nowPlayingBar == null) {
        lastImgUrl = null;
        return;
      };
      if (coverUrl === lastImgUrl) return;

      if (nowPlayingBar?.querySelector(".spicy-dynamic-bg")) {
        nowPlayingBar.querySelector(".spicy-dynamic-bg").remove();
      }

      if (lowQModeEnabled) {
        nowPlayingBar.classList.add("spicy-dynamic-bg-in-this")
        Spicetify.colorExtractor(Spicetify.Player.data.item.uri).then(colors => {
          nowPlayingBar.querySelector<HTMLElement>(".AAdBM1nhG73supMfnYX7").style.backgroundColor = colors.DESATURATED;
          lastImgUrl = coverUrl;
        }).catch(err => {
          console.error("Error extracting color:", err);
        });
        return
      }
  
      const dynamicBackground = document.createElement("div");
      dynamicBackground.classList.add("spicy-dynamic-bg");
      
      dynamicBackground.innerHTML = `
        <img class="Front" src="${coverUrl}" />
        <img class="Back" src="${coverUrl}" />
        <img class="BackCenter" src="${coverUrl}" />
      `
  
      nowPlayingBar.classList.add("spicy-dynamic-bg-in-this")
  
      nowPlayingBar.appendChild(dynamicBackground);

      lastImgUrl = coverUrl;
    } catch (error) {
      console.error("Error:", error) 
    }
  }

  Interval(1, () => applyDynamicBackgroundToNowPlayingBar(Spicetify.Player.data?.item.metadata.image_url));

  Spicetify.Player.addEventListener("songchange", (event) => {
    const currentUri = event.data.item.uri;

    fetchLyrics(currentUri).then(lyrics => {
        storage.set("currentLyricsType", lyrics?.Type);
        if (lyrics?.Type === "Syllable") {
            syllableLyrics(lyrics);
        } else if (lyrics?.Type === "Line") {
            lineLyrics(lyrics);
        } else if (lyrics?.Type === "Static") {
            staticLyrics(lyrics);
        }
        storage.set("lastFetchedUri", currentUri);
    });
    /* stopLyricsInInt();
    Spicetify.LocalStorage.set("SpicyLyrics-intRunning", "false")
    runLiiInt(); */
    /* Spicetify.Player.pause();
    Spicetify.Player.play(); */
  })

  window.addEventListener("online", () => {

    storage.set("lastFetchedUri", null);

    fetchLyrics(Spicetify.Player.data?.item.uri).then(lyrics => {
      storage.set("fetchedFirst", "true");
      storage.set("currentLyricsType", lyrics?.Type);
      if (lyrics?.Type === "Syllable") {
          syllableLyrics(lyrics);
      } else if (lyrics?.Type === "Line") {
          lineLyrics(lyrics);
      } else if (lyrics?.Type === "Static") {
          staticLyrics(lyrics);
      }
      storage.set("lastFetchedUri", Spicetify.Player.data?.item.uri);
    });
  });

  setInterval(scrollToActiveLine, ScrollingIntervalTime);

})()
