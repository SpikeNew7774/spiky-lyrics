import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import storage from './storage';

gsap.registerPlugin(ScrollToPlugin); 

export const ScrollingIntervalTime = 150;

function convertTime(time: any): any { 
  return time * 1000;
}

const lyricsBetweenShow = 5;
let timeOffset = 0;
/* const musicalEmoji = "♪"

const lyricsBlur = "none"
let textGlowDef = "rgba(255,255,255,0.15) 0px 0px 6px"
let activeTextGlowDef = "rgba(255,255,255,0.4) 0px 0px 14px"
const globalOpacityLyr = "0.65"

const gradientAlpha = "0.85";
const gradientAlphaEnd = "0.4"; */

export function checkLowQStatus() {
  const lowQMode = storage.get("lowQMode");

  if (lowQMode && lowQMode == "true") {

    document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").style.setProperty("--TextGlowDef", "rgba(255,255,255,0.07) 0px 0px 2px")
    document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").style.setProperty("--ActiveTextGlowDef", "rgba(255,255,255,0.24) 0px 0px 5px")
    document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").style.setProperty("--StrongTextGlowDef", "rgba(255,255,255,0.35) 0px 0px 5.3px")
    document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").style.setProperty("--StrongerTextGlowDef", "rgba(255,255,255,0.4) 0px 0px 4.9px")
    /* textGlowDef = "rgba(255,255,255,0.07) 0px 0px 2px"
    activeTextGlowDef = "rgba(255,255,255,0.24) 0px 0px 5px" */
  }
}

export function syllableLyrics(data) {
  if (!document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) return
/*   const topSpace = document.createElement("div")
  topSpace.classList.add("topSpace")
  document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(topSpace) */

  if (data.StartTime >= lyricsBetweenShow) {
    const musicalLine = document.createElement("div")
    musicalLine.classList.add("line")
    musicalLine.classList.add("musical-line")
    musicalLine.setAttribute("start", "0")
    musicalLine.setAttribute("end", convertTime(data.StartTime))
    musicalLine.setAttribute("total", convertTime(data.StartTime))
    if (data.Content[0].OppositeAligned) {
      musicalLine.style.textAlign = "end"
    }

    const dotGroup = document.createElement("div");
    dotGroup.classList.add("dotGroup");

    const musicalDots1 = document.createElement("span");
    const musicalDots2 = document.createElement("span");
    const musicalDots3 = document.createElement("span");

    const totalTime = convertTime(data.StartTime);
    const dotTime = totalTime / 3; 

    musicalDots1.classList.add("word");
    musicalDots1.classList.add("dot");
    musicalDots1.textContent = "•";
    musicalDots1.setAttribute("start", 0);
    musicalDots1.setAttribute("end", dotTime);
    musicalDots1.setAttribute("total", dotTime);

    musicalDots2.classList.add("word");
    musicalDots2.classList.add("dot");
    musicalDots2.textContent = "•";
    musicalDots2.setAttribute("start", dotTime);
    musicalDots2.setAttribute("end", dotTime * 2);
    musicalDots2.setAttribute("total", dotTime);

    musicalDots3.classList.add("word");
    musicalDots3.classList.add("dot");
    musicalDots3.textContent = "•";
    musicalDots3.setAttribute("start", dotTime * 2);
    musicalDots3.setAttribute("end", convertTime(data.StartTime) - 400);
    musicalDots3.setAttribute("total", dotTime);

    dotGroup.appendChild(musicalDots1);
    dotGroup.appendChild(musicalDots2);
    dotGroup.appendChild(musicalDots3);

    musicalLine.appendChild(dotGroup);
    document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(musicalLine)
  }
    data.Content.forEach((line, index, arr) => {
      const lineElem = document.createElement("div")
      lineElem.classList.add("line")
      //const lastWordEndTime = line.Lead.Syllables[line.Lead.Syllables.length - 1].EndTime;
      lineElem.setAttribute("start", convertTime(line.Lead.StartTime))
      lineElem.setAttribute("end", convertTime(line.Lead.EndTime))
      lineElem.setAttribute("total", convertTime(line.Lead.EndTime) - convertTime(line.Lead.StartTime))
  
      //
      //lineElem.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%)"
      /* lineElem.style.setProperty("--gradient-position", "100%")
      lineElem.style.setProperty("--gradient-alpha", "0.4")
      lineElem.style.setProperty("--gradient-alpha-end", "0.4")
      lineElem.style.setProperty("--gradient-degrees", "90deg") */
      //lineElem.style.opacity = globalOpacityLyr
  
      if (line.OppositeAligned) {
        lineElem.style.textAlign = "end"
      }

      

      /* if (index === 0) {
        const topSpace = document.createElement("div")
        topSpace.classList.add("topSpace")
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(topSpace)
      } */

      document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineElem)
      
      /* if (arr.length - 1 === index) {
        const lineSpace = document.createElement("div")
        lineSpace.classList.add("lineSpace")
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineSpace)
      } */
  
      //document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild("<br>")
  
      
  
      line.Lead.Syllables.forEach(lead => {
        let word = document.createElement("span")
        //word.textContent = lead.Text
        const totalDuration = convertTime(lead.EndTime) - convertTime(lead.StartTime);
        if (totalDuration >= 990) {
          word = document.createElement("div")
          const letters = lead.Text.split(""); // Split word into individual letters
          const letterDuration = (totalDuration - 10) / letters.length; // Duration per letter
          
          letters.forEach((letter, index) => {
            const letterElem = document.createElement("span");
            letterElem.textContent = letter;
            letterElem.classList.add("word");
  
            // Calculate start and end time for each letter
            const letterStartTime = convertTime(lead.StartTime) + index * letterDuration;
            const letterEndTime = letterStartTime + letterDuration;
  
            letterElem.setAttribute("start", letterStartTime);
            letterElem.setAttribute("end", letterEndTime);
            letterElem.setAttribute("total", letterDuration);
            
            word.appendChild(letterElem);
          });
          word.classList.add("letterGroup")
          lineElem.appendChild(word);
          if (!lead.IsPartOfWord) {
            lineElem.append(" ")
          }
        } else {
          word.textContent = lead.Text;
  
          word.setAttribute("start", convertTime(lead.StartTime))
          word.setAttribute("end", convertTime(lead.EndTime))
          word.setAttribute("total", totalDuration)
          //word.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%)"
         /*  word.style.setProperty("--gradient-position", "100%")
          word.style.setProperty("--gradient-alpha", "0.4")
          word.style.setProperty("--gradient-alpha-end", "0.4")
          word.style.setProperty("--gradient-degrees", "90deg")  */
          //word.style.opacity = globalOpacityLyr
          //lineElem.appendChild(word)
          
    
          
    
          word.classList.add("word");
  
          lineElem.appendChild(word);
  
          if (!lead.IsPartOfWord) {
            lineElem.append(" ")
          }
        }
  
       
  
       /*  document.querySelector('#LyricsPageContainer .lyricsParent .lyrics').style.ponterEvents = null
  
        document.querySelector('#LyricsPageContainer .lyricsParent .llparent').style.display = 'none'
        document.querySelector('#LyricsPageContainer .lyricsParent .bgcover').style.display = 'none' */
  
        //if (lyricsInt !== false) {
          /* clearInterval(lyricsInt)
          lyricsInt = null; */
        //}
  
        
        
      })
      if (line.Background) {
        line.Background.forEach((bg) => {
          const lineE = document.createElement("div");
          lineE.classList.add("line")
          lineE.setAttribute("start", convertTime(bg.StartTime))
          lineE.setAttribute("end", convertTime(bg.EndTime))
          lineE.setAttribute("total", convertTime(bg.EndTime) - convertTime(bg.StartTime))
          //lineE.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
          /* lineE.style.setProperty("--gradient-position", "100%")
          lineE.style.setProperty("--gradient-alpha", "0.4")
          lineE.style.setProperty("--gradient-alpha-end", "0.4")
          lineE.style.setProperty("--gradient-degrees", "90deg") */
          //lineE.style.opacity = globalOpacityLyr
          if (line.OppositeAligned) {
              lineE.style.textAlign = "end"
          }
          document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineE)
          bg.Syllables.forEach(bw => {
            const bwE = document.createElement("span")
            bwE.textContent = bw.Text
            bwE.setAttribute("start", convertTime(bw.StartTime))
            bwE.setAttribute("end", convertTime(bw.EndTime))
            bwE.setAttribute("total", convertTime(bw.EndTime) - convertTime(bw.StartTime))
            bwE.classList.add("bg-word")
            bwE.classList.add("word")
            //bwE.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
            /* bwE.style.setProperty("--gradient-position", "100%")
            bwE.style.setProperty("--gradient-alpha", "0.4")
            bwE.style.setProperty("--gradient-alpha-end", "0.4")
            bwE.style.setProperty("--gradient-degrees", "90deg") */
           // bwE.style.opacity = globalOpacityLyr
            lineE.appendChild(bwE)
            if (!bw.IsPartOfWord) {
              lineE.append(" ")
            }
          })
        })
      }
      try {
        if (arr[index + 1].Lead.StartTime - line.Lead.EndTime >= lyricsBetweenShow) {
          const musicalLine = document.createElement("div")
          musicalLine.classList.add("line")
          musicalLine.classList.add("musical-line")
          //musicalLine.textContent = musicalEmoji
          /* musicalLine.style.setProperty("--gradient-position", "100%")
          musicalLine.style.setProperty("--gradient-alpha", "0.4")
          musicalLine.style.setProperty("--gradient-alpha-end", "0.4")
          musicalLine.style.setProperty("--gradient-degrees", "90deg") */
          //musicalLine.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%)"
          musicalLine.setAttribute("start", convertTime(line.Lead.EndTime))
          musicalLine.setAttribute("end", convertTime(arr[index + 1].Lead.StartTime))
          musicalLine.setAttribute("total", convertTime(arr[index + 1].Lead.StartTime) - convertTime(line.Lead.EndTime))
          if (line.OppositeAligned) {
            musicalLine.style.textAlign = "end"
          }
      
          const dotGroup = document.createElement("div");
          dotGroup.classList.add("dotGroup");
      
          const musicalDots1 = document.createElement("span");
          const musicalDots2 = document.createElement("span");
          const musicalDots3 = document.createElement("span");
      
          const totalTime = convertTime(arr[index + 1].Lead.StartTime) - convertTime(line.Lead.EndTime);
          const dotTime = totalTime / 3; 
      
          musicalDots1.classList.add("word");
          musicalDots1.classList.add("dot");
          musicalDots1.textContent = "•";
          musicalDots1.setAttribute("start", convertTime(line.Lead.EndTime));
          musicalDots1.setAttribute("end", convertTime(line.Lead.EndTime) + dotTime);
          musicalDots1.setAttribute("total", dotTime);
      
          musicalDots2.classList.add("word");
          musicalDots2.classList.add("dot");
          musicalDots2.textContent = "•";
          musicalDots2.setAttribute("start", convertTime(line.Lead.EndTime) + dotTime);
          musicalDots2.setAttribute("end", convertTime(line.Lead.EndTime) + (dotTime * 2));
          musicalDots2.setAttribute("total", dotTime);
      
          musicalDots3.classList.add("word");
          musicalDots3.classList.add("dot");
          musicalDots3.textContent = "•";
          musicalDots3.setAttribute("start", convertTime(line.Lead.EndTime) + (dotTime * 2));
          musicalDots3.setAttribute("end", convertTime(arr[index + 1].Lead.StartTime) - 400);
          musicalDots3.setAttribute("total", dotTime);
      
          dotGroup.appendChild(musicalDots1);
          dotGroup.appendChild(musicalDots2);
          dotGroup.appendChild(musicalDots3);
      
          musicalLine.appendChild(dotGroup);
          document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(musicalLine)
        }
      } catch (error) {
        
      }
    });
    /* data.Content.forEach(line => {
      if (line.Background) {
        line.Background.forEach(bg => {
          const lineE = document.createElement("div");
          lineE.classList.add("line")
          lineE.setAttribute("start", convertTime(bg.StartTime))
          lineE.setAttribute("end", convertTime(bg.EndTime))
          document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineE)
          bg.Syllables.forEach(bw => {
            const bwE = document.createElement("span")
            bwE.textContent = bw.Text
            lineE.setAttribute("start", convertTime(bw.StartTime))
            lineE.setAttribute("end", convertTime(bw.EndTime))
            bwE.classList.add("bg-word")
            bwE.classList.add("word")
            lineE.appendChild(bwE)
            if (!bw.IsPartOfWord) {
              lineE.append(" ")
            }
          })
        })
      }
    }) */
      //startLyricsInInt("Syllable")
  
  document.querySelectorAll("#LyricsPageContainer .lyricsParent .lyrics .line").forEach(line => {
      //line.querySelectorAll(".word").forEach(word => {
     
          line.addEventListener("click", e => { 
            /* if (ifPlayerUsingWPSDK == true) { 
              outwsdkplayer.seek(e.currentTarget.getAttribute("start"));  // Use e.currentTarget to get the `.line`'s "start" attribute
              return; 
            } */
            Spicetify.Player.seek(e.currentTarget.getAttribute("start"))  // Same logic if not using WPSDK
          })

          /* line.addEventListener("mouseover", e => {
            line.querySelectorAll("word").forEach(word => {
              word.style.filter = "blur(0px)"
              word.style.opacity = "1"
              word.classList.add("crepl")
            })
          })

          line.addEventListener("mouseout", e => {
            line.querySelectorAll("word").forEach(word => {
              word.classList.remove("crepl")
            })
          }) */
      
        
        /* line.addEventListener("mouseover", e => {
          if (screen.width < 475) return
          e.target.classList.add("crepl")
          e.target.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
          e.target.style.opacity = "1"
          e.target.style.filter = "blur(0px)"
        })
  
        line.addEventListener("mouseout", e => {
          if (screen.width < 475) return
          line.classList.remove("crepl")
          //if (line.getAttribute("start") <= edtrackpos) {
            line.style.opacity = globalOpacityLyr
            line.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%)"
            line.style.filter = lyricsBlur
            line.style.textShadow = textGlowDef
          //}
          /*  else {
            line.style.opacity = globalOpacityLyr
            line.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
            line.style.filter = lyricsBlur
            line.style.textShadow = "none"
          } 
        }) */
      })
  //}) 
      scrollToActiveLine(true);
  }
  
  export function lineLyrics(data) {
    if (!document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) return
    
/*     const topSpace = document.createElement("div")
    topSpace.classList.add("topSpace")
    document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(topSpace) */

      if (data.StartTime >= lyricsBetweenShow) {
        const musicalLine = document.createElement("div")
        musicalLine.classList.add("line")
        musicalLine.classList.add("musical-line")
        musicalLine.setAttribute("start", "0")
        musicalLine.setAttribute("end", convertTime(data.StartTime))
        musicalLine.setAttribute("total", convertTime(data.StartTime))
        if (data.Content[0].OppositeAligned) {
          musicalLine.style.textAlign = "end"
        }
    
        const dotGroup = document.createElement("div");
        dotGroup.classList.add("dotGroup");
    
        const musicalDots1 = document.createElement("span");
        const musicalDots2 = document.createElement("span");
        const musicalDots3 = document.createElement("span");
    
        const totalTime = convertTime(data.StartTime);
        const dotTime = totalTime / 3; 
    
        musicalDots1.classList.add("word");
        musicalDots1.classList.add("dot");
        musicalDots1.textContent = "•";
        musicalDots1.setAttribute("start", 0);
        musicalDots1.setAttribute("end", dotTime);
        musicalDots1.setAttribute("total", dotTime);

        musicalDots2.classList.add("word");
        musicalDots2.classList.add("dot");
        musicalDots2.textContent = "•";
        musicalDots2.setAttribute("start", dotTime);
        musicalDots2.setAttribute("end", dotTime * 2);
        musicalDots2.setAttribute("total", dotTime);

        musicalDots3.classList.add("word");
        musicalDots3.classList.add("dot");
        musicalDots3.textContent = "•";
        musicalDots3.setAttribute("start", dotTime * 2);
        musicalDots3.setAttribute("end", convertTime(data.StartTime) - 400);
        musicalDots3.setAttribute("total", dotTime);
    
        dotGroup.appendChild(musicalDots1);
        dotGroup.appendChild(musicalDots2);
        dotGroup.appendChild(musicalDots3);
    
        musicalLine.appendChild(dotGroup);
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(musicalLine)
      }
    data.Content.forEach((line, index, arr) => {
      const lineElem = document.createElement("div")
      lineElem.textContent = line.Text
      lineElem.classList.add("line")
      //lineElem.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%)"
      /* lineElem.style.setProperty("--gradient-position", "100%")
          lineElem.style.setProperty("--gradient-alpha", "0.4")
          lineElem.style.setProperty("--gradient-alpha-end", "0.4")
          lineElem.style.setProperty("--gradient-degrees", "90deg") */
      //lineElem.style.opacity = globalOpacityLyr
      lineElem.setAttribute("start", convertTime(line.StartTime))
      lineElem.setAttribute("end", convertTime(line.EndTime))
      lineElem.setAttribute("total", convertTime(line.EndTime) - convertTime(line.StartTime))
      if (line.OppositeAligned) {
        lineElem.style.textAlign = "end"
      }

      

      /* if (index === 0) {
        const topSpace = document.createElement("div")
        topSpace.classList.add("topSpace")
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(topSpace)
      } */

      document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineElem)
  
      /* if (arr.length - 1 === index) {
        const lineSpace = document.createElement("div")
        lineSpace.classList.add("lineSpace")
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineSpace)
      } */
  
      //document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild("<br>")
      
  
        /* document.querySelector('#LyricsPageContainer .lyricsParent .lyrics').style.ponterEvents = null
  
        document.querySelector('#LyricsPageContainer .lyricsParent .llparent').style.display = 'none'
        document.querySelector('#LyricsPageContainer .lyricsParent .bgcover').style.display = 'none' */
  
          /* clearInterval(lyricsInt)
          lyricsInt = null; */
  
        
  
        // Initial start of the interval
  
        if (line.Background) {
          line.Background.forEach(bg => {
            const lineE = document.createElement("div");
            lineE.textContent = bg.Text
            //lineE.style.fontSize = "20px"
            lineE.classList.add("bg-line")
            lineE.classList.add("line")
            lineE.setAttribute("start", convertTime(bg.StartTime))
            lineE.setAttribute("end", convertTime(bg.EndTime))
            lineE.setAttribute("total", convertTime(bg.EndTime) - convertTime(bg.StartTime))
            document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineE)
            /* bg.Syllables.forEach(bw => {
              const bwE = document.createElement("span")
              bwE.textContent = bw.Text
              bwE.style.fontSize = "20px"
              bwE.classList.add("bg-word")
              bwE.classList.add("word")
              lineE.appendChild(bwE)
              if (!bw.IsPartOfWord) {
                lineE.append(" ")
              }
            })  */
          })
        }

        try {
          if (arr[index + 1].StartTime - line.EndTime >= lyricsBetweenShow) {
            const musicalLine = document.createElement("div")
            musicalLine.classList.add("line")
            musicalLine.classList.add("musical-line")
            //musicalLine.textContent = musicalEmoji
            /* musicalLine.style.setProperty("--gradient-position", "100%")
            musicalLine.style.setProperty("--gradient-alpha", "0.4")
            musicalLine.style.setProperty("--gradient-alpha-end", "0.4")
            musicalLine.style.setProperty("--gradient-degrees", "90deg") */
            //musicalLine.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%)"
            musicalLine.setAttribute("start", convertTime(line.Lead.EndTime))
            musicalLine.setAttribute("end", convertTime(arr[index + 1].Lead.StartTime))
            musicalLine.setAttribute("total", convertTime(arr[index + 1].Lead.StartTime) - convertTime(line.Lead.EndTime))
            if (line.OppositeAligned) {
              musicalLine.style.textAlign = "end"
            }
        
            const dotGroup = document.createElement("div");
            dotGroup.classList.add("dotGroup");
        
            const musicalDots1 = document.createElement("span");
            const musicalDots2 = document.createElement("span");
            const musicalDots3 = document.createElement("span");
        
            const totalTime = convertTime(arr[index + 1].Lead.StartTime) - convertTime(line.Lead.EndTime);
            const dotTime = totalTime / 3; 
        
            musicalDots1.classList.add("word");
            musicalDots1.classList.add("dot");
            musicalDots1.textContent = "•";
            musicalDots1.setAttribute("start", convertTime(line.Lead.EndTime));
            musicalDots1.setAttribute("end", convertTime(line.Lead.EndTime) + dotTime);
            musicalDots1.setAttribute("total", dotTime);
        
            musicalDots2.classList.add("word");
            musicalDots2.classList.add("dot");
            musicalDots2.textContent = "•";
            musicalDots2.setAttribute("start", convertTime(line.Lead.EndTime) + dotTime);
            musicalDots2.setAttribute("end", convertTime(line.Lead.EndTime) + (dotTime * 2));
            musicalDots2.setAttribute("total", dotTime);
        
            musicalDots3.classList.add("word");
            musicalDots3.classList.add("dot");
            musicalDots3.textContent = "•";
            musicalDots3.setAttribute("start", convertTime(line.Lead.EndTime) + (dotTime * 2));
            musicalDots3.setAttribute("end", convertTime(arr[index + 1].Lead.StartTime) - 400);
            musicalDots3.setAttribute("total", dotTime);
        
            dotGroup.appendChild(musicalDots1);
            dotGroup.appendChild(musicalDots2);
            dotGroup.appendChild(musicalDots3);
        
            musicalLine.appendChild(dotGroup);
            document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(musicalLine)
          }
        } catch (error) {
          
        }
    })
    /* data.Content.forEach(line => {
      if (line.Background) {
        line.Background.forEach(bg => {
            const lineE = document.createElement("div");
            lineE.textContent = bg.Text
            lineE.classList.add("bg-line")
            lineE.classList.add("line")
            lineE.setAttribute("start", convertTime(bg.StartTime))
            lineE.setAttribute("end", convertTime(bg.EndTime))
            document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineE)
            bg.Syllables.forEach(bw => {
              const bwE = document.createElement("span")
              bwE.textContent = bw.Text
              bwE.classList.add("bg-word")
              bwE.classList.add("word")
              lineE.appendChild(bwE)
              if (!bw.IsPartOfWord) {
                lineE.append(" ")
              }
            }) 
          })
      }
    }) */
      //startLyricsInInt("Line");
  
    document.querySelectorAll("#LyricsPageContainer .lyricsParent .lyrics .line").forEach(line => {
      line.addEventListener("click", e => {
        Spicetify.Player.seek(e.target.getAttribute("start"))
      })
        /* line.addEventListener("mouseover", e => {
          if (screen.width < 475) return
          e.target.classList.add("crepl")
          e.target.style.color = "#FFFFFF"
          e.target.opacity = "1"
          e.target.style.filter = "blur(0px)"
        })
  
        line.addEventListener("mouseout", e => {
          if (screen.width < 475) return
          e.target.classList.remove("crepl")
        }) */
  })
  scrollToActiveLine(true);
  }

  export function staticLyrics(data) {
    if (!document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) return
    if (document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").classList.contains("offline")) {
      document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").classList.remove("offline");
    }
    
    data.Lines.forEach((line, index, arr) => {
      const lineElem = document.createElement("div")

      if (data.offline) {
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").classList.add("offline");
      }
      
      if (line.Text.includes("[DEF=font_size:small]")) {
        lineElem.style.fontSize = "35px"
        lineElem.textContent = line.Text.replace("[DEF=font_size:small]", "")
      } else {
        lineElem.textContent = line.Text
      }
      
      lineElem.classList.add("line")
      lineElem.classList.add("static")
      //lineElem.setAttribute("start", convertTime(line.StartTime))
      //lineElem.setAttribute("end", convertTime(line.EndTime))
      
      /* if (index === 0) {
        const topSpace = document.createElement("div")
        topSpace.classList.add("topSpace")
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(topSpace)
      } */

      

      document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineElem)

      /* if (arr.length - 1 === index) {
        const lineSpace = document.createElement("div")
        lineSpace.classList.add("lineSpace")
        document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild(lineSpace)
      } */
  
      //document.querySelector("#LyricsPageContainer .lyricsParent .lyrics").appendChild("<br>")
      
  
  
          /* clearInterval(lyricsInt)
          lyricsInt = null */

        //document.querySelector("#LyricsPageContainer .lyricsParent .informationBox").textContent = "These lyrics haven't been synced yet."
  
    })
  }

 //let isScrolling = false; // Flag to track scrolling state
  //let scrollTimeout; // Define scrollTimeout outside the listener
/*   let isHovering = false;
  let moveTimeout;

  setInterval(() => {
    if (!document.querySelector<HTMLElement>("#LyricsPageContainer .lyricsParent .lyrics")) return;
    const lyricsContainer = document.querySelector<HTMLElement>("#LyricsPageContainer .lyricsParent .lyrics");
  
    /* lyricsContainer.addEventListener('scroll', () => {
      isScrolling = true;
  
      // Reset scrolling flag after a short delay
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }); 
  
    lyricsContainer.addEventListener('mousemove', () => {
      isHovering = true; // Set isMoving to true on mousemove
  
      clearTimeout(moveTimeout); // Clear previous timeout
      moveTimeout = setTimeout(() => {
        isHovering = false; // Set isMoving back to false after a delay
      }, 2000); // Adjust delay as needed
    });
  }, 200) */


function startLyricsInInt(position) {

  /* if (Spicetify.Player.data.item.mediaType === "video") {
    timeOffset = -950;
  } else {
    timeOffset = 0;
  } */

  const lowQMode = Spicetify.LocalStorage.get("SpicyLyrics-lowQMode");
  const lowQModeEnabled = lowQMode && lowQMode === "true";
  const edtrackpos = position + timeOffset;

      if (storage.get("currentLyricsType") != null && storage.get("currentLyricsType") === "Syllable") {
        //if (lastEdTrackPos === edtrackpos) return
      //lastEdTrackPos = edtrackpos
      //if (document.querySelector('#LyricsPageContainer').classList.contains('active')) {
        document.querySelectorAll("#LyricsPageContainer .lyricsParent .lyrics .line").forEach((line, index, arr) => {
          /* if (edtrackpos >= line.getAttribute("end") && arr[index + 1].getAttribute("start") >= edtrackpos) {
            line.classList.add('lnc')
            line.style.color = "white"
            line.querySelectorAll("span").forEach(word => {
              word.classList.add("lnc")
              word.style.color = "white"
            })
          } else if (edtrackpos <= line.getAttribute("end") || arr[index + 1].getAttribute("start") <= edtrackpos) {
            line.classList.remove('lnc')
          } */
          if (line.getAttribute("start") <= edtrackpos && edtrackpos <= line.getAttribute("end")) {
            //line.style.opacity = "1"
            //line.style.color = "#FFFFFF"
            //line.style.filter = "blur(0px)"
            //line.style.textShadow = textGlowDef
             // Calculate base blur amount (can be 0 if you don't want any blur by default)
           /*  let blurAmountMultiplier = 1; 

            if (lowQModeEnabled || !Spicetify.Player.isPlaying()) {
              // Increase blur amount when both scrolling and hovering
              blurAmountMultiplier = 0; // Adjust this value as needed
            } 
              for (let i = index + 1; i < arr.length; i++) {
                  const blurAmount = 1.25 * (i - index) * blurAmountMultiplier;
                  arr[i].style.setProperty("--blur-px", `${blurAmount}px`)
              }
      
              // Apply blur to lines BEFORE the active line (in viewport)
              for (let i = index - 1; i >= 0; i--) {
                  const blurAmount = 1.25 * (index - i) * blurAmountMultiplier;
                  arr[i].style.setProperty("--blur-px", `${blurAmount}px`)
              } */
            
            line.classList.add("Active")
            line.classList.remove("Sung")
            line.classList.remove("NotSung")
            line.querySelectorAll(".word").forEach((word, index, arr) => {
              if (word.getAttribute("start") <= edtrackpos && edtrackpos <= word.getAttribute("end")) {
                //word.style.opacity = "1"
                //word.style.color = "#FFFFFF"
                //word.style.filter = "blur(0px)"
                //word.style.textShadow = activeTextGlowDef

                /* if (word.parentElement.classList.contains("letterGroup")) {
                  word.parentElement.querySelectorAll(".word").forEach(word1 => {
                    word1.style.opacity = "1"
                    //word.style.color = "#FFFFFF"
                    word1.style.filter = "blur(0px)"
                    word1.style.textShadow = activeTextGlowDef
                  })
                } */

                

                //if (lastGradientPercentage !== percentage) {
                 // lastGradientPercentage = percentage

                  //const lngValue = ifPlayerUsingWPSDK ? `linear-gradient(90deg, rgba(255,255,255,1) ${percentage}%, rgba(255,255,255,0.4) ${percentage + 20}%)` : `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)`

                  //word.style.backgroundImage = lngValue

                  /* if (ifPlayerUsingWPSDK) {
                    const totalDuration = word.getAttribute("total");
                    const elapsedDuration = edtrackpos - word.getAttribute("start");
                    const percentage = (elapsedDuration / totalDuration) * 100;
                    //console.log("Percentage:", percentage)
                    //if (lastGradientPercentage !== percentage) {
                     // lastGradientPercentage = percentage
                      word.style.setProperty("--gradient-position", `${percentage}%`)
                      word.style.setProperty("--gradient-alpha", "1")
                      word.style.setProperty("--gradient-alpha-end", "0.4")
                      word.style.setProperty("--gradient-degrees", "90deg")
                   // }
                  } else {
                    word.style.setProperty("--gradient-position", "100%")
                    word.style.setProperty("--gradient-alpha", "1")
                    word.style.setProperty("--gradient-alpha-end", "1")
                    word.style.setProperty("--gradient-degrees", "90deg")
                  } */

                  //console.log("Updateeed")
                //}

               // if (word.classList.contains("close-to-class")) {
               // }

                if (lowQModeEnabled) {
                  word.style.setProperty("--gradient-position", `100%`)
                } else {
                  const totalDuration = word.getAttribute("total");
                  const elapsedDuration = edtrackpos - word.getAttribute("start");
                  const percentage = (elapsedDuration / totalDuration) * 100;

                  word.style.setProperty("--gradient-position", `${percentage}%`)

                }
                /* word.style.setProperty("--gradient-alpha", "1")
                word.style.setProperty("--gradient-alpha-end", "0.4")
                word.style.setProperty("--gradient-degrees", "90deg") */
                
                //word.style.setProperty("--lyr-gr-pos", `${percentage}%`)
                word.classList.add("Active")
                word.classList.remove("Sung")
                word.classList.remove("NotSung")
              } else if (word.getAttribute("start") >= edtrackpos) {
                // este bude
                //if (!word.classList.contains("crepl") && !word.classList.contains("close-to-class")) {
                  //word.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
                  //word.style.filter = "blur(0px)"
                  //word.style.opacity = globalOpacityLyr;
                  //word.style.textShadow = "none"
                  //word.style.setProperty("--gradient-position", "-20%")
                  /* word.style.setProperty("--gradient-position", "100%")
                  word.style.setProperty("--gradient-alpha", "0.4")
                  word.style.setProperty("--gradient-alpha-end", "0.4")
                  word.style.setProperty("--gradient-degrees", "90deg") */
                  word.classList.remove("Active")
                  word.classList.add("NotSung")
                  word.classList.remove("Sung")
                //}
              } else if (edtrackpos >= word.getAttribute("end")) {
                //uz bolo
                //if (!word.classList.contains("crepl")) {
                  //word.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"

                  //word.style.setProperty("--gradient-position", "120%")

                  /* if (word.classList.contains("close-to-class")) {
                    word.classList.remove("close-to-class");
                  } */
                  /* word.style.setProperty("--gradient-alpha", "1")
                  word.style.setProperty("--gradient-alpha-end", "1")
                  word.style.setProperty("--gradient-degrees", "90deg") */

                  //word.style.filter = "blur(0px)"
                  //word.style.opacity = globalOpacityLyr;
                  //word.style.opacity = "1"
                  //word.style.textShadow = textGlowDef

                  word.classList.remove("Active")
                  word.classList.add("Sung")
                  word.classList.remove("NotSung")
                //}
              }
              /* if (edtrackpos >= word.getAttribute("end")) {
                if (!word.classList.contains("crepl")) {
                  word.style.opacity = "1";
                  word.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
                  //word.style.color = "#FFFFFF"
                  word.style.filter = "blur(0px)"
                  word.style.textShadow = "none"
                }
              } */
            })
          } else if (line.getAttribute("start") >= edtrackpos) {
            //este bude
            //if (!line.classList.contains("crepl")) {
              //line.style.opacity = globalOpacityLyr
              //line.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
              //line.style.filter = lyricsBlur
              //line.style.textShadow = "none"
              line.classList.remove("Active")
              line.classList.remove("Sung")
              line.classList.add("NotSung")
           // }
            /* if (line.classList.contains("musical-line")) {
              //line.style.display = "none"
              line.style.textShadow = "none"
            } */
            line.querySelectorAll(".word").forEach(word => {
              //if (!word.classList.contains("crepl")) {
                //word.style.opacity = globalOpacityLyr
                //word.style.setProperty("--gradient-position", "-20%")
                //word.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
                //word.style.filter = lyricsBlur
                //word.style.textShadow = "none"
                word.classList.remove("Active")
                word.classList.remove("Sung")
                word.classList.add("NotSung")
              //}
            })
          } else if (edtrackpos >= line.getAttribute("end")) {
            // us bolo

           // if (!line.classList.contains("crepl")) {
              //line.style.opacity = globalOpacityLyr
              //line.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"
              //line.style.filter = lyricsBlur
              //line.style.textShadow = "none"
              line.classList.remove("Active")
              line.classList.add("Sung")
              line.classList.remove("NotSung")
           // }
            /* if (line.classList.contains("musical-line")) {
              //line.style.display = "block"
              line.style.textShadow = "none"
            } */
            line.querySelectorAll(".word").forEach(word => {
              //if (!word.classList.contains("crepl")) {
                //word.style.opacity = globalOpacityLyr
                //word.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)"

               // word.style.setProperty("--gradient-position", "-20%")
                /* word.style.setProperty("--gradient-alpha", "1)
                word.style.setProperty("--gradient-alpha-end", "1")
                word.style.setProperty("--gradient-degrees", "90deg") */

                //word.style.filter = lyricsBlur
                //word.style.textShadow = "none"
                word.classList.remove("Active")
                word.classList.add("Sung")
                word.classList.remove("NotSung")
             // }
            })

          }
        })
      //}
      } else if (storage.get("currentLyricsType") != null && storage.get("currentLyricsType") === "Line") {
        //if (lastEdTrackPos === edtrackpos) return
    //lastEdTrackPos = edtrackpos
   // if (document.querySelector('#LyricsPageContainer').classList.contains('active')) {
      document.querySelectorAll("#LyricsPageContainer .lyricsParent .lyrics .line").forEach((line, index, arr) => {
/*             if (edtrackpos >= line.getAttribute("end") && arr[index + 1].getAttribute("start") >= edtrackpos) {
          line.classList.add('lnc')
          line.style.color = "white"
        } else if (edtrackpos <= line.getAttribute("end") || arr[index + 1].getAttribute("start") <= edtrackpos) {
          line.classList.remove('lnc')
        } */
        if (line.getAttribute("start") <= edtrackpos && edtrackpos <= line.getAttribute("end")) {
         // line.style.opacity = "1"
          //line.style.color = "#FFFFFF"
          //line.style.filter = "blur(0px)"
          //line.style.textShadow = textGlowDef

        
              // Calculate base blur amount (can be 0 if you don't want any blur by default)
              /* let blurAmountMultiplier = 1;

              if (lowQModeEnabled || !Spicetify.Player.isPlaying()) {
                // Increase blur amount when both scrolling and hovering
                blurAmountMultiplier = 0; // Adjust this value as needed
              } 
                for (let i = index + 1; i < arr.length; i++) {
                    const blurAmount = 1.25 * (i - index) * blurAmountMultiplier;
                    arr[i].style.setProperty("--blur-px", `${blurAmount}px`)
                }
        
                // Apply blur to lines BEFORE the active line (in viewport)
                for (let i = index - 1; i >= 0; i--) {
                    const blurAmount = 1.25 * (index - i) * blurAmountMultiplier;
                    arr[i].style.setProperty("--blur-px", `${blurAmount}px`)
                } */

          /* const totalDuration = line.getAttribute("total");
          const elapsedDuration = edtrackpos - line.getAttribute("start");
          const percentage = (elapsedDuration / totalDuration) * 100;

          //if (lastGradientPercentage !== percentage) {
            lastGradientPercentage = percentage

            //const lngValue = ifPlayerUsingWPSDK ? `linear-gradient(180deg, rgba(255,255,255,1) ${percentage}%, rgba(255,255,255,0.4) ${percentage + 20}%)` : `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)`

            //line.style.backgroundImage = lngValue
            if (ifPlayerUsingWPSDK) {
              line.style.setProperty("--gradient-position", `${percentage}%`)
              line.style.setProperty("--gradient-alpha", "1")
              line.style.setProperty("--gradient-alpha-end", "0.4")
              line.style.setProperty("--gradient-degrees", "180deg")
            } else {
              line.style.setProperty("--gradient-position", "100%")
              line.style.setProperty("--gradient-alpha", "1")
              line.style.setProperty("--gradient-alpha-end", "1")
              line.style.setProperty("--gradient-degrees", "90deg")
            } */
          //}

          

          //if (lowQModeEnabled) {
            //line.style.setProperty("--gradient-position", "100%")
          /* } else {

            const totalDuration = line.getAttribute("total");
            const elapsedDuration = edtrackpos - line.getAttribute("start");
            const percentage = (elapsedDuration / totalDuration) * 100;

            line.style.setProperty("--gradient-position", `${percentage}%`)
          } */
          /* line.style.setProperty("--gradient-alpha", "1")
          line.style.setProperty("--gradient-alpha-end", "0.4") */
          //line.style.setProperty("--gradient-degrees", "180deg")

          line.classList.add("Active")
          line.classList.remove("Sung")
          line.classList.remove("NotSung")
        } else if (line.getAttribute("start") >= edtrackpos) {
          //este bude
        //  if (!line.classList.contains("crepl")) {
            //line.style.opacity = globalOpacityLyr

            //line.style.setProperty("--gradient-position", "-20%")

            //line.style.filter = lyricsBlur
            //line.style.textShadow = "none"
            line.classList.remove("Active")
            line.classList.remove("Sung")
            line.classList.add("NotSung")
         // }
        } else if (edtrackpos >= line.getAttribute("end")) {
          //us bolo
          //if (!line.classList.contains("crepl")) {
           // line.style.backgroundImage = "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%)"
            //line.style.setProperty("--gradient-position", "-20%")
            /* line.style.setProperty("--gradient-alpha", "1")
            line.style.setProperty("--gradient-alpha-end", "1") */
            /* line.style.setProperty("--gradient-degrees", "90deg") */
            //line.style.opacity = globalOpacityLyr
            //line.style.filter = lyricsBlur
            //line.style.textShadow = "none"
            line.classList.remove("Active")
            line.classList.add("Sung")
            line.classList.remove("NotSung")
        //  }
        }
      })
    }
    //console.log("Ran")
    /* setTimeout(()=>startLyricsInInt(), 10) */
      //}
    //}, 25);
}


export function isElementInViewport(el, scr) {
    const rect = el.getBoundingClientRect();
    const scrollable = scr
    const scrollableRect = scrollable.getBoundingClientRect();
  
    return (
      rect.top >= scrollableRect.top &&
      rect.left >= scrollableRect.left &&
      rect.bottom <= scrollableRect.bottom &&
      rect.right <= scrollableRect.right
    );
}




export function runLiiInt() {
  if (storage.get("intRunning") === "true") return
    
  storage.set("intRunning", "true")

  runLyricsInInt();
}

export function scrollToActiveLine(skipIsPlaying = false) {
  //const edtrackpos = Spicetify.Player.getProgress();
  /* if (!document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) return
  if (Spicetify.Platform.History.location.pathname === "/spicy-lyrics") {
      document.querySelectorAll("#LyricsPageContainer .lyricsParent .lyrics .line").forEach(line => {
        if (line.classList.contains("Active")) {
          const container = document.querySelector("#LyricsPageContainer .lyricsParent .lyrics");

          scrollElementIntoView(container, line);
        }
      })
    } */
    const def = skipIsPlaying ? false : !Spicetify.Player.isPlaying()
    if (def) return;
    //const edtrackpos = Spicetify.Player.getProgress();
    if (!document.querySelector("#LyricsPageContainer .lyricsParent .lyrics")) return;
    if (Spicetify.Platform.History.location.pathname === "/spicy-lyrics") {
      // Select all lines
      const lines = document.querySelectorAll("#LyricsPageContainer .lyricsParent .lyrics .line"); 
  
      // Find the first matching line
      let currentLine = null;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (lastLine && lastLine === line) break;
        if (line.classList.contains("Active")) {
          currentLine = line;
          break; // Exit the loop once a line is found
        }
      }
  
      if (currentLine) { 
        const container = document.querySelector("#LyricsPageContainer .lyricsParent .lyrics");
        scrollElementIntoView(container, currentLine); 
      }
    }
}

// Track the last active line and whether the user scrolled away
let lastLine = null;
let userScrolled = false;
let scrollTimeout = null;

export function scrollElementIntoView(container, element) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const offsetTop = elementRect.top - containerRect.top + container.scrollTop;

  gsap.to(container, {
    duration: 0.5, // 0.5-second scroll duration
    scrollTo: {
      y: offsetTop - container.clientHeight / 2 + element.clientHeight / 2 + 130, 
      autoKill: true 
    },
    ease: "back.out(1.5)" // Good: back.out(1.4)
  });
}

/* let intForScrollFirst = null;

// Main function to scroll to the active line
export function scrollToActiveLine(firstScroll = false) {
    const lyricsContainer = document.querySelector("#LyricsPageContainer .lyricsParent .lyrics");
    if (!lyricsContainer) return;

    if (Spicetify.Platform.History.location.pathname !== "/spicy-lyrics") return;

    let lines = document.querySelectorAll("#LyricsPageContainer .lyricsParent .lyrics .line");

    // Find the current active line
    let currentLine = Array.from(lines).find(line => line.classList.contains("Active"));

    // Scroll to the active line if it’s different from the last and if user hasn’t scrolled
      console.log("First Scroll", firstScroll)
    if (firstScroll) {
      //if (!currentLine) {
        intForScrollFirst = setInterval(() => {
          console.log("yes")
          const lines = document.querySelectorAll("#LyricsPageContainer .lyricsParent .lyrics .line");
          const currentLine = Array.from(lines).find(line => line.classList.contains("Active"));
          if (currentLine) {
            console.log("ultra yes")
              scrollElementIntoView(lyricsContainer, currentLine); // Scroll to active line
              console.log("Should've scrolled 1")
              clearInterval(intForScrollFirst)
              intForScrollFirst = null;
          }
        }, 100)

    }
    if (currentLine && currentLine !== lastLine && !userScrolled) {
        if (!isElementInViewport(currentLine, lyricsContainer)) return
        scrollElementIntoView(lyricsContainer, currentLine); // Scroll to active line
        lastLine = currentLine;  // Update the last line
    }

    // Set up scroll event listener to detect user scrolling away, if not already set
    if (!lyricsContainer.hasScrollListener) {
        lyricsContainer.addEventListener('scroll', handleUserScroll);
        lyricsContainer.hasScrollListener = true; // Track listener addition
    }
} */

/* // Handle user scrolling
function handleUserScroll() {
    userScrolled = true; // Mark that the user has scrolled away

    const lyricsContainer = document.querySelector("#LyricsPageContainer .lyricsParent .lyrics");

    // Clear any existing timeout if the user is actively scrolling
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    // Start a new timeout to scroll back to the active line if the user stops scrolling for 3 seconds
    scrollTimeout = setTimeout(() => {
        const activeLine = document.querySelector("#LyricsPageContainer .lyricsParent .lyrics .line.Active");
        if (activeLine) {
            if (!isElementInViewport(activeLine, lyricsContainer)) return
            scrollElementIntoView(lyricsContainer, activeLine); // Scroll back to the active line
            userScrolled = false; // Reset user scroll flag after auto-scroll
        }
    }, 3000);
} */

/* // Function to smoothly scroll the element into view
export function scrollElementIntoView(container, element) {
    const containerTop = container.getBoundingClientRect().top;
    const elementTop = element.getBoundingClientRect().top;
    const offset = elementTop - containerTop - container.clientHeight / 2 + element.clientHeight / 2;
    container.scrollBy({ top: offset, behavior: "smooth" });
} */

let animFrameId = null;

function runLyricsInInt() {
    const currentTime = Spicetify.Player.getProgress();
    startLyricsInInt(currentTime);
    animFrameId = requestAnimationFrame(runLyricsInInt);
}

export function stopLyricsInInt() {
  cancelAnimationFrame(animFrameId);
}