var bandSearch = document.getElementById("bandSearch");
var topArtistEl = document.getElementById("top-artist");
var bandInput = document.getElementById("bandinput");
var left = document.getElementById("left");
var right = document.getElementById("right");
var concerts = document.getElementById("concerts");
var albumsEl = document.getElementById('albums');
var photosEl = document.getElementById('photos');
var metricEL = document.getElementById('artistmetrics');
var previousSearchesEl = document.getElementById('previous-searches');
var albumCarousel;
var photosCarousel;
var previousSearches = [];
var previousSearchImg = [];



bandSearch.addEventListener('submit',searchArtist);
bandSearch.addEventListener('submit',clearArtist);

previousSearchesEl.addEventListener('click', function(e) {  

    if (e.target.classList.contains("searchable")) {
        clearArtist();
        findArtist(e.target.querySelector('span').textContent);
    }   
});

if (localStorage.getItem('previousSearches')) {
    previousSearches = JSON.parse(localStorage.getItem('previousSearches'));
    previousSearchImg = JSON.parse(localStorage.getItem('previousSearchImg'));
    previousSearchesEl.appendChild(createP('','Recent Searches', 'medium'));
    for (i in previousSearches) {
        var searchItem = createImg(previousSearches[i], previousSearchImg[i]);
        searchItem.classList.add("searchable");
        previousSearchesEl.appendChild(searchItem);
        
    }
    
}


topArtist()

function clearArtist() {
    if(left.innerHTML !== '' && right.innerHTML !== ''){
        left.innerHTML= '';
        right.innerHTML= '';
        topArtistEl.innerHTML= '';
        photosEl.innerHTML= '';
        previousSearchesEl.innerHTML= '';
        metricEL.innerHTML= '';   
        albumsEl.innerHTML='';     
    } else {
        searchArtist;
    }
}
// The searchArtist function is the meat of the script, it performs both the work of fetching and parsing api data but also creating the html elements they'll populate.
function searchArtist(event) {
    event.preventDefault();

    var artist = bandInput.value; //This is the search form input that will be used to find the artist's data set
    if (artist) {
        findArtist(artist);
        searchMetrics(artist);
    }
}
function findArtist(artist) {
    var requestUrl = "https://theaudiodb.com/api/v1/json/2/search.php?s=" + artist; //First api call that uses search form input to find data


    fetch(requestUrl)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                return false;
            }
        })
        .then(function (data) {
            var id = data.artists[0].idArtist;

            var getAlbumAPI = "https://theaudiodb.com/api/v1/json/2/album.php?i=" + id; //While the first api call finds AudioDB's unique ID associated with the artist
            //this api call uses that ID to find album information not available in the first api call.


            //These variables are assigned the key values in the api's so that they can populate the elements that will be created.
            var name = data.artists[0].strArtist;
            var image = [data.artists[0].strArtistFanart, 
                data.artists[0].strArtistFanart2, 
                data.artists[0].strArtistFanart3,
                data.artists[0].strArtistFanart4,
                data.artists[0].strArtistThumb,
                data.artists[0].strArtistWideThumb,
                data.artists[0].strArtistClearart,
            ];
            if (name) {  //adds previous searches to array and saves to local storage
                var indexOfCurrentSearch = previousSearches.indexOf(name);
                if (indexOfCurrentSearch > -1) {  //removes other instances of current search
                    previousSearches.splice(indexOfCurrentSearch, 1);
                    previousSearchImg.splice(indexOfCurrentSearch, 1);
                }                
                if (previousSearches.length >= 5) {
                    previousSearches.pop(); 
                    previousSearchImg.pop();
                } 
                previousSearches.unshift(name);
                previousSearchImg.unshift(image[0]);
                localStorage.setItem("previousSearches", JSON.stringify(previousSearches));        
                localStorage.setItem("previousSearchImg", JSON.stringify(previousSearchImg));          
            }
            

            var started = data.artists[0].intBornYear;
            var bio = data.artists[0].strBiographyEN;
            var genre = data.artists[0].strGenre;
            var site = data.artists[0].strWebsite;
            var place = data.artists[0].strCountry;
            
            var logo = data.artists[0].strArtistBanner;


            console.log(data.artists[0]);

            

            // left.appendChild(createP(id));
            left.appendChild(createP("", name, "large"));
            left.appendChild(createImg("", image[0]));
            left.appendChild(createP("Founded: ", started));
            left.appendChild(createP("Origin: ", place));
            left.appendChild(createP("Genre: ", genre));
            left.appendChild(createA("Website: ", site));
            left.appendChild(createA("youtube: ","www.youtube.com/results?search_query=" + artist))
            left.appendChild(createA("Spotify: ", "open.spotify.com/search/"+ artist))
            left.appendChild(createA("Pandora: ", "www.pandora.com/search/"+ artist + "/all"))

            right.appendChild(createP("", bio));
       

            createPhotosCarousel();
            for (i in image) {
                if (image[i])   photosCarousel.addItem(createImg("", image[i]));
            }
            
            


            findAlbums(getAlbumAPI);

            

        });
}

function findAlbums(ApiURL) {
    fetch(ApiURL)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                return false;
            }
        })
        .then(function (data) {
            createAlbumCarousel();
            
            var albumNames = [];
            var albumCovers = [];
            for (i in data.album) {
                albumNames.push(data.album[i].strAlbum);
                albumCovers.push(data.album[i].strAlbumThumb);
                
                
                albumCarousel.addItem(createImg(albumNames[i], albumCovers[i]));

            }
            // console.log(albumNames);
            // console.log(albumCovers);


            // console.log(data);
          
            
        });

}

function searchMetrics(artist) {
    var metricsUrl = "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + artist + "&api_key=95c7da27b614e57e3a2f50c72aacec42&format=json";
    
    fetch(metricsUrl)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                return false;
            }
        })
        .then(function (data) {
            var artMetTitle = "Top Albums by Popularity:"
            var artMet0 = data.topalbums.album[0].name + " with " + data.topalbums.album[0].playcount + " listens";
            var artMet1 = data.topalbums.album[1].name + " with " + data.topalbums.album[1].playcount + " listens";
            var artMet2 = data.topalbums.album[2].name + " with " + data.topalbums.album[2].playcount + " listens";
            var artMet3 = data.topalbums.album[3].name + " with " + data.topalbums.album[3].playcount + " listens";
            var artMet4 = data.topalbums.album[4].name + " with " + data.topalbums.album[4].playcount + " listens";

            metricEL.appendChild(createP("",artMetTitle, "medium" ))
            
            metricEL.appendChild(createP("", artMet0, "small"));
            
            metricEL.appendChild(createP("", artMet1, "small"));
            
            metricEL.appendChild(createP("", artMet2, "small"));
            
            metricEL.appendChild(createP("", artMet3, "small"));
            
            metricEL.appendChild(createP("", artMet4, "small"));
        })
}

function topArtist() {
    var requestTop = "https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=95c7da27b614e57e3a2f50c72aacec42&format=json"
    fetch(requestTop)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                return false;
            }
        })
        .then(function (data) {
            var Artists = "The Current Top 10 Artists (Served via Last.fm) "

            var idArtist0 = data.artists.artist[0].name + " has " + data.artists.artist[0].playcount + " plays and " + data.artists.artist[0].listeners + " listeners!";

            var idArtist1 = data.artists.artist[1].name + " has " + data.artists.artist[1].playcount + " plays and " + data.artists.artist[1].listeners + " listeners!";

            var idArtist2 = data.artists.artist[2].name + " has " + data.artists.artist[2].playcount + " plays and " + data.artists.artist[2].listeners + " listeners!";

            var idArtist3 = data.artists.artist[3].name + " has " + data.artists.artist[3].playcount + " plays and " + data.artists.artist[3].listeners + " listeners!";

            var idArtist4 = data.artists.artist[4].name + " has " + data.artists.artist[4].playcount + " plays and " + data.artists.artist[4].listeners + " listeners!";

            var idArtist5 = data.artists.artist[5].name + " has " + data.artists.artist[5].playcount + " plays and " + data.artists.artist[5].listeners + " listeners!";

            var idArtist6 = data.artists.artist[6].name + " has " + data.artists.artist[6].playcount + " plays and " + data.artists.artist[6].listeners + " listeners!";

            var idArtist7 = data.artists.artist[7].name + " has " + data.artists.artist[7].playcount + " plays and " + data.artists.artist[7].listeners + " listeners!";

            var idArtist8 = data.artists.artist[8].name + " has " + data.artists.artist[8].playcount + " plays and " + data.artists.artist[8].listeners + " listeners!";

            var idArtist9 = data.artists.artist[9].name + " has " + data.artists.artist[9].playcount + " plays and " + data.artists.artist[9].listeners + " listeners!";

            topArtistEl.appendChild(createP("", Artists, "medium"));

            topArtistEl.appendChild(createP("", idArtist0, "small"));

            topArtistEl.appendChild(createP("", idArtist1, "small"));
            
            topArtistEl.appendChild(createP("", idArtist2, "small"));
            
            topArtistEl.appendChild(createP("", idArtist3, "small"));
            
            topArtistEl.appendChild(createP("", idArtist4, "small"));

            topArtistEl.appendChild(createP("", idArtist5, "small"));
            
            topArtistEl.appendChild(createP("", idArtist6, "small"));
            
            topArtistEl.appendChild(createP("", idArtist7, "small"));
            
            topArtistEl.appendChild(createP("", idArtist8, "small"));
            
            topArtistEl.appendChild(createP("", idArtist9, "small"));
        });
}



function createP(title, name, size) {
    let p = document.createElement('p');
    let nullP = document.createElement('span');
    p.textContent = title + name;
    p.classList.add(size);
    if (name) return p;
    else return nullP;  //if element doesnt exist return blank span
}

function createA(title, name, size) {
    let p = document.createElement('p');  //new paragraph
    let a = document.createElement('a');  //new link
    let nullA = document.createElement('span');

    p.textContent = title;
    a.href = "http://" + name;
    a.rel = "noreferrer noopener";
    a.target = "_blank";
    a.textContent = "http://" + name;
    p.appendChild(a);

    p.classList.add(size);
    if (name) return p;
    else return nullA; //if no website
}


function createImg(title, imgSrc) {
    let div = document.createElement('div');
    let img = document.createElement('img');
    let span = document.createElement('span');
    let nullImg = document.createElement('span');
    span.textContent = title;
    
    img.src = imgSrc;
    
    div.appendChild(img);
    div.appendChild(span);

    // img.classList.add("column");
    if (title && imgSrc) return div;
    else if (title && !imgSrc) {
        img.src = "./assets/images/missingart.png";
        return div;
    }
    else if (imgSrc) return img;
    else return false;  //if no image to display
}


function createPhotosCarousel() {
    var label = document.createElement('span');
    var carouselContainer = document.createElement('div');
    var leftButton = document.createElement('button');
    var rightButton = document.createElement('button');
    var dots = document.createElement('div');

    label.textContent = "Photos";
    carouselContainer.classList.add('glider');
    leftButton.classList.add('glider-prev');
    leftButton.ariaLabel = 'Previous';
    leftButton.textContent = '«';
    rightButton.classList.add('glider-next');
    rightButton.ariaLabel = 'Next';
    rightButton.textContent = '»';
    dots.classList.add('dots');
    dots.setAttribute('role', 'tablist');
    photosEl.appendChild(label);
    photosEl.appendChild(carouselContainer);
    photosEl.appendChild(leftButton);
    photosEl.appendChild(rightButton);
    photosEl.appendChild(dots);
  
    photosCarousel = new Glider(document.querySelector('.glider'), {

        slidesToShow: 1,
        // slidesToScroll: 'auto',
        itemWidth: undefined,
        exactWidth: false,
        duration: .5,
        dots: '.dots',
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
        },
        draggable: true,
        dragVelocity: 1,
        easing: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
        },
        scrollPropagate: false,
        eventPropagate: true,
        scrollLock: false,
        scrollLockDelay: 150,
        resizeLock: true,
      
    });


}




function createAlbumCarousel() {
    var label = document.createElement('span');
    var carouselContainer = document.createElement('div');
    var leftButton = document.createElement('button');
    var rightButton = document.createElement('button');
    var dots = document.createElement('div');

    label.textContent = "Discography";
    carouselContainer.classList.add('glider');
    leftButton.classList.add('glider-prev');
    leftButton.ariaLabel = 'Previous';
    leftButton.textContent = '«';
    rightButton.classList.add('glider-next');
    rightButton.ariaLabel = 'Next';
    rightButton.textContent = '»';
    dots.classList.add('dots');
    dots.setAttribute('role', 'tablist');
    albumsEl.appendChild(label);
    albumsEl.appendChild(carouselContainer);
    albumsEl.appendChild(leftButton);
    albumsEl.appendChild(rightButton);
    albumsEl.appendChild(dots);
  
    albumCarousel = new Glider(document.querySelector('.glider'), {

        slidesToShow: 'auto',
        slidesToScroll: 'auto',
        itemWidth: undefined,
        exactWidth: false,
        duration: .5,
        dots: '.dots',
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
        },
        draggable: true,
        dragVelocity: 1, 
        easing: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
        },
        scrollPropagate: false,
        eventPropagate: true,
        scrollLock: false,
        scrollLockDelay: 150,
        resizeLock: true,
        responsive: [
        {
            breakpoint: 900,
            settings: {
            slidesToShow: 4,
            slidesToScroll: 2
            }
        },
        {
            breakpoint: 575,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3
            }
        }
        ]
    });


}
  
