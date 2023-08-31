const start_date_string = "2020-01-01"
const start_date = new Date(start_date_string)

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
const today_string = `${yyyy}-${mm}-${dd}`;

function addRow() {
  var value1 = document.getElementById("value1").value;
  var value2 = document.getElementById("value2").value;
  var value3 = document.getElementById("value3").value;

  if (value1 == "" || value2 == "" || (value1 == "Pompa ciepła" && value3 == ""))
    return;

  var table = document.getElementById("dataTable");
  var newRow = table.insertRow(table.rows.length);
  
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);
  
  cell1.innerHTML = value1;
  cell2.innerHTML = value2;
  cell3.innerHTML = value3;
}

function deleteRow() {
  
}

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
      
    }, false)
  })
})()

document.getElementById('consumtion-button').onclick = function() {
  addRow()
}

document.getElementById("value1").oninput = function() {
  // angle.value = this.value;
  // document.getElementById("value1").innerText = `Kąt nachylenia paneli: ${this.value}°`;

  console.log(this.value);

  if (this.value == "Pompa ciepła")
    document.getElementById('value3').removeAttribute('disabled');

  else {
    document.getElementById('value3').setAttribute('disabled', '');
    document.getElementById('value3').value = "";

  }

}

document.getElementById

function checkParametersInput() {
  if (!markers.length) {
    document.getElementById('map').style.border = "solid 1px red";
    document.getElementById('map-wrong-input').style.display = "block";
  }

  if (!power.value) {
    document.getElementById('form-input-parameters').classList.add('was-validated');
  }

  return (markers.length && power.value);
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

function displayPlot(plot_data, id, cumulative=0) {
  const cumulativeSumProduction = (sum => value => sum += value/1000)(0);
  const cumulativeSumProfit = (sum => value => sum += value)(0);

  var production = {
    name: (cumulative) ? 'Skumulowana produkcja (MWh)' : 'Produkcja (kWh)',
    x: plot_data.time,
    y: (cumulative) ? plot_data.production.map(cumulativeSumProduction) : plot_data.production,
    type: 'scattergl',
    fill: (cumulative) ? 'tozeroy' : 'toself',
    stackgroup: 'one',
    hovertemplate: (cumulative) ? 'Data: %{x}<br>Skumulowana produkcja: %{y} MWh<extra></extra>' : 'Data: %{x}<br>Produkcja: %{y} kWh<extra></extra>',
  };
  
  var profit = {
    name: (cumulative) ? 'Skumulowany zysk (PLN)' : 'Zysk (PLN)',
    x: plot_data.time,
    y: (cumulative) ? plot_data.profit.map(cumulativeSumProfit) : plot_data.profit,
    type: 'scattergl',
    fill: (cumulative) ? 'tozeroy' : 'toself',
    stackgroup: 'one',
    hovertemplate: (cumulative) ? 'Data: %{x}<br>Skumulowany zysk: %{y} PLN<extra></extra>' : 'Data: %{x}<br>Zysk: %{y} PLN<extra></extra>',
    yaxis: 'y2',
  };
  
  var data = [production, profit];

  var layout = {
    // title: {
    //   text:(cumulative) ? 'Skumulowana produkcja i zysk' : 'Produkcja i zysk',
    //   font: {
    //     size: 24
    //   },
    //   x: 0,
    // },
    margin: {
      l: 60,
      r: 60,
      b: 20,
      t: 20,
    },
    yaxis: {
      title: (cumulative) ? 'Skumulowana produkcja (MWh)' : 'Produkcja (kWh)',
      titlefont: {
        color: '#0A2FFF',
        size: 21,
        weight: 'bold',
      },
    },
    yaxis2: {
      title: (cumulative) ? 'Skumulowany zysk (PLN)' : 'Zysk (PLN)',
      titlefont: {
        color: '#31D843',
        size: 21,
        weight: 'bold',
      },
      overlaying: 'y',
      side: 'right'
    },
    colorway: ['#0A2FFF', '#31D843'],
    "showlegend": true,
    "legend": {
      "x": 0,
      "y": -0.25,
     },
  };
  
  var config = {
    responsive: true,
    displaylogo: false,
    locale: "pl",
  };

  document.getElementById(`${id}-loading`).style.display = "none";
  document.getElementById(id).style.display = "block";

  Plotly.newPlot(id, data, layout, config);

}

function displayTableOnHeatmaps(table_data) {
  const start_year = start_date.getFullYear();

  var xValues = [];

  const currentDate = new Date();
  for (let year = start_year; year <= currentDate.getFullYear(); year++)
    xValues.push(year);

  var yValues = ["Grudzień", "Listopad", "Październik", "Wrzesień", "Sierpień", "Lipiec", "Czerwiec", "Maj", "Kwiecień", "Marzec", "Luty", "Styczeń"];

  var summed_production = [];
  var summed_profit = [];

  for (let year = start_year; year <= 2050; year++) {
    summed_production[year] = new Array(13).fill(0);
    summed_profit[year] = new Array(13).fill(0);
  }

  for (let i = 0; i < table_data.time.length; i++) {
    const dateString = table_data.time[i];
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();

    summed_production[year][month] += table_data.production[i];
    summed_profit[year][month] += table_data.profit[i];
  }

  var zValues_production = [];
  var zValues_profit = [];

  for (let i=0; i < yValues.length; i++) {
    let row_production = [];
    let row_profit = [];

    for (let j=0; j < xValues.length; j++) {
      row_production.push(summed_production[start_year+j][yValues.length-1-i].toFixed(1)); // yValues.length-1-i to reverse heatmap order
      row_profit.push(summed_profit[start_year+j][yValues.length-1-i].toFixed(2));
    }

    zValues_production.push(row_production);
    zValues_profit.push(row_profit);
  }
  
  var colorscaleValue = [
    [0, '#3D9970'],
    [1, '#001f3f']
  ];

  var data_production = [{
    x: xValues,
    y: yValues,
    z: zValues_production,
    type: 'heatmap',
    colorscale: colorscaleValue,
    showscale: false
  }];
    
  // let customWidth = xValues.length*120;

  var layout_production = {
    title: 'Produkcja',
    // width: customWidth,
    margin: {
      l: 80,
      r: 0,
      b: 0,
      t: 80,
    },
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'top'
    },
    yaxis: {
      ticks: '',
      ticksuffix: ' ',
      width: 700,
      height: 700,
      autosize: false
    }
  };

  for ( var i = 0; i < yValues.length; i++ ) {
    for ( var j = 0; j < xValues.length; j++ ) {
      var currentValue = zValues_production[i][j];
      if (currentValue != 0.0) {
        var textColor = 'white';
      }else{
        var textColor = 'black';
      }
      var result = {
        xref: 'x1',
        yref: 'y1',
        x: xValues[j],
        y: yValues[i],
        text: `${zValues_production[i][j]} kWh`,
        font: {
          family: 'Arial',
          size: 12,
          color: 'rgb(50, 171, 96)'
        },
        showarrow: false,
        font: {
          color: textColor
        }
      };
      layout_production.annotations.push(result);
    }
  }

  var config = {
    responsive: true,
    displaylogo: false
  };

  Plotly.newPlot('heatmap-production', data_production, layout_production, config);

  var data_profit = [{
    x: xValues,
    y: yValues,
    z: zValues_profit,
    type: 'heatmap',
    colorscale: colorscaleValue,
    showscale: false
  }];
    
  var layout_profit = {
    title: 'Zysk',
    margin: {
      l: 80,
      r: 0,
      b: 0,
      t: 80,
    },
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'top'
    },
    yaxis: {
      ticks: '',
      ticksuffix: ' ',
      width: 700,
      height: 700,
      autosize: false
    }
  };

  for ( var i = 0; i < yValues.length; i++ ) {
    for ( var j = 0; j < xValues.length; j++ ) {
      var currentValue = zValues_profit[i][j];
      if (currentValue != 0.0) {
        var textColor = 'white';
      }else{
        var textColor = 'black';
      }
      var result = {
        xref: 'x1',
        yref: 'y1',
        x: xValues[j],
        y: yValues[i],
        text: `${zValues_profit[i][j]} PLN`,
        font: {
          family: 'Arial',
          size: 12,
          color: 'rgb(50, 171, 96)'
        },
        showarrow: false,
        font: {
          color: textColor
        }
      };
      layout_profit.annotations.push(result);
    }
  }

  Plotly.newPlot('heatmap-profit', data_profit, layout_profit, config);
}

function displayTable(table_data) {
  const polishMonths = ["",
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

  var summedProductionByMonth = [];
  var summedProfitByMonth = [];
  var summedProductionByYear = [];
  var summedProfitByYear = [];

  for (let year = 2018; year <= 2050; year++) {
    summedProductionByMonth[year] = new Array(13).fill(0);
    summedProfitByMonth[year] = new Array(13).fill(0);
    summedProductionByYear[year] = 0;
    summedProfitByYear[year] = 0;
  }

  // var allSummedProductionByMonth = new Array(13).fill(0);
  // var allSummedProfitByMonth = new Array(13).fill(0);
  var allSummedProduction = 0;
  var allSummedProfit = 0;

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
    // allSummedProductionByMonth[month] += production;
    // allSummedProfitByMonth[month] += profit;
    allSummedProduction += production;
    allSummedProfit += profit;
  }

  var simulation_table = document.getElementById("simulation-table");

  while (simulation_table.firstChild) {
    simulation_table.removeChild(simulation_table.firstChild);
  }

  var simulation_table_caption = document.createElement("caption");
  simulation_table_caption.innerText = "Produkcja oraz zysk z instalacji fotowoltaiki";
  simulation_table.appendChild(simulation_table_caption);

  var simulation_table_head = document.createElement("thead");
  simulation_table.appendChild(simulation_table_head);

  let head_values = [
    ["th", ""],
    ["th", "Produkcja"],
    ["th", "Zysk"]
  ];

  let row = document.createElement("tr");

  for (let i=0; i < 3; i++) {
    let c = document.createElement(head_values[i][0]);
    c.innerText = head_values[i][1];
    c.style.textAlign = "center";
    row.appendChild(c);
  }

  simulation_table_head.appendChild(row);

  var simulation_table_body = document.createElement("tbody");
  simulation_table.appendChild(simulation_table_body);

  var table_values = [];

  for (let year = 2018; year <= 2023; year++) {
    for (let month = 1; month <= 12; month++) {
      let row_values = [
        ["th", `${year} ${polishMonths[month]}`],
        ["td", `${summedProductionByMonth[year][month].toFixed(2)} kWh`],
        ["td", `${summedProfitByMonth[year][month].toFixed(2)} PLN`]
      ];

      table_values.push(row_values);
    }

    let row_sum = [
      ["th", "Suma z całego roku"],
      ["td", `${summedProductionByYear[year].toFixed(2)} kWh`],
      ["td", `${summedProfitByYear[year].toFixed(2)} PLN`]
    ];
  
    table_values.push(row_sum);

    let row_space = [
      ["th", " "],
      ["td", " "],
      ["td", " "]
    ];
  
    table_values.push(row_space);
  }

  let row_all_sum = [
    ["th", "Suma ze wszystkich lat"],
    ["td", `${allSummedProduction.toFixed(2)} kWh`],
    ["td", `${allSummedProfit.toFixed(2)} PLN`]
  ];

  table_values.push(row_all_sum);

  console.log(table_values)

  for (let i=0; i < table_values.length; i++) {
    let row = document.createElement("tr");
    row.style.height = "2em";

    for (let j=0; j < 3; j++) {
      let c = document.createElement(table_values[i][j][0]);
      c.innerText = table_values[i][j][1];

      if (j > 0)
        c.style.textAlign = "center";

      row.appendChild(c);
    }
    
    simulation_table_body.appendChild(row);
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

      let cols_values = [polishMonths[month], (summedProductionByMonth[year][month] / 1000).toFixed(2), summedProfitByMonth[year][month].toFixed(2)];

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

  if (document.getElementById('map-wrong-input').style.display == "block") // prevent green border without previous error
    document.getElementById('map').style.border = "solid 2px green";

  document.getElementById('map-wrong-input').style.display = "none";

  document.getElementById("map-lat").innerText = `Szerokość: ${geolocation.lat.toFixed(4)}`;
  document.getElementById("map-lng").innerText = `Wysokość: ${geolocation.lng.toFixed(4)}`;
}

var power = document.getElementById("input-power");
var angle = document.getElementById("input-angle");
var azimuth = document.getElementById("input-select-azimuth");

angle.oninput = function() {
  angle.value = this.value;
  document.getElementById("label-angle").innerText = `Kąt nachylenia paneli: ${this.value}°`;
}

azimuth.oninput = function() {
  console.log(azimuth.options[azimuth.selectedIndex].text)
  azimuth.options[azimuth.selectedIndex].innerText = `Kierunek paneli: ${azimuth.options[azimuth.selectedIndex].text}`;
}

// map

var markers = [];
var map = L.map('map', {
  attributionControl: false
}).setView([52, 19], 6);

L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.attribution({
  position: 'topright'
}).addTo(map);

var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
  collapsed: false,
  position: "bottomleft"
}).on('markgeocode', function(e) {
  addNewMarker(e.geocode.center);
  }).addTo(map);

map.on('click', function(e) {
  addNewMarker(e.latlng);
});

// show simulation card

var button_calculate = document.getElementById("button-calculate");
var simulation_card = document.getElementById("simulation-card");

button_calculate.onclick = function() {
  if (checkParametersInput()) {
    simulation_card.style.display = "block";
    document.getElementById("span-wrong-input").style.display = "none";

    document.getElementById('plot').style.display = "none";
    document.getElementById('plot-loading').style.display = "block";
    document.getElementById('plot-cumulative').style.display = "none";
    document.getElementById('plot-cumulative-loading').style.display = "block";

    const url = 'http://api-rce.azurewebsites.net:80/api/estimate';
    const request_data = {
        // start: '2018-01-01',
        start: start_date_string,
        end: '2023-07-11',
        lat: markers[0].lat,
        lon: markers[0].lng,
        azimuth: parseInt(azimuth.value),
        angle: parseInt(angle.value),
        peak_power: parseFloat(power.value) * 1000, // convert from kWp to Wp
    };
    
    const headers = new Headers();
    headers.append('Authorization', 'Bearer f14ab0c5-b4b9-4674-8739-6d3319f94490');
    headers.append('Content-Type', 'application/json');
    
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(request_data),
    })
    .then(response => response.json())
    .then(response_data => {
        console.log(response_data);

        for (let i=0; i < response_data.production.length; i++)
        response_data.production[i] /= 1000 // convert from Wp to kWp
    
        displayPlot(plot_data=response_data, id='plot', cumulative=0);
        displayPlot(plot_data=response_data, id='plot-cumulative', cumulative=1);
        displayTableOnHeatmaps(table_data=response_data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  else {
    console.log('zle podane dane');
    document.getElementById("span-wrong-input").style.display = "block";
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

    console.log(input_email.value)

    const url = 'http://api-rce.azurewebsites.net:80/api/save_email';
    const request_data = {
        email: input_email.value
    };
    
    const headers = new Headers();
    headers.append('Authorization', 'Bearer f14ab0c5-b4b9-4674-8739-6d3319f94490');
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
