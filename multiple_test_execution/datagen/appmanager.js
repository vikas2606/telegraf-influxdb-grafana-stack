const WebSocket = require("ws");
const path = require('path')
const fs = require('fs');

statsFlag = false;
const wss = new WebSocket.Server({ port: 8080 });

// {
//         "messagetype": "notification",
//         "message": {
//             "data": "LTE_SUCCESS",
//             "src": "",
//             "ue_id": "",
//             "level": "",
//             "timestamp": 1657187928753,
//             "layer": "APP",
//             "dir": "",
//             "cell": "",
//             "channel": ""
//         }
//     }

// {
//         "messagetype": "notification",
//         "message": {
//             "data": "STOP_SUCCESS",
//             "src": "",
//             "ue_id": "",
//             "level": "",
//             "timestamp": 1657188010090,
//             "layer": "APP",
//             "dir": "",
//             "cell": "",
//             "channel": ""
//         }
//     }

var datetime = new Date();
var epoc = Date.parse(datetime);

/////////////////////////////////  Stats and logs  //////////////////////////////////////////////////////////////////////////////
var pingData = {
  messagetype: "PING",
  message: {
    data: {
      1: {
        pckt_sent: 100,
        pckt_recvd: 300,
        pckt_loss: 0.0,
        time: 101168 * Math.random(),
        rtt: {
          min: 18.9,
          avg: 21.59 * Math.random(),
          max: 45.48 * Math.random(),
          mdev: 2.96,
        },
      },
      2: {
        pckt_sent: 100,
        pckt_recvd: 200,
        pckt_loss: 5.0,
        time: 101168,
        rtt: {
          min: 11.903126 * Math.random(),
          avg: 24.6 * Math.random(),
          max: 28.48 * Math.random(),
          mdev: 12.96,
        },
      },
    },
    src: "",
    level: " ",
    timestamp: 1598450783860,
    layer: "PING",
    cell: 0,
    channel: "PSS",
  },
};
var ftpGlobalStats = {
  messagetype: "STATS",
  message: {
    data: {
      1: {
        dl: {
          "Time(sec)": 38,
          "Curr bytes": 33.5,
          "Avg speed": 7.4,
        },
        ul: {
          "Time(sec)": 38,
          "Curr bytes": 33.5,
          "Avg speed": 7.4 * Math.random(),
        },
      },
      2: {
        dl: {
          "Time(sec)": 38,
          "Curr bytes": 33.5,
          "Avg speed": 7.4 * Math.random(),
        },
      },
      3: {
        dl: {
          "Time(sec)": 38,
          "Curr bytes": 33.5,
          "Avg speed": 7.4 * Math.random(),
        },
        ul: {
          "Time(sec)": 38,
          "Curr bytes": 33.5,
          "Avg speed": 7.4 * Math.random(),
        },
      },
    },
    src: "",
    level: "",
    timestamp: epoc,
    layer: "FTP",
    cell: "",
    channel: "",
  },
};
var mosData = {
  messagetype: "STATS",
  message: {
    data: [
      {
        Type: "STATS",
        Id: "1",
        Time: "2021-06-09T15:33:48.424+05:30",
        "UE IP": "192.168.4.6",
        "Duration(sec)": 39,
        "Mean RTT(msec)": 19.365,
        Tx: {
          "Total Packets": 1996,
          "Lost Packets": 0,
          "Mean Jitter(msec)": 0.578,
          MOS: 4.412035,
        },
        Rx: {
          "Total Packets": 1996,
          "Lost Packets": 0,
          "Mean Jitter(msec)": 1.11,
          MOS: 4.411791,
        },
      },
    ],
    src: "",
    ue_id: 4,
    level: "",
    timestamp: 1623232981413,
    layer: "SIP",
    dir: "",
    cell: "",
    channel: "",
  },
};

var oruStats = {
  "message": "ru_stats",
  "sync_status"   : "IN_SYNC",
  "execution_time": 1669653639,
  "stats": [
      {
          "ru_id"     : 0,
          "bw"        : "100Mhz",
          "antenna_ul"    : 1,
          "antenna_dl"    : 1,
          "dl_pps"    : 71831,
          "dl_bitrate"    : "2.32Gbps",
          "ul_pps"    : 17940,
          "ul_bitrate"    : "0.60Gbps",
          "tx_total"  : 53820,
          "rx_total"  : 215495,
          "corrupted" : 0,    
          "duplicate" : 0,    
          "dropped"   : 0,    
          "c_plane": {
              "total"     : 18233,
              "on_time"   : 18233,
              "early"     : 0,
              "late"      : 0    
          },
          "u_plane": {
              "total"     : 197262,
              "on_time"   : 197262,
              "early"     : 0,
              "late"      : 0    
          },
          "u_plane_dl": [{
              "eaxc_id"   : 0,
              "sec_type"   : 1,
              "total"     : 197262,
              "on_time"   : 197262,
              "early"     : 0,
              "late"      : 0    
          }],
          "c_plane_dl": [{
              "eaxc_id"   : 0,
              "sec_type"   : 1,
              "total"     : 14346,
              "on_time"   : 14346,
              "early"     : 0,
              "late"      : 0        
          }],
          "c_plane_ul": [{
              "eaxc_id"   : 0,
              "sec_type"   : 1,
              "total"     : 3588,
              "on_time"   : 3588,
              "early"     : 0,
              "late"      : 0    
          },
          {
              "eaxc_id"   : 1,
              "sec_type"   : 3,
              "total"     : 299,
              "on_time"   : 299,
              "early"     : 0,
              "late"      : 0    
          }]
      },
      {
        "ru_id"     : 0,
        "bw"        : "100Mhz",
        "antenna_ul"    : 1,
        "antenna_dl"    : 1,
        "dl_pps"    : 71831,
        "dl_bitrate"    : "2.32Gbps",
        "ul_pps"    : 17940,
        "ul_bitrate"    : "0.60Gbps",
        "tx_total"  : 53820,
        "rx_total"  : 215495,
        "corrupted" : 0,    
        "duplicate" : 0,    
        "dropped"   : 0,    
        "c_plane": {
            "total"     : 18233,
            "on_time"   : 18233,
            "early"     : 0,
            "late"      : 0    
        },
        "u_plane": {
            "total"     : 197262,
            "on_time"   : 197262,
            "early"     : 0,
            "late"      : 0    
        },
        "u_plane_dl": [{
            "eaxc_id"   : 0,
            "sec_type"   : 1,
            "total"     : 197262,
            "on_time"   : 197262,
            "early"     : 0,
            "late"      : 0    
        }],
        "c_plane_dl": [{
            "eaxc_id"   : 0,
            "sec_type"   : 1,
            "total"     : 14346,
            "on_time"   : 14346,
            "early"     : 0,
            "late"      : 0        
        }],
        "c_plane_ul": [{
            "eaxc_id"   : 0,
            "sec_type"   : 1,
            "total"     : 3588,
            "on_time"   : 3588,
            "early"     : 0,
            "late"      : 0    
        },
        {
            "eaxc_id"   : 1,
            "sec_type"   : 3,
            "total"     : 299,
            "on_time"   : 299,
            "early"     : 0,
            "late"      : 0    
        }]
      }
  ]
}

var oruLogs = {
  "message": "ru_logs",
  "logs": [
              {
                      "RU id"         : 0,
                      "eAxC ID"       : 1,
                      "Message Type"  : "C Plane",
                      "Direction"     : "UL",
                      "Time Info"     : "1:8:0:10",
                      "data"          : {"eCPRI Message":"ECPRI_RT_CONTROL_DATA","eCPRI Payload":28}
              },
              {
                      "RU id"         : 0,
                      "eAxC ID"       : 1,
                      "Message Type"  : "C Plane",
                      "Direction"     : "DL",
                      "Time Info"     : "1:8:0:8",
                      "data"          : {"eCPRI Message":"ECPRI_RT_CONTROL_DATA","eCPRI Payload":28}
              }
      ]
}

////////////////////////////////////  Success notifications ///////////////////////////////////////////////////////////////////////////////////
var oruLicenseSuccess = {
  "messageType": "notification",
  "timeStamp": 1,
  "type": "LICENSE_ORU",
  "status": "SUCCESS",
  "message": "ORU license is present",
  "layer": "APP",
};
var guiLicenseSuccess = {
  "messageType": "notification",
  "timeStamp": 2,
  "type": "LICENSE_GUI",
  "status": "SUCCESS",
  "message": "GUI license is present",
  "layer": "APP",
};
var ueLicenseSuccess = {
  "messageType": "notification",
  "timeStamp": 2,
  "type": "LICENSE_UE",
  "status": "SUCCESS",
  "message": "UE license is present",
  "layer": "APP",
};

var oruConfigSuccess = {
  "messageType": "notification",
  "timeStamp": 4,
  "type": "CONFIG_ORU",
  "status": "SUCCESS",
  "message": "ORU config is correct.",
  "layer": "APP",
};
var configSuccess = {
  "messageType": "notification",
  "timeStamp": 5,
  "type": "CONFIG",
  "status": "SUCCESS",
  "message": "Config is correct.",
  "layer": "APP",
};

var ueSuccess = {
  "messageType": "notification",
  "timeStamp": 6,
  "type": "UE",
  "status": "SUCCESS",
  "message": "UE simulator health is good",
  "layer": "APP",
};
var oruUeSuccess = {
  "messageType": "notification",
  "timeStamp": 7,
  "type": "ORU",
  "status": "SUCCESS",
  "message": "ORU simulator health is good",
  "layer": "APP",
};

var lteSuccess = {
  "messageType": "notification",
  "timeStamp": 8,
  "type": "",
  "status": "LTE_SUCCESS",
  "message": "UE Simulator started successfully.",
  "layer": "APP",
};

var successsArray=[oruLicenseSuccess,guiLicenseSuccess,ueLicenseSuccess,oruConfigSuccess,configSuccess,oruUeSuccess,ueSuccess,lteSuccess]

/////////////////////////////////////////////////// Failed notofication ////////////////////////////////////////////////////////////////

var oruLicenseFailed = {
  "messageType": "notification",
  "timeStamp": 1,
  "type": "LICENSE_ORU",
  "status": "FAILED",
  "message": "ORU license is not present.",
  "layer": "APP",
};
var guiLicenseFailed = {
  "messageType": "notification",
  "timeStamp": 2,
  "type": "LICENSE_GUI",
  "status": "FAILED",
  "message": "GUI license is not present",
  "layer": "APP",
};
var ueLicenseFailed = {
  "messageType": "notification",
  "timeStamp": 2,
  "type": "LICENSE_UE",
  "status": "FAILED",
  "message": "UE license is not present",
  "layer": "APP",
};

var oruConfigFailed = {
  "messageType": "notification",
  "timeStamp": 4,
  "type": "CONFIG_ORU",
  "status": "FAILED",
  "message": "ORU config is not correct.",
  "layer": "APP",
};
var configFailed = {
  "messageType": "notification",
  "timeStamp": 5,
  "type": "CONFIG",
  "status": "FAILED",
  "message": "Config is not correct.",
  "layer": "APP",
};

var ueFailed = {
  "messageType": "notification",
  "timeStamp": 6,
  "type": "UE",
  "status": "FAILED",
  "message": "UE simulator health is not good",
  "layer": "APP",
};
var oruFailed = {
  "messageType": "notification",
  "timeStamp": 7,
  "type": "ORU",
  "status": "FAILED",
  "message": "ORU simulator health is not good",
  "layer": "APP",
};

var lteError = {
  "messageType": "notification",
  "timeStamp": 1,
  "type": "",
  "status": "LTE_FAILED",
  "message": "UE Simulator failed to start.",
  "layer": "APP",
};
var stopSuccess = {
  "messageType": "notification",
  "timeStamp": 1,
  "type": "",
  "status": "STOP_SUCCESS",
  "message": "UE Simulator stopped successfully.",
  "layer": "APP",
};


// var failedArray= [oruLicenseFailed,lteError];
// var failedArray= [oruLicenseSuccess,guiLicenseFailed,lteError];
// var failedArray= [oruLicenseSuccess,guiLicenseSuccess,ueLicenseFailed,lteError];
var failedArray= [oruLicenseSuccess,guiLicenseSuccess,ueLicenseSuccess,oruConfigFailed,lteError];
// var failedArray= [oruLicenseSuccess,guiLicenseSuccess,ueLicenseSuccess,oruConfigSuccess,configFailed,lteError];
// var failedArray= [oruLicenseSuccess,guiLicenseSuccess,ueLicenseSuccess,oruConfigSuccess,configSuccess,oruFailed,lteError];
// var failedArray= [oruLicenseSuccess,guiLicenseSuccess,ueLicenseSuccess,oruConfigSuccess,configSuccess,oruUeSuccess,ueFailed,lteError];

/////////////////////////////////////////////////  websocket logic  ////////////////////////////////////////////////////////////////////////////

var emitSuccess= true;

console.log("App-Manager started.");

var intervlarForOruStats


wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    // console.log(message);
    if (message === 'STOP_TEST' || message === 'POWER_OFF') {
      setTimeout(() => {
        ws.send(JSON.stringify(stopSuccess));
        clearInterval(intervlarForOruStats);
      }, 1000);
    } else {
      //let data = JSON.parse(message);
      //console.log(data);
        if (message.toString() === "start_test") {
	    console.log("Received: %s", message);
            if (emitSuccess) {
                    for (let i = 0; i < successsArray.length; i++) {
                      const element = successsArray[i];
                      setTimeout(() => {
                        ws.send(JSON.stringify(element));
                      }, (1000*(i+1)));
                    }

                    // setTimeout(() => {
                    //   if (data.oruConfig) {
                    //     intervlarForOruStats = setInterval(() => {
                    //       console.log("sending oru stats data");
                    //       ws.send(JSON.stringify(oruStats));
                    //       // ws.send(JSON.stringify(oruLogs));
                    //     }, 1000);
                    //   }
                    // }, 14000);
            } else {
                    for (let i = 0; i < failedArray.length; i++) {
                      const element = failedArray[i];
                      setTimeout(() => {
                        ws.send(JSON.stringify(element));
                      }, (2000*(i+1)));
                    }

                    // setTimeout(() => {
                    //         ws.send(JSON.stringify(licenseError));
                    // }, 3000);

                    // setTimeout(() => {
                    //   ws.send(JSON.stringify(licenseError));
                    // }, 3000);

                    // setTimeout(() => {
                    //   ws.send(JSON.stringify(licenseError));
                    // }, 3000);

                    // setTimeout(() => {
                    //         ws.send(JSON.stringify(configError));
                    // }, 4000);
                    // setTimeout(() => {
                    //         ws.send(JSON.stringify(ueError));
                    // }, 5000);
                    // setTimeout(() => {
                    //         ws.send(JSON.stringify(lteError));
                    // }, 6000);

            }
          }
      }
   
    ws.send(JSON.stringify(pingData));
    // ws.send(JSON.stringify(mosData));
    // ws.send(JSON.stringify(ftpGlobalStats));
  });
});
