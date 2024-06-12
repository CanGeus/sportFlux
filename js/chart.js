// Variabel untuk menyimpan instance Chart untuk setiap grafik
let myLineChart1, myLineChart2, myLineChart3, myLineChart4 , myLineChart5, myLineChart6;

// Function untuk render chart
function renderChart(ctx, labels, data, label) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: data,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 10,
            padding: 10,
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
      }
    }
  });
}

// Function untuk render chart suhu udara
function renderIr(ctx, labels, data) {
  if (myLineChart1) {
    myLineChart1.data.labels = labels;
    myLineChart1.data.datasets[0].data = data;
    myLineChart1.update();
  } else {
    myLineChart1 = renderChart(ctx, labels, data, "Infra Red");
  }
}

// Function untuk render chart kelembapan udara
function renderBpm(ctx, labels, data) {
  if (myLineChart2) {
    myLineChart2.data.labels = labels;
    myLineChart2.data.datasets[0].data = data;
    myLineChart2.update();
  } else {
    myLineChart2 = renderChart(ctx, labels, data, "Bpm");
  }
}

// Function untuk render chart intensitas cahaya
function renderSuhu(ctx, labels, data) {
  if (myLineChart3) {
    myLineChart3.data.labels = labels;
    myLineChart3.data.datasets[0].data = data;
    myLineChart3.update();
  } else {
    myLineChart3 = renderChart(ctx, labels, data, "Suhu");
  }
}

// Function untuk render chart kelembapan tanah
function renderMuscle(ctx, labels, data) {
  if (myLineChart4) {
    myLineChart4.data.labels = labels;
    myLineChart4.data.datasets[0].data = data;
    myLineChart4.update();
  } else {
    myLineChart4 = renderChart(ctx, labels, data, "Analog");
  }
}


// Function untuk render chart Rain
function renderRain(ctx, labels, data) {
  if (myLineChart5) {
    myLineChart5.data.labels = labels;
    myLineChart5.data.datasets[0].data = data;
    myLineChart5.update();
  } else {
    myLineChart5 = renderChart(ctx, labels, data, "Status");
  }
}

// Function untuk render chart Pressure
function renderPressure(ctx, labels, data) {
  if (myLineChart6) {
    myLineChart6.data.labels = labels;
    myLineChart6.data.datasets[0].data = data;
    myLineChart6.update();
  } else {
    myLineChart6 = renderChart(ctx, labels, data, "Tekanan");
  }
}

// Function untuk fetch data dan render chart
async function fetchDataAndRenderChart() {
  const apiUrl = './api/getData.php';

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const timestamps = data.map(entry => entry.waktu);
    const ir = data.map(entry => entry.ir);
    const bpm = data.map(entry => entry.bpm);
    const suhu = data.map(entry => entry.temp);
    const muscle = data.map(entry => entry.muscle);

    renderIr(document.getElementById("myAreaChart"), timestamps, ir);
    renderBpm(document.getElementById("myAreaChart1"), timestamps, bpm);
    renderSuhu(document.getElementById("myAreaChart2"), timestamps, suhu);
    renderMuscle(document.getElementById("myAreaChart3"), timestamps, muscle);
  

  } catch (error) {
    console.error('Error fetching or parsing data:', error);
  }
}

// Panggil fetchDataAndRenderChart untuk memulai
fetchDataAndRenderChart();
// Refresh setiap 5 detik
setInterval(fetchDataAndRenderChart, 5000);
