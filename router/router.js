const expr = require("express");
const axios = require('axios');
const router =expr.Router();

//**************************************************************** */
const jsontoAddSens = {
    "Package": {
      "SensorDetails": {
        "SensorName": "Amir",
        "SensorCode": "1",
        "DriverManagerId": "MoTSensorKitv2.0",
        "SensorReading": "appVersion,phoneVersion,captureTime,currentNearnessLevel",
        "isEditable": 1,
        "Cached": 1,
        "CachedOnly": 0,
        "DataMissingAlarm": "0",
        "LogicalReadings": "[]"
      }
      ,
      "SensorFields": [{
        "ReadingName": "appVersion",
        "ReadingLabelEn": "appVersion",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "STRING",
        "Length": "40",
        "Min": -1,
        "Max": -1
      }
  
        ,
      {
        "ReadingName": "phoneVersion",
        "ReadingLabelEn": "phoneVersion",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "STRING",
        "Length": "40",
        "Min": -1,
        "Max": -1
      }
  
        ,
      {
        "ReadingName": "captureTime",
        "ReadingLabelEn": "captureTime ",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "STRING",
        "Length": "40",
        "Min": -1,
        "Max": -1
      }
  
        ,
      {
        "ReadingName": "currentNearnessLevel",
        "ReadingLabelEn": "currentNearnessLevel ",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "NUMBER",
        "Length": "40",
        "Min": "0",
        "Max": "10000000000"
      }
  
      ]
    }
  }
  router.post("/RegisterSensor", async (req, res) => {
    console.log("in addNewSensor router");
    //floor ID  ==>Cons
    //Name ==> Sensor Name
    //Mon ==>  Parking+con+SensorName 
    const { Name , ConsolidatedID , MonitorName} = req.body
    // this for get cookis 
    let URL = 'https://learning.masterofthings.com/Login'
    let data = 'username=momenzakaria&password=MOMEN@@2016&DomainName=Training'
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }
    axios.post(URL, data, config)
      .then( async function (response) {
        let totalcookie = response.headers["set-cookie"][0];
        // console.log("==========>" + response.headers["set-cookie"]);
        // console.log(typeof (response.headers["set-cookie"]));
        let splitcookie = totalcookie.split(";")
        let splitsplitcoo = splitcookie[0].split("=")
        // console.log(`the Name of Sensor :${Name} , Cookie :${splitsplitcoo[1]}`);
        // res.send(response.headers["set-cookie"]) 
        let SenID = await CheckReadingsSens(Name ,splitsplitcoo[1]);
        let MonID = await AddMonitor(SenID ,ConsolidatedID , MonitorName,splitsplitcoo[1])
        console.log(SenID);
        console.log(MonID);
        res.send({"sensorId":SenID,"sonitorId":MonID});

      })
      .catch(function (error) {
        console.log(error);
      });
  })
  async function CheckReadingsSens(Name,Cookie) {
    let addSen
    let URL = 'https://learning.masterofthings.com/CheckReadings'
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'MOTSID =' + Cookie
      }
    }
    let data = { "readings": ["appVersion", "phoneVersion", "captureTime", "currentNearnessLevel"] }
    await axios.post(URL, data, config)
      .then(async function (response) {
        console.log(response.data);
        // res.send(response.data)
        if(response.data.message === true){
         addSen = await AddSensor(Name,Cookie)
         
        }
      })
      .catch(function (error) {
        console.log(error);
      });
      return addSen ;
  }
  async function AddSensor(Name,Cookie){
    let sensorId ;
     let URL = 'https://learning.masterofthings.com/RegisterSensor';
    let config = {
    headers: {
    'Content-Type': 'application/json',
    'Cookie':'MOTSID ='+Cookie
            }
    }
    let data =jsontoAddSens;
    data.Package.SensorDetails.SensorName = Name;
    let x = await axios.post(URL, data, config)
    .then(function (response) {
          // console.log(response.data.SensorId);
           sensorId = response.data.SensorId;
      })
      .catch(function (error) {
          console.log(error);
      });
      return sensorId ;
  }
//**************************Add monitor*************************************** */
const jsontoAddMonitor ={
    "SensorId": "4390",
    "ReadingName": "currentNearnessLevel",
    "Value": "",
    "Equality": "a",
    "EventId": "9",
    "MonitorName": "test55",
    "ExtraParameter": "{\"Server\":\"\",\"Port\":\"\",\"DriverManagerId\":\"1\",\"DriverManagerPassword\":\"123\",\"SensorId\":\"4389\"}"
}
  async function AddMonitor(SensorID ,ConsolidatedID , MonitorName,Cookie){
    let monitorId ;
     let URL = 'https://learning.masterofthings.com/AddMonitorEvents';
    let config = {
    headers: {
    'Content-Type': 'application/json',
    'Cookie':'MOTSID ='+Cookie
        }
    }
    let data =jsontoAddMonitor;
    data.MonitorName = MonitorName;
    data.SensorId = SensorID ;
    data.ExtraParameter.SensorId =ConsolidatedID ;
    let x = await axios.post(URL, data, config)
    .then(function (response) {
          monitorId = response.data.monitorId;
      })
      .catch(function (error) {
          console.log(error);
      });
      return monitorId ;
  }
  //**************************Add Consolidated******************************* */

  const jsonToAddCons = {
    "Package": {
      "SensorDetails": {
        "SensorName": "Amir",
        "SensorCode": "1",
        "DriverManagerId": "1",
        "SensorReading": "appVersion,phoneVersion,captureTime,currentNearnessLevel,SensorId",
        "isEditable": 1,
        "Cached": 1,
        "CachedOnly": 0,
        "DataMissingAlarm": "0",
        "LogicalReadings": "[]"
      }
      ,
      "SensorFields": [{
        "ReadingName": "appVersion",
        "ReadingLabelEn": "appVersion",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "STRING",
        "Length": "40",
        "Min": -1,
        "Max": -1
      }
  
        ,
      {
        "ReadingName": "phoneVersion",
        "ReadingLabelEn": "phoneVersion",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "STRING",
        "Length": "40",
        "Min": -1,
        "Max": -1
      }
  
        ,
      {
        "ReadingName": "captureTime",
        "ReadingLabelEn": "captureTime ",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "STRING",
        "Length": "40",
        "Min": -1,
        "Max": -1
      }
  
        ,
      {
        "ReadingName": "currentNearnessLevel",
        "ReadingLabelEn": "currentNearnessLevel ",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "NUMBER",
        "Length": "40",
        "Min": "0",
        "Max": "10000000000"
      }
        ,
      {
        "ReadingName": "SensorId",
        "ReadingLabelEn": "SensorId",
        "ReadingDesEn": " ",
        "ReadingLabelAr": " ",
        "ReadingDesAr": " ",
        "Image": " ",
        "Unit": " ",
        "Status": "Y",
        "Editable": "Y",
        "ExtraParameter": "",
        "Default": " ",
        "Type": "NUMBER",
        "Length": "40",
        "Min": "0",
        "Max": "10000000000"
      }
      ]
    }
  }
  router.post("/RegisterConsSensor", async (req, res) => {
    console.log("in addNew Cons Sensor ");
    const { Name } = req.body
    // console.log(`the Name of Sensor :${Name} , Cookis :${Cookis}`);
  
    // this for get cookis 
    let URL = 'https://learning.masterofthings.com/Login'
    let data = 'username=momenzakaria&password=MOMEN@@2016&DomainName=Training'
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }
    axios.post(URL, data, config)
      .then( async function (response) {
        let totalcookie = response.headers["set-cookie"][0];
        // console.log("==========>" + response.headers["set-cookie"]);
        // console.log(typeof (response.headers["set-cookie"]));
        let splitcookie = totalcookie.split(";")
        let splitsplitcoo = splitcookie[0].split("=")
        // console.log(`the Name of Sensor :${Name} , Cookie :${splitsplitcoo[1]}`);
        // res.send(response.headers["set-cookie"]) 
        let ConsSensorID = await CheckReadingsCONS(Name ,splitsplitcoo[1]);
      
        console.log(ConsSensorID);
        res.send({"sensorId":ConsSensorID});
        // res.send(`the Name of Sensor :${Name} , Cookie :${splitsplitcoo[1]}`)
      })
      .catch(function (error) {
        console.log(error);
      });
  })
  async function CheckReadingsCONS(Name,Cookie) {
    let addSen
    let URL = 'https://learning.masterofthings.com/CheckReadings'
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'MOTSID =' + Cookie
      }
    }
    let data = { "readings": ["appVersion", "phoneVersion", "captureTime", "currentNearnessLevel","SensorId"] }
    await axios.post(URL, data, config)
      .then(async function (response) {
        console.log(response.data);
        // res.send(response.data)
        if(response.data.message === true){
         addSen = await AddSensorCONS(Name,Cookie)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
      return addSen ;
  }
  async function AddSensorCONS(Name,Cookie){
    let sensorId ;
     let URL = 'https://learning.masterofthings.com/RegisterSensor';
    let config = {
    headers: {
    'Content-Type': 'application/json',
    'Cookie':'MOTSID ='+Cookie}
    }
    let data =jsonToAddCons;
    data.Package.SensorDetails.SensorName = Name;
    let x = await axios.post(URL, data, config)
    .then(function (response) {
          // console.log(response.data.SensorId);
          sensorId = response.data.SensorId;
      })
      .catch(function (error) {
          console.log(error);
      });
      return sensorId ;
  }



  module.exports = router