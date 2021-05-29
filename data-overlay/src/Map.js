import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import data from './data.json';
import SearchLocation from './search/SearchLocation';
import sites from "./search/sites.json";

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const Map = () => {
 
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);


  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [5, 34],
      zoom: 1.5
    });

    map.on('load', () => {
      map.addSource('countries', {
        type: 'geojson',
        data
      });

      map.setLayoutProperty('country-label', 'text-field', [
        'format',
        ['get', 'name_en'],
        { 'font-scale': 1.2 },
        '\n',
        {},
        ['get', 'name'],
        {
          'font-scale': 0.8,
          'text-font': [
            'literal',
            ['DIN Offc Pro Italic', 'Arial Unicode MS Regular']
          ]
        }
      ]);

      map.addLayer(
        {
          id: 'countries',
           type: 'symbol',
          source: 'countries'
        },
        'country-label'
      );

   
      map.addLayer({
        "id": "locations",
        "type": "circle",
        /* Add a GeoJSON source containing place coordinates and information. */
        "source": {
          "type": "geojson",
          "data": sites
        }
      });
      map.addLayer({
        'id': 'poi-labels',
        'type': 'symbol',
        'source': 'locations',
        'layout': {
        'text-field': ['get', 'address'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 0.5,
        'text-justify': 'auto',
        'icon-image': ['get', 'icon']
        }
        });

      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);


  const onClickFindPlace = useCallback( (lng, lat) => {
    map.setCenter([lng, lat]);
    
  }, [map]);




  return (
    <div>
      <div ref={mapContainerRef} className='map-container' />

      <SearchLocation
          onClickResult={onClickFindPlace}
        />
    </div>
  );
};

export default Map;
