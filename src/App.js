import React from 'react';
import './App.css';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import _ from 'lodash';

const API = 'https://ssvitanovserver.herokuapp.com/sensor_data/';
const QUERY_LATEST = 'latest';
const QUERY_LAST_HOUR = 'lastMinute';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdDate: "0",
      pm25: 0,
      pm10: 0,
      temperature: 0,
      humidity: 0,
      pressure: 0,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'pm25',
            data: [],
            fill: false,          
            borderColor: 'red'  
          },
          {
            label: 'pm10',
            data: [],
            fill: false,          
            borderColor: 'yellow'  
          }
        ]
      }
    };
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <p>Дата и час: {moment(this.state.createdDate).format('DD.MM.YYYY h:mm:ss a')}</p>
          <p>ФПЧ 2.5 (µg/m³): {this.state.pm25}</p>
          <p>ФПЧ 10 (µg/m³): {this.state.pm10}</p>
          <p>Температура (°C): {this.state.temperature}</p>
          <p>Влажност (%): {this.state.humidity}</p>
          <p>Атмосферно налягане (hPa): {this.state.pressure}</p>
        </header>

        <article className="canvas-container">
          <Line data={this.state.chartData}/>
        </article>
      </div>
    );
  }
 
  componentDidMount() {

    fetch(API + QUERY_LAST_HOUR)
    .then(response => response.json())
    .then(data => {

       let chartLabels = data.map(function(sensorData) {
        return moment(sensorData.createdDate).format('hh:mm:ss')
       });

       let pm25Data = data.map(function(sensorData) {
        return sensorData.pm25
       });

       let pm10Data = data.map(function(sensorData) {
        return sensorData.pm10
       });

       let newState = Object.assign({}, this.state);
       newState.chartData.labels = chartLabels;
       newState.chartData.datasets[0].data = pm25Data;
       newState.chartData.datasets[1].data = pm10Data;

       let lastItem = data.slice(-1)[0];

       newState.createdDate = lastItem.createdDate;
       newState.pm25 = lastItem.pm25;
       newState.pm10 = lastItem.pm10;
       newState.temperature = lastItem.temperature;
       newState.humidity = lastItem.humidity;
       newState.pressure = lastItem.pressure;

       this.setState(newState);
    });

    try {
      setInterval(async () => {
      //  const res = await fetch(API + QUERY_LATEST);
      //  const data = await res.json();

      fetch(API + QUERY_LAST_HOUR)
        .then(response => response.json())
        .then(data => {

       let chartLabels = data.map(function(sensorData) {
        return moment(sensorData.createdDate).format('hh:mm:ss')
       });

       let pm25Data = data.map(function(sensorData) {
        return sensorData.pm25
       });

       let pm10Data = data.map(function(sensorData) {
        return sensorData.pm10
       });

       let newState = Object.assign({}, this.state);
       newState.chartData.labels = chartLabels;
       newState.chartData.datasets[0].data = pm25Data;
       newState.chartData.datasets[1].data = pm10Data;

       let lastItem = data.slice(-1)[0];

       newState.createdDate = lastItem.createdDate;
       newState.pm25 = lastItem.pm25;
       newState.pm10 = lastItem.pm10;
       newState.temperature = lastItem.temperature;
       newState.humidity = lastItem.humidity;
       newState.pressure = lastItem.pressure;

       this.setState(newState);
    });

      }, 5000);
    } catch(e) {
      console.log(e);
    };
  }
}

export default App;
