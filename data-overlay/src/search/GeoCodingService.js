const GOOGLE_API_KEY = "AIzaSyDBCIvuishTvgmkiA4mL7IQ69CB4MU-0eQ";
const GOOGLE_API_PLACE_KEY = "AIzaSyCaGsMciSH2zyGv6PEdze1Zq1MgMrPGNgY";
export class GeoCodingService {

  constructor(options) {

    if (options && options.withApi) {
      this.loadApi();
    }
  }

  loadApi = () => {
    const oldBlock = document.getElementById("google-map-api");
    if (!oldBlock) {
      const s = document.createElement("script");
      s.id = "google-map-api";
      s.type = "text/javascript";
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_PLACE_KEY}&libraries=places`;
      document.getElementsByTagName("head")[0].appendChild(s);

      const div = document.createElement("div");
      div.id = "gmap";
      document.body.appendChild(div);
    }
  };

  reverseGeocode(
    latlng
  ) {
    // const request = {
    //   latlng
    // };
    return new Promise((resolve, reject) => {
      fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
            latlng.lat
          },${latlng.lng}&key=${GOOGLE_API_KEY}`
        )
        .then(response => response.json())
        .then((resp) => {
          resolve(resp.results);
        })
        .catch(error => reject(error));
      // this.geoCoder.reverseGeocode(request, (error, response) => {
      //   if (error) {
      //     reject(error);
      //   }
      //   console.log(response.json.results);
      //   resolve(response.json.results);
      // });
    });
  }

  textSearch(text) {
    const google = window.google;
    
    const placeService = new google.maps.places.PlacesService(
      document.getElementById("gmap")
    );
    return new Promise(resolve => {
      placeService.textSearch({ query: text }, (res) => {
        resolve(res);
      });
    });
  }
}
