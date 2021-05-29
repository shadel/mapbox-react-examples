

import sites from "./sites.json";

function isAccessable(featureAccess, access) {
  if (access === "all") {
    return true;
  }
  if (access === "public") {
    if (!featureAccess) {
      return true;
    }
  }
  return featureAccess === access;
}

function featureSearch(feature, text, access) {
  const {access: featureAccess, ...properties} = feature.properties;
  return isAccessable(featureAccess, access) && Object.values(properties).some(value => value.includes(text))
}
function geojsonSearch(geojson, text, access){
  return geojson.features.filter(feature => featureSearch(feature, text, access))
}

export class SiteService {

  textSearch(text, state) {
    return new Promise(resolve => {
      const result = geojsonSearch(sites, text, state)
      resolve(result);
    });
  }
}
