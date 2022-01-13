var bandSearch = document.getElementById("bandSearch");
var bandInput = document.getElementById("bandinput");
var left = document.getElementById("left");
var right = document.getElementById("right");
var albums = document.getElementById("albums");
var concerts = document.getElementById("concerts");
var bandbtn = document.getElementById("bandbtn")



bandSearch.addEventListener('submit',searchArtist);
bandSearch.addEventListener('submit',clearArtist);

function clearArtist() {
    if(left.innerHTML !== '' && right.innerHTML !== ''){
        left.innerHTML= '';
        right.innerHTML= '';
    } else {
        searchArtist;
    }
}

function searchArtist(event) {
    event.preventDefault();

    var artist = bandInput.value;
    if (artist) {
        findArtist(artist);
    }
}
function findArtist(artist) {
    var requestUrl = "https://theaudiodb.com/api/v1/json/2/search.php?s=" + artist;


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

            var getAlbumAPI = "https://theaudiodb.com/api/v1/json/2/album.php?i=" + id;


            
            var name = data.artists[0].strArtist;
            var started = data.artists[0].intBornYear;
            var bio = data.artists[0].strBiographyEN;
            var genre = data.artists[0].strGenre;
            var site = data.artists[0].strWebsite;
            var place = data.artists[0].strCountry;
            var image = [data.artists[0].strArtistFanart, 
                data.artists[0].strArtistFanart2, 
                data.artists[0].strArtistFanart3,
                data.artists[0].strArtistFanart4,
                data.artists[0].strArtistThumb,
                data.artists[0].strArtistWideThumb,
                data.artists[0].strArtistClearart,
            ];
            var logo = data.artists[0].strArtistBanner;


            console.log(data.artists[0]);
        
            
            // left.appendChild(createP(id));
            left.appendChild(createP("", name, "large"));

            left.appendChild(createP("Founded: ", started));
            left.appendChild(createP("Origin: ", place));
            left.appendChild(createP("Genre: ", genre));
            left.appendChild(createA("Website: ", site));



            right.appendChild(createP("", bio));
            left.appendChild(createImg(logo));
            left.appendChild(createImg(image[0]));
            left.appendChild(createImg(image[1]));
            left.appendChild(createImg(image[2]));
            left.appendChild(createImg(image[3]));
            left.appendChild(createImg(image[4]));
            left.appendChild(createImg(image[5]));



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

            var albumNames = [];
            var albumCovers = [];
            for (i in data.album) {
                albumNames.push(data.album[i].strAlbum);
                albumCovers.push(data.album[i].strAlbumThumb);
                
                // albums.appendChild(createImg(albumCovers[i]));
                // albums.appendChild(createP("", albumNames[i]));
                albumCarousel.addItem(createImg(albumCovers[i]));

            }
            console.log(albumNames);
            console.log(albumCovers);


            console.log(data);
          
            
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


function createImg(name) {
    let img = document.createElement('img');
    let nullImg = document.createElement('span');
    
    img.src = name;

    // img.classList.add("column");

    if (name) return img;
    else return nullImg;  //if no image to display
}



var albumCarousel = new Glider(document.querySelector('.glider'), {

    // `auto` allows automatic responsive
    // width calculations
    slidesToShow: 'auto',
    slidesToScroll: 'auto',
  
    // should have been named `itemMinWidth`
    // slides grow to fit the container viewport
    // ignored unless `slidesToShow` is set to `auto`
    itemWidth: undefined,
  
    // if true, slides wont be resized to fit viewport
    // requires `itemWidth` to be set
    // * this may cause fractional slides
    exactWidth: false,
  
    // speed aggravator - higher is slower
    duration: .5,
  
    // dot container element or selector
    dots: 'CSS Selector',
  
    // arrow container elements or selector
    arrows: {
      prev: 'CSS Selector',
      // may also pass element directly
      next: document.querySelector('CSS Selector')
    },
  
    // allow mouse dragging
    draggable: false,
    // how much to scroll with each mouse delta
    dragVelocity: 3.3,
  
    // use any custom easing function
    // compatible with most easing plugins
    easing: function (x, t, b, c, d) {
      return c*(t/=d)*t + b;
    },
  
    // event control
    scrollPropagate: false,
    eventPropagate: true,
  
    // Force centering slide after scroll event
    scrollLock: false,
    // how long to wait after scroll event before locking
    // if too low, it might interrupt normal scrolling
    scrollLockDelay: 150,
  
    // Force centering slide after resize event
    resizeLock: true,
  
    // Glider.js breakpoints are mobile-first
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


//local storage to add buttons from previous search 
  function addArtist(artist){
    container.push(artist);
      var button = $("<button>");
      button.text(artist);
      button.addClass("btn btn-secondary bandSearch w-100 border-top border-dark");
      button.attr("type", "button");
      bandbtn.append(button);
      for(var i = 0; i < container.length; i++){
      localStorage.setItem(i, container[i]);
    }
    localStorage.setItem("artist", JSON.stringify(value));
  }
// function to creat buttons
  bandbtn.click("click", "button", function (event) {
    save = true;
    event.preventDefault();
    var btnText = $(this).text();
    console.log("btn text: " + btnText);
    searchArtist(btnText);
  });

  function pageOpen() {
    var num = localStorage.getItem("artist");
    for (var i = 0; i < num; i++) {
        JSON.parse(localStorage.getItem("artist"));
    }
    if (container.length > 0) {
      searchArtist(container[0]);
    }
    for (var i = 0; i < container.length; i++) {
      var ogButton = $("<button>");
      ogButton.text(container[i]);
      ogButton.addClass("btn btn-secondary bandSearch w-100 border-top border-dark");
      ogButton.attr("type", "button");
      bandbtn.append(ogButton);
    }
    pageOpen();
  }
 