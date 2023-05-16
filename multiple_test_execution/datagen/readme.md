# datagen

datagen refers to UE box [here](https://github.com/Simnovus-Corp/simnovator-2.0-poc/multiple_test_execution/docs/multiple_test_execution.png), where it runs appmanager.js on port 8080 and ueserver.js on port 9003.

## appmanager.js

appmanager.js is mock appmanager which is running on port 8080, and sends notifications on start/stop of testcases on socket. Here we have made some code changes, so that on receiving "start_test" as query message (instead of config), it sends successarray and pingData.

## ueserver.js

ueserver.js is mock ueserver running on port 9003, which sends stats, ue_get, log_get and config_get data on socket. Here we have made some code changes to send data based on query message received, i.e on receving 'stats' as query message send only stats data.
