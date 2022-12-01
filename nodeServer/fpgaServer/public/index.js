import * as time from "./time.js";

let inputInterval = document.getElementById("inputInterval");
let inputLength = document.getElementById("inputLength");
let buttonResume = document.getElementById("buttonResume");
let buttonPause = document.getElementById("buttonPause");
let charts = document.getElementById("charts");

  let limitChartReadings = 100;
  let timeToUpdate = 1000;
  let pinArray = ["A0", "A1", "A2", "A3", "A4", "A5", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
  let chartArray = [];
  let chartInstanceArray = [];
  let arraysAxisX = [];
  let arraysAxisY = [];
  let running = true;

  inputInterval.addEventListener("change", function(){
    if(Number(inputInterval.value) != NaN){
        timeToUpdate = Number(inputInterval.value);
    }else{
        alert("Please put a number");
    }
  });

  inputLength.addEventListener("change", function(){
    if(Number(inputLength.value) != NaN){
     limitChartReadings = Number(inputLength.value);
    }else{
        alert("Please put a number");
    }
  });

  buttonResume.addEventListener("click", function(){
    running = true;
    loop();
  });

  buttonPause.addEventListener("click", function(){
    running = false;
  });

  for(let pin of pinArray){
    let chart = document.createElement("canvas");
    chart.style.width = "70%";
    charts.appendChild(chart);
    chartArray.push(chart);
    let arrayAxisX = [];
    let arrayAxisY = [];
    arraysAxisX.push(arrayAxisX);
    arraysAxisY.push(arrayAxisY);

    let chartInstance = new Chart(chart, {
    type: "line",
    data: {
      labels: arrayAxisX,
      datasets: [
        {
          label: pin,
          data: arrayAxisY,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          suggestedMax: 500,
        },
      },
    },
  });

  chartInstance.options.animation = false; // disables all animations

  chartInstanceArray.push(chartInstance);

  }

  async function loop () {

    let data = await fetch("/data");
    data = await data.json();
    await time.wait(timeToUpdate);

    const currentDate = new Date();
    let xAxisLabel = `${currentDate.getMinutes()}:${currentDate.getSeconds()}:${currentDate.getMilliseconds()}`;

    for(let index in pinArray){
      arraysAxisX[index].push(xAxisLabel);
      if(pinArray[index][0] == "A" || pinArray[index][0] == "a"){
        arraysAxisY[index].push((data[pinArray[index]] / 1024) * 5);  //Analogo
      }else{
        arraysAxisY[index].push(data[pinArray[index]] * 5); //Digital
      }

      if(arraysAxisX[index].length >= limitChartReadings && arraysAxisY[index].length >= limitChartReadings){
        arraysAxisX[index].shift();
        arraysAxisY[index].shift();
      }
      chartInstanceArray[index].update();
    }

    if(running){
        return await loop();
    }
    
  }
  loop();