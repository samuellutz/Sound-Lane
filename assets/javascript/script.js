var artist = "Jenny Hval";

var requestUrl = "https://theaudiodb.com/api/v1/json/2/search.php?s=" + artist;

var body = document.getElementById("main");
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
     
        body.appendChild(createImg(logo));
        body.appendChild(createP(id));
        body.appendChild(createP(name));
        body.appendChild(createP(started));
        body.appendChild(createP(place));
        body.appendChild(createP(genre));
        body.appendChild(createP(site));



        body.appendChild(createP(bio));

        body.appendChild(createImg(image[0]));
        body.appendChild(createImg(image[1]));
        body.appendChild(createImg(image[2]));
        body.appendChild(createImg(image[3]));






        function createP(name) {
            let p = document.createElement('p');
            p.textContent = name;
            return p;
        }
        function createImg(name) {
            let img = document.createElement('img');
            img.src = name;
            return img;
        }

      });