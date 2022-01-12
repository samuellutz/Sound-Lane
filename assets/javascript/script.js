var artist = "Jenny Hval";

var requestUrl = "https://theaudiodb.com/api/v1/json/2/search.php?s=" + artist;

var left = document.getElementById("left");
var right = document.getElementById("right");
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
        ];
        var logo = data.artists[0].strArtistBanner;


        console.log(data.artists[0]);
     
        left.appendChild(createImg(logo));
        left.appendChild(createP(id));
        left.appendChild(createP(name));
        left.appendChild(createP(started));
        left.appendChild(createP(place));
        left.appendChild(createP(genre));
        left.appendChild(createP(site));



        right.appendChild(createP(bio));

        left.appendChild(createImg(image[0]));
        left.appendChild(createImg(image[1]));
        left.appendChild(createImg(image[2]));
        left.appendChild(createImg(image[3]));






        function createP(name) {
            let p = document.createElement('p');
            p.textContent = name;
            return p;
        }
        function createImg(name) {
            let img = document.createElement('img');
            img.src = name;
            // img.classList.add("one-half");
            img.classList.add("column");
            return img;
        }

      });