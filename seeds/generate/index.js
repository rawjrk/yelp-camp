const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const turf = {
  center: require('@turf/center').default,
  points: require('@turf/helpers').points,
}
const { writeJsonFile } = require('./jsonReader');

const initialFile = path.join(__dirname, 'OurBumble-DB.csv');
const newFile = path.join(__dirname, '../campsites.json');
const results = [];
const points = [];

fs.createReadStream(initialFile)
    .pipe(csv({
      mapHeaders: ({ header }) => header.toLowerCase().replace(' ', '_'),
      mapValues: ({ header, value }) => {
        if (value === '') return null;
        if (header === 'altitude') return parseInt(value);
        if (['latitude', 'longitude'].includes(header)) return parseFloat(value);
        if (header === 'services') return value.split('\v');

        return value;
      },
    }))
    .on('data', data => {
      const validEntry = [
        data.site_name,
        data.country,
        data.town,
        data.latitude,
        data.longitude,
        data.cost,
        data.comments,
      ].every(elem => elem !== null);

      if (validEntry) {
        results.push(data);
        points.push([ data.longitude, data.latitude ]);
      }
    })
    .on('end', () => {
      writeJsonFile(results, newFile);
      console.log(`Processed ${results.length} rows to campsites.json`);
      const features = turf.points(points);
      const center = turf.center(features);
      console.log('New cluster map center [long,lat]:', center.geometry.coordinates);
    });
