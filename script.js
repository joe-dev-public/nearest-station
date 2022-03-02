'use strict';

// Some fixed test values:
//const postcode = 'N4 2DF';
//const lat = 51.56515;
//const lon = -0.10520;

const myFormElement = document.querySelector('form');

const myResultsElement = document.querySelector('#results');

function handleForm() {

  const myFormData = new FormData(myFormElement);

  const myData = Object.fromEntries(myFormData);

  const postcode = myData["postcode"];

  let lat, lon;

  /*
  fetch(`https://api.tfl.gov.uk/StopPoint/Meta/StopTypes`)
    .then((response) => { 
      return response.json();
    })
    .then((response) => {
      console.log(response);
    });
  */

  /*
    StopTypes of interest?
    NaptanMetroStation
    NaptanRailStation
  */

  const radius = 1000; // metres, 200 is default
  const stopTypes = 'NaptanMetroStation,NaptanRailStation';

  fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      lat = response["result"]["latitude"];
      lon = response["result"]["longitude"];
    })
    .then(() => {
      // Probably shouldn't nest like this, find a better structure.
      fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=${radius}`)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          console.log(response);
          const stopPointsArray = response["stopPoints"];
          let html = `Rail station(s) within ${radius} metres:<ul>`;
          for (const element of stopPointsArray) {
            const commonName = element["commonName"];
            const distance = Math.round(element["distance"]);
            html += `<li>${commonName} (~${distance}m away)</li>`;
          }
          html += '</ul>';
          myResultsElement.innerHTML = html;
        });
    });

}

myFormElement.addEventListener("submit", (event) => {
  handleForm();
  event.preventDefault();
});