var power = document.getElementById("input-power");
var angle = document.getElementById("input-angle");
var azimuth = document.getElementById("input-azimuth");
var button = document.getElementById("button-calculate");
var prediction_card = document.getElementById("prediction-card");

power.oninput = function() {
  power.value = this.value;
  console.log(power.value);
}

angle.oninput = function() {
  angle.value = this.value;
  console.log(angle.value);
}

azimuth.oninput = function() {
  azimuth.value = this.value;
  console.log(azimuth.value);
}

const layout = {
  title: "Produkcja PV",
  margin: {
    l: 20,
    r: 20,
    b: 20,
    t: 120,
  },
};

const config = {
  responsive: true
}

button.onclick = function() {
  prediction_card.style.display = "block";

  const url = 'http://127.0.0.1:80/api/estimate';
  const request_data = {
      start: '2023-07-10',
      end: '2023-07-11',
      lat: 52.1077,
      lon: 22.1306,
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
  .then(data => {
      console.log(data);
  
      const plot_data = [{
        x: data.time,
        y: data.production,
        mode: "lines",
        type: "scatter"
      }];
      
      Plotly.newPlot("plot", plot_data, layout, config);
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

const plot_data = [{
  x: [50,60,70,80,90,100,110,120,130,140,150],
  y: [7,8,8,9,9,9,10,11,14,14,15],
  mode: "lines",
  type: "scatter"
}];

Plotly.newPlot("plot", plot_data, layout, config);