var bandSearch = document.getElementById("bandSearch")
var bandInput = document.getElementById("bandinput")
var left = document.getElementById("left");
var right = document.getElementById("right");

bandSearch.addEventListener('submit',searchArtist)
bandSearch.addEventListener('submit',clearArtist)

function clearArtist() {
    if(left.innerHTML !== '' && right.innerHTML !== ''){
    left.innerHTML= '';
    right.innerHTML= '';
    }else{
    searchArtist
    }
}

function searchArtist(event) {
    event.preventDefault();

    var artist = bandInput.value
    if (artist) {
    findArtist(artist)
    }
}
var findArtist = function(artist) {
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






        function createP(title, name, size) {
            let p = document.createElement('p');
            let nullP = document.createElement('span');
            p.textContent = title + name;
            p.classList.add(size);
            if (name) return p;
            else return nullP;
        }

        function createA(title, name, size) {
            let p = document.createElement('p');
            let a = document.createElement('a');
            let nullA = document.createElement('span');

            p.textContent = title;
            a.href = "http://" + name;
            a.rel = "noreferrer noopener";
            a.target = "_blank";
            a.textContent = "http://" + name;
            p.appendChild(a);

            p.classList.add(size);
            if (name) return p;
            else return nullA;
        }


        function createImg(name) {
            let img = document.createElement('img');
            let nullImg = document.createElement('span');
            
            img.src = name;
         
            // img.classList.add("column");

            if (name) return img;
            else return nullImg;  //if no image to display
        }

      });
    }