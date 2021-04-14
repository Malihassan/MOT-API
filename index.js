const expr = require("express");
const axios = require('axios');

const app = expr();
//middleware
app.use(expr.json());
const jsonrequest = {
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

app.post("/RegisterSensor", async (req, res) => {
  console.log("in addNewSensor router");
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
      let result = await CheckReadings(Name ,splitsplitcoo[1]);
      console.log(result);
      res.send({"sensorId":result});
      // res.send(`the Name of Sensor :${Name} , Cookie :${splitsplitcoo[1]}`)
    })
    .catch(function (error) {
      console.log(error);
    });
})
async function CheckReadings(Name,Cookie) {
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
  let data =jsonrequest;
  data.Package.SensorDetails.SensorName =Name;
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

// app.post("/CheckReadings", async (req, res) => {
//     console.log("in addNewSensor router");
//     const { Name, Cookie } = req.body

//     let URL = 'https://learning.masterofthings.com/CheckReadings'
//     let config = {
//     headers: {
//     'Content-Type': 'application/json',
//     'Cookie':'MOTSID =s%3AKBllC3t45JDfY5bynbZtlR8hyj4oWIsx.NP71omG%2Bd9yL5NlqkcnfyD4xbgqF1QGoFVuVvy8H1Qc'
//             }
//     }
//     let data ={"readings": ["appVersion", "phoneVersion", "captureTime", "currentNearnessLevel"]}
//     axios.post(URL, data, config)
//     .then(function (response) {
//           console.log(response.data);
//           res.send(response.data) 
//       })
//       .catch(function (error) {
//           console.log(error);
//       });

// })

// app.post("/RegisterSensor", async (req, res) => {
//   console.log("in addNewSensor router");
//   const { Name, Cookis } = req.body;

//   let URL = 'https://learning.masterofthings.com/RegisterSensor';
//   let config = {
//   headers: {
//   'Content-Type': 'application/json',
//   'Cookie':'MOTSID =s%3AKBllC3t45JDfY5bynbZtlR8hyj4oWIsx.NP71omG%2Bd9yL5NlqkcnfyD4xbgqF1QGoFVuVvy8H1Qc'
//           }
//   }
//   let data =jsonrequest;
//   axios.post(URL, data, config)
//   .then(function (response) {
//         console.log(response.data.SensorId);
//         res.send(response.data.SensorId) 
//     })
//     .catch(function (error) {
//         console.log(error);
//     });

// })



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})