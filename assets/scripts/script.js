const months = ["",
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
]

function checkParametersInput() {
  if (!power.value)
    return false;

  if (!markers.length)
    return false;

  return true;
}

function checkEmailInput() {
  if (!input_email.value) {
    email_help.style.display = "none";
    email_error.style.display = "block";
  }

  if (!checkbox_email.checked) {
    checkbox_error.style.display = "block";
  }

  return (input_email.value && checkbox_email.checked)
}

function displayPlot(y, x) {
  const plot_data = [{
    y: y,
    x: x,
    fill: 'tozeroy',
    type: "scatter"
  }];

  const layout = {
    title: "Produkcja PV",
    margin: {
      l: 40,
      r: 20,
      b: 80,
      t: 120,
    },
  };
  
  const config = {
    responsive: true
  }

  Plotly.newPlot("plot", plot_data, layout, config);
}

function displayTable(table_data) {
  const summedProductionByMonth = [];
  const summedProfitByMonth = [];

  for (let year = 2018; year <= 2050; year++) {
    summedProductionByMonth[year] = new Array(13).fill(0);
    summedProfitByMonth[year] = new Array(13).fill(0);
  }

  for (let i = 0; i < table_data.production.length; i++) {
    const production = table_data.production[i];
    const profit = table_data.profit[i];
    const dateString = table_data.time[i];
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    summedProductionByMonth[year][month] += production;
    summedProfitByMonth[year][month] += profit;
  }

  for (let year = 2022; year <= 2022; year++) {
    for (let month = 1; month <= 12; month++) {
      let row = document.createElement("tr")
      let c1 = document.createElement("th")
      let c2 = document.createElement("td")
      let c3 = document.createElement("td")
      
      c1.innerText = months[month]
      c2.innerText = summedProductionByMonth[year][month].toFixed(2);
      c3.innerText = summedProfitByMonth[year][month].toFixed(2);
      
      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);
      
      prediction_table.appendChild(row)
    }
  }
}

function addNewMarker(geolocation) {
  while(markers.length) {
    const old_marker = markers.pop();

    map.removeLayer(old_marker)
  }

  console.log(geolocation)

  const marker = new L.marker(geolocation).addTo(map);
  map.addLayer(marker);
  markers.push(marker);

  document.getElementById("map-lat").innerText = 'Szerokość: ' + geolocation.lat
  document.getElementById("map-lng").innerText = 'Wysokość: ' + geolocation.lng
}

var power = document.getElementById("input-power");
var angle = document.getElementById("input-angle");
var azimuth = document.getElementById("input-azimuth");
var button_calculate = document.getElementById("button-calculate");
var prediction_card = document.getElementById("prediction-card");
var prediction_table = document.getElementById("prediction-table");

power.oninput = function() {
  power.value = this.value;
}

angle.oninput = function() {
  angle.value = this.value;
  document.getElementById("label-angle").innerText = 'Kąt nachylenia: ' + this.value + '°'
}

azimuth.oninput = function() {
  azimuth.value = this.value;
  document.getElementById("label-azimuth").innerText = 'Azymut: ' + this.value + '°'
}

// map

const markers = []
var map = L.map('map').setView([52, 19], 6);

L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
}).on('markgeocode', function(e) {
  addNewMarker(e.geocode.center);
  }).addTo(map);

map.on('click', function(e) {
  addNewMarker(e.latlng)
});

// show prediction card

button_calculate.onclick = function() {
  if (checkParametersInput()) {
    prediction_card.style.display = "block";

    const url = 'http://127.0.0.1:80/api/estimate';
    const request_data = {
        start: '2022-01-01',
        end: '2022-12-31',
        lat: markers[0].lat,
        lon: markers[0].lng,
        azimuth: parseInt(azimuth.value),
        angle: parseInt(angle.value),
        peak_power: parseInt(power.value),
    };
    
    const headers = new Headers();
    headers.append('Authorization', 'Bearer API_key_here');
    headers.append('Content-Type', 'application/json');
    
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(request_data),
    })
    .then(response => response.json())
    .then(response_data => {
        console.log(response_data);
    
        displayPlot(y=response_data.production, x=response_data.time)
        displayTable(table_data=response_data)
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  else {
    console.log('zle podane dane')
  }
}

// submit email

var button_email = document.getElementById("button-email");
var input_email = document.getElementById("input-email");
var email_help = document.getElementById("email-help");
var email_error = document.getElementById("email-error");
var checkbox_email = document.getElementById("checkbox-email");
var checkbox_error = document.getElementById("checkbox-error");
var email_modal = new bootstrap.Modal(document.getElementById('email-modal'));

checkbox_email.onclick = function() {
  checkbox_error.style.display = "none";
}

input_email.oninput = function() {
  email_error.style.display = "none";
  email_help.style.display = "block";
}

button_email.onclick = function() {
   if (checkEmailInput()){
    email_modal.show();

    const url = 'http://127.0.0.1:80/api/save_email';
    const request_data = {
        email: input_email.value
    };
    
    const headers = new Headers();
    headers.append('Authorization', 'Bearer API_key_here');
    headers.append('Content-Type', 'application/json');
    
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(request_data),
    })
    .then(response => response.json())
    .then(response_data => {
        console.log(response_data);

        if (response_data.status == '200')
          exampleModalCenter.ariaHidden = false

        else
          console.log('nie jest git')
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }
}
