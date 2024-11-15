import { SpikyCache } from "@spikerko/web-modules/SpikyCache";
import storage from "./storage";

export const lyricsCache = new SpikyCache({
    name: "SpikyCache_Spicy_Lyrics"
})

export default async function fetchLyrics(uri: string) {
    if (!document.querySelector("#LyricsPageContainer")) return;

    if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").classList.contains("offline")) {
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").classList.remove("offline");
    }


    const currFetching = storage.get("currentlyFetching");
    if (currFetching == "true") return;

    storage.set("currentlyFetching", "true");
    

    if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
    }


    const trackId = uri.split(":")[2];
    
    // Check if there's already data in localStorage
    const savedLyricsData = storage.get("currentLyricsData");

    if (savedLyricsData) {
        try {
            const lyricsData = JSON.parse(savedLyricsData);
            // Return the stored lyrics if the ID matches the track ID
            if (lyricsData?.id === trackId) {
                storage.set("currentlyFetching", "false");
                if (document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer")) {
                    document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer").classList.remove("active");
                }
                if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
                    document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
                }
                return lyricsData;
            }
        } catch (error) {
            console.error("Error parsing saved lyrics data:", error);
            storage.set("currentlyFetching", "false");
            if (document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer")) {
                document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer").classList.remove("active");
            }
            if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
                document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
            }
        }
    }


    if (lyricsCache) {
        try {
            const lyricsFromCache = await lyricsCache.get(trackId);
            if (lyricsFromCache) {
                if (navigator.onLine && lyricsFromCache?.expiresAt < new Date().getTime()) {
                    await lyricsCache.remove(trackId);
                } else {
                    storage.set("currentLyricsData", JSON.stringify(lyricsFromCache));
                    storage.set("currentlyFetching", "false");
                    if (document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer")) {
                        document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer").classList.remove("active");
                    }
                    if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
                        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
                    }
                    return { ...lyricsFromCache, fromCache: true };
                }
            }
        } catch (error) {
            if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
                document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
            }
            console.log("Error parsing saved lyrics data:", error);
            return noLyricsMessage();
        }
    }

    if (!navigator.onLine) return urOfflineMessage();

    if (document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer")) {
        document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer").classList.add("active");
    }


    // Fetch new lyrics if no match in localStorage
    const lyricsApi = storage.get("customLyricsApi") ?? "https://api.spicy-lyrics.spikerko.org/lyrics/{SPOTIFY_ID}";
    const lyricsAccessToken = storage.get("lyricsApiAccessToken") ?? "unm5fVvh#$FAJ2FRKZOJhLrrhUWKB9v#2#pZ3U^!PCJFisUEBwjVBIETWM*gzR";
    try {
        const response = await fetch(`${lyricsApi?.replace("{SPOTIFY_ID}", trackId)}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Spicetify.Platform.Session.accessToken}`,
                "access-token": lyricsAccessToken
            }
        });

        if (response.status !== 200) {
            if (response.status === 401) {
                storage.set("currentlyFetching", "false");
               //fetchLyrics(uri);
                window.location.reload();
                return;
            }
            if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
                document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
            }
            return noLyricsMessage();
        }

        const lyricsText = await response.text();

        if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
            document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
        }

        if (lyricsText === "") return noLyricsMessage();

        const lyricsJson = JSON.parse(lyricsText);

        // Store the new lyrics in localStorage
        storage.set("currentLyricsData", JSON.stringify(lyricsJson));

        storage.set("currentlyFetching", "false");

        if (document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer")) {
            document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer").classList.remove("active");
        }

        if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
            document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
        }

        if (lyricsCache) {
            const expiresAt = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; // Expire after 7 days

            try {
                await lyricsCache.set(trackId, {
                    ...lyricsJson,
                    expiresAt
                });
            } catch (error) {
                console.error("Error saving lyrics to cache:", error);
            }
        }

        return { ...lyricsJson, fromCache: false };
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        storage.set("currentlyFetching", "false");
        if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
            document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
        }
        return noLyricsMessage();
    }
    
}


function noLyricsMessage() {
    /* const totalTime = Spicetify.Player.getDuration() / 1000;
    const segmentDuration = totalTime / 3;
    
    const noLyricsMessage = {
        "Type": "Syllable",
        "alternative_api": false,
        "Content": [
            {
                "Type": "Vocal",
                "OppositeAligned": false,
                "Lead": {
                    "Syllables": [
                        {
                            "Text": "We're working on the Lyrics...",
                            "StartTime": 0,
                            "EndTime": 10,
                            "IsPartOfWord": false
                        }
                    ],
                    "StartTime": 0,
                    "EndTime": 10
                }
            },
            {
                "Type": "Vocal",
                "OppositeAligned": false,
                "Lead": {
                    "Syllables": [
                        {
                            "Text": "♪",
                            "StartTime": 0,
                            "EndTime": segmentDuration,
                            "IsPartOfWord": true
                        },
                        {
                            "Text": "♪",
                            "StartTime": segmentDuration,
                            "EndTime": 2 * segmentDuration,
                            "IsPartOfWord": true
                        },
                        {
                            "Text": "♪",
                            "StartTime": 2 * segmentDuration,
                            "EndTime": totalTime,
                            "IsPartOfWord": false
                        }
                    ],
                    "StartTime": 0,
                    "EndTime": totalTime
                }
            }
        ]
    }; */

    const noLyricsMessage = {
        Type: "Static",
        alternative_api: false,
        offline: false,
        Lines: [
            {
                Text: "No Lyrics Found"
            }
        ]
    }
    

    storage.set("currentLyricsData", JSON.stringify(noLyricsMessage));

    storage.set("currentlyFetching", "false");

    if (document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer")) {
        document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer").classList.remove("active");
    }

    return noLyricsMessage;
}

function urOfflineMessage() {
    const Message = {
        Type: "Static",
        alternative_api: false,
        offline: true,
        Lines: [
            {
                Text: "You're offline"
            },
            {
                Text: ""
            },
            {
                Text: "[DEF=font_size:small]This extension works only if you're online."
            }
        ]
    };
    

    storage.set("currentlyFetching", "false");

    if (document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer")) {
        document.querySelector("#LyricsPageContainer .lyricsParent .loaderContainer").classList.remove("active");
    }

    if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) {
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").innerHTML = "";
    }

    return Message;
}