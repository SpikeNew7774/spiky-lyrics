import React, { useEffect, useState } from "react";
import { darkenColor } from "../functions/darkenColor";
import storage from "../functions/storage";

export default function DynamicBackground() {
    const [currentImgCover, setCurrentImgCover] = useState<string>(Spicetify.Player.data?.item.metadata.image_url);

    Spicetify.Player.addEventListener("songchange", (event) => {
        const cover = event.data.item.metadata.image_url;
        setCurrentImgCover(cover);
    });
    
    const lowQMode = storage.get("lowQMode");
    const lowQModeEnabled = lowQMode && lowQMode === "true";
/* 
    if (lowQModeEnabled) {
        if (document.querySelector<HTMLElement>(".spicy-single-bg")) {
            try { */
    //const [extractedColor, setExtractedColor] = useState<any>(null);
    
   
        Spicetify.colorExtractor(Spicetify.Player.data.item.uri).then(colors => {
            //setExtractedColor(colors);
            if (lowQModeEnabled) {
                document.querySelector<HTMLElement>("#LyricsPageContainer .lyricsParent").style.backgroundColor = colors.DESATURATED;
            }

            //document.querySelector<HTMLElement>("#LyricsPageContainer .lyricsParent .lyrics").style.setProperty("--ScrollbarScrollerColor", darkenColor(colors.VIBRANT, 15));

        }).catch(err => {
            console.error("Error extracting color:", err);
        });


/*                 document.querySelector<HTMLElement>(".spicy-single-bg").style.backgroundColor = extractedColor.VIBRANT_NON_ALARMING;
            } catch (error) {
                console.error("Error extracting color:", error);
            }
        }
    } */


    return (
        !lowQModeEnabled ? (
            <div className="spicy-dynamic-bg">
                <img className="Front" src={currentImgCover} />
                <img className="Back" src={currentImgCover} />
                <img className="BackCenter" src={currentImgCover} />
            </div>
        ) : null
    );    
}