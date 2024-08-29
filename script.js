console.log("Let's write some javaScriptcode");
let songs;
let currFolder;
let albumNumber = 0;
let l=0;

function formatSeconds(seconds) {
    // Calculate minutes and remaining seconds
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to ensure two digits for seconds
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

function getplaylist(index) {
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";

    albumNumber=index;
    l=songs[albumNumber].url.length;
    console.log("lenth "+l);
    console.log("album clicked")
    for (const song of songs.at(index).url) {
        let songname = song.split("/").at(-1)
        songUL.innerHTML = songUL.innerHTML + `<li onclick="nowplayMusic('${song}')"><img src="/svg/music.svg" alt="">
                              <div class="info">
                                  <div>
                                      ${decodeURI(songname)}
                                  </div>
                                  <div>SPB</div>
                              </div>
                              <div class="playnow">
                                  <span>Play Now</span>
                                  <img src="/svg/pause.svg" alt="">
                              </div> </li>`;
    }
    nowplayMusic(songs.at(albumNumber).url.at(0))
    return albumNumber;

}



let currentSong = new Audio()
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${currFolder}`);
    let response = await a.json();
    songs = response;
    return songs;
}


const nowplayMusic = (track, pause = false) => {
    console.log("hi")
    console.log(songs.at(albumNumber).url.indexOf(track))
    let index=songs.at(albumNumber).url.indexOf(track);
    console.log("bye")
    
    currentSong.src = track;
    if (!pause) {
        currentSong.play()
        play.src = "Play_btn/play.svg"
        if (currentSong.currentTime == currentSong.duration) {
            console.log("song completed")
        }
    }
    document.querySelector(".songinfo").innerHTML = track.split("/").at(-1);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";


    next.addEventListener("click", () => {
        console.log("next clicked")
        console.log(albumNumber)
        if ((index + 1) < l) {
            // playMusic(songs[index + 1]);
            nowplayMusic(songs.at(albumNumber).url.at(index+1))
        }
    })



    // event listner for previous

    previous.addEventListener("click", () => {
        console.log("previous clicked")
        console.log("lenth "+l);
        if ((index - 1) >= 0) {
            nowplayMusic(songs.at(albumNumber).url.at(index-1))
        }
    })

}


async function displayAlbums() {
    let cardContainer = document.querySelector(".cardContainer")
    let arr = songs;
    for (let index = 0; index < arr.length; index++) {


        cardContainer.innerHTML = cardContainer.innerHTML + ` <div onclick="getplaylist(${index})"  class="card">
        <img src="${arr[index].coverimage}" alt="">
        <h2>${arr[index].title}</h2>
        <p>${arr[index].description}</p>
        <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64"
                color="rgb(35, 207, 35)" fill="rgb(35, 207, 35)">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                <path
                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                    fill="black" />
            </svg>
        </div>
    </div>`

    }

}


async function main() {
    // get  all the songs
    await getSongs("Songs/songs.json");
    
    getplaylist(albumNumber)
    console.log(albumNumber)
    

    // Display all the albums on the page
    displayAlbums()



    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "Play_btn/play.svg"
        }
        else {
            currentSong.pause()
            play.src = "Play_btn/pause.svg"
        }
    })


    // Listen for timeupdate event

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        let i = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        for (i; i < songs.length - 1; i++) {
            if (currentSong.currentTime == currentSong.duration) {
                playMusic(songs[i + 1])
            }
        }
    })

    // Add event lisner to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listner to hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add event listner for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-200%"
    })

    // Add event listner to previous and next
    let length = songs.length;

}
main()