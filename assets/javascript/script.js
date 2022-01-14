var bandSearch = document.getElementById("bandSearch");
var bandInput = document.getElementById("bandinput");
var left = document.getElementById("left");
var right = document.getElementById("right");
var concerts = document.getElementById("concerts");
var albumsEl = document.getElementById('albums');
var photosEl = document.getElementById('photos');
var albumCarousel;
var photosCarousel;


bandSearch.addEventListener('submit',searchArtist);
bandSearch.addEventListener('submit',clearArtist);



function clearArtist() {
    if(left.innerHTML !== '' && right.innerHTML !== ''){
        left.innerHTML= '';
        right.innerHTML= '';
        albumsEl.innerHTML= '';
        photosEl.innerHTML= '';
        if (albumCarousel) albumCarousel.destroy();
        if (photosCarousel) photosCarousel.destroy();
        
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
            left.appendChild(createImg("", image[0]));
            left.appendChild(createP("Founded: ", started));
            left.appendChild(createP("Origin: ", place));
            left.appendChild(createP("Genre: ", genre));
            left.appendChild(createA("Website: ", site));



            right.appendChild(createP("", bio));
            // left.appendChild(createImg(logo));
            // left.appendChild(createImg(image[0]));
            // left.appendChild(createImg(image[1]));
            // left.appendChild(createImg(image[2]));
            // left.appendChild(createImg(image[3]));
            // left.appendChild(createImg(image[4]));
            // left.appendChild(createImg(image[5]));

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
  