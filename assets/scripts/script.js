const months = ["",
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

function checkParametersInput() {
  // if (!power.value)
    // nie ma podanej mocy instalacji

  // if (!markers.length)
    // nie ma zadnego markera na mapie

  return (power.value && markers.length);
}

function checkEmailInput() {
  if (!input_email.value) {
    email_help.style.display = "none";
    email_error.style.display = "block";
  }

  if (!checkbox_email.checked) {
    checkbox_error.style.display = "block";
  }

  return (input_email.value && checkbox_email.checked);
}

function displayPlot(plot_data) {
  var production = {
    name: 'Produkcja w Wh',
    x: plot_data.time,
    y: plot_data.production,
    type: 'scattergl',
    fill: 'toself',
    stackgroup: 'one',
  };
  
  var profit = {
    name: 'Zysk w PLN',
    x: plot_data.time,
    y: plot_data.profit,
    type: 'scattergl',
    fill: 'toself',
    stackgroup: 'one',
    yaxis: 'y2'
  };
  
  var data = [production, profit];

  var layout = {
    // title: "Produkcja PV",
    margin: {
      l: 65,
      r: 40,
      b: 10,
      t: 30,
    },
    yaxis: {
      title: 'Produkcja w kWh',
      titlefont: {
        color: '#0022dd',
        size: 18,
        weight: 'bold',
      },
      // tickfont: {color: '#5599ff'},
    },
    yaxis2: {
      title: 'Zysk w PLN',
      titlefont: {
        color: '#0066ff',
        size: 18,
        weight: 'bold',
      },
      // tickfont: {color: '#0033FF'},
      overlaying: 'y',
      side: 'right'
    },
    colorway: ['#0022dd', '#0066ff'],
    "showlegend": true,
    "legend": {
      "x": 0,
      "y": -0.25,
     },
  };
  
  var config = {
    responsive: true,
    displaylogo: false,
  };

  Plotly.newPlot("plot", data, layout, config);
}

function displayTable(table_data) {
  const summedProductionByMonth = [];
  const summedProfitByMonth = [];
  const summedProductionByYear = [];
  const summedProfitByYear = [];

  for (let year = 2018; year <= 2050; year++) {
    summedProductionByMonth[year] = new Array(13).fill(0);
    summedProfitByMonth[year] = new Array(13).fill(0);
    summedProductionByYear[year] = 0;
    summedProfitByYear[year] = 0;
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
    summedProductionByYear[year] += production;
    summedProfitByYear[year] += profit;
  }

  var prediction_table = document.getElementById("prediction-table");

  for (let year = 2022; year <= 2022; year++) {
    for (let month = 1; month <= 12; month++) {
      let row = document.createElement("tr")
      let c1 = document.createElement("th")
      let c2 = document.createElement("td")
      let c3 = document.createElement("td")

      c1.innerText = months[month]
      c2.innerText = (summedProductionByMonth[year][month] / 1000).toFixed(2);
      c3.innerText = summedProfitByMonth[year][month].toFixed(2);
      
      row.appendChild(c1);
      row.appendChild(c2);
      row.appendChild(c3);
      
      prediction_table.appendChild(row)
    }
    let row = document.createElement("tr")
    let c1 = document.createElement("th")
    let c2 = document.createElement("td")
    let c3 = document.createElement("td")

    c1.innerText = ''
    c2.innerText = (summedProductionByYear[year] / 1000).toFixed(2);
    c3.innerText = summedProfitByYear[year].toFixed(2);
    
    row.appendChild(c1);
    row.appendChild(c2);
    row.appendChild(c3);
    
    prediction_table.appendChild(row)
  }
}

function displayTableOnSlider(table_data) {
  const summedProductionByMonth = [];
  const summedProfitByMonth = [];
  const summedProductionByYear = [];
  const summedProfitByYear = [];

  for (let year = 2018; year <= 2050; year++) {
    summedProductionByMonth[year] = new Array(13).fill(0);
    summedProfitByMonth[year] = new Array(13).fill(0);
    summedProductionByYear[year] = 0;
    summedProfitByYear[year] = 0;
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
    summedProductionByYear[year] += production;
    summedProfitByYear[year] += profit;
  }

  for (let year = 2018; year <= 2023; year++) {
    var table_current = document.getElementById(`table-${year}`);

    while (table_current.firstChild) { // clear table
      table_current.removeChild(table_current.firstChild);
    }

    let title = document.createElement("h3");
    title.innerText = year;
    title.style.textAlign = "center";
    title.style.marginBottom = "1em";

    table_current.appendChild(title);

    for (let month = 0; month <= 12; month++) {
      let row = document.createElement("div");
      row.setAttribute("class", "row");

      let cols_values = [months[month], (summedProductionByMonth[year][month] / 1000).toFixed(2), summedProfitByMonth[year][month].toFixed(2)];

      if (month == 0) // table labels
        cols_values = ["", "Produkcja w kWh", "Zysk w PLN"];
      
      for (let i=0; i < cols_values.length; i++) {
        let col = document.createElement("div");
        col.setAttribute("class", "col");
        col.style.display = "flex";

        let col_text = document.createElement("span");
        col_text.innerText = cols_values[i];
        col_text.style.justifyContent = "center";
        col_text.style.margin = "auto";

        if (i == 0 || month == 0)
          col_text.style.fontWeight = "bold";

        col.appendChild(col_text);
        row.appendChild(col);
      }
      
      table_current.appendChild(row);
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
var span_wrong_input = document.getElementById("span-wrong-input");

// power.oninput = function() {
//   power.value = this.value;
// }

angle.oninput = function() {
  angle.value = this.value;
  document.getElementById("label-angle").innerText = `Kąt nachylenia: ${this.value}°`;
}

azimuth.oninput = function() {
  azimuth.value = this.value;
  document.getElementById("label-azimuth").innerText = `Azymut: ${this.value}°`;
}

// map

const markers = [];
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
  addNewMarker(e.latlng);
});

// show prediction card

button_calculate.onclick = function() {
  if (checkParametersInput()) {
    prediction_card.style.display = "block";
    span_wrong_input.style.display = "none";

    const url = 'http://api-rce.azurewebsites.net:80/api/estimate';
    const request_data = {
        start: '2018-01-01',
        end: '2023-07-11',
        lat: markers[0].lat,
        lon: markers[0].lng,
        azimuth: parseInt(azimuth.value),
        angle: parseInt(angle.value),
        peak_power: parseInt(power.value) * 1000,
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
    
        displayPlot(plot_data=response_data);
        displayTableOnSlider(table_data=response_data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  else {
    console.log('zle podane dane');
    span_wrong_input.style.display = "block";
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

    const url = 'http://api-rce.azurewebsites.net:80/api/save_email';
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
          exampleModalCenter.ariaHidden = false;

        else
          console.log('API save_email error');
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }
}
