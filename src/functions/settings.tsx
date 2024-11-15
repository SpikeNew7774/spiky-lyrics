import { SettingsSection } from "spcr-settings";
import storage from "./storage";
import { lyricsCache } from "./fetchLyrics";

export function setSettingsMenu() {
    generalSettings();
    devSettings();
    infos();
}

function devSettings() {
    const settings = new SettingsSection("Spicy Lyrics - Developer Settings", "spicy-lyrics-dev-settings");

    settings.addInput("custom-lyrics-api", "Custom Lyrics API", "https://api.spicy-lyrics.spikerko.org/lyrics/{SPOTIFY_ID}", () => {
        storage.set("customLyricsApi", settings.getFieldValue("custom-lyrics-api") as string)
        Spicetify.showNotification("Custom Lyrics API Updated Successfully!", false, 1000);
    });

    settings.addInput("lyrics-api-access-token", "Lyrics API Access Token", "unm5fVvh#$FAJ2FRKZOJhLrrhUWKB9v#2#pZ3U^!PCJFisUEBwjVBIETWM*gzR", () => { 
        storage.set("lyricsApiAccessToken", settings.getFieldValue("lyrics-api-access-token") as string)
        Spicetify.showNotification("Lyrics API Access Token Updated Successfully!", false, 1000);
    });

    settings.addButton("reset-custom-apis", "Reset Custom APIs", "Reset to Default", () => {
        settings.setFieldValue("custom-lyrics-api", "https://api.spicy-lyrics.spikerko.org/lyrics/{SPOTIFY_ID}");
        settings.setFieldValue("lyrics-api-access-token", "unm5fVvh#$FAJ2FRKZOJhLrrhUWKB9v#2#pZ3U^!PCJFisUEBwjVBIETWM*gzR");

        storage.set("customLyricsApi", "https://api.spicy-lyrics.spikerko.org/lyrics/{SPOTIFY_ID}")
        storage.set("lyricsApiAccessToken", "unm5fVvh#$FAJ2FRKZOJhLrrhUWKB9v#2#pZ3U^!PCJFisUEBwjVBIETWM*gzR")

        settings.rerender();

        Spicetify.showNotification("Custom APIs Reset Successfully!", false, 3000);
    });

    settings.addButton("remove-cached-lyrics", "Remove Cached Lyrics (Lyrics Stay in Cache for 7 days*)", "Remove Cached Lyrics", () => {
        lyricsCache.destroy();
        Spicetify.showNotification("Cache Destroyed Successfully!", false, 5000);
    });

    settings.addButton("remove-current-song-lyrics-from-localStorage", "Remove Current Song Lyrics from LocalStorage", "Remove Current Lyrics", () => { 
        storage.set("currentLyricsData", null);
        Spicetify.showNotification("Current Lyrics Removed Successfully!", false, 5000);
    });


    settings.pushSettings();
}


function generalSettings() {
    const settings = new SettingsSection("Spicy Lyrics", "spicy-lyrics-settings");

    settings.addToggle("low-q-mode", "Low Quality Mode", false, () => {
        storage.set("lowQMode", settings.getFieldValue("low-q-mode") as string)
    }); 

    settings.addButton("save-n-reload", "Save your current settings and reload.", "Save & Reload", () => {
        window.location.reload();
    });

    settings.pushSettings()
}

function infos() {
    const settings = new SettingsSection("Spicy Lyrics - Info", "spicy-lyrics-settings-info");

    settings.addButton("more-info", "*Only if you're online", "", () => {});

    settings.pushSettings();

}