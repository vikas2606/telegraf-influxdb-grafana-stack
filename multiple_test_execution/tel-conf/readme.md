# Telegraf Configurations

Following are the configuration details for telegraf which is used to configure telegraf.conf files:

### Global tags:
Global tags can be specified here in key-value format.
```conf
[global_tags]
  "testcase" = "123"
```
Here we have configured testcase id as global tag which will get attached to all metrics, and will be stored as foreign key in timescaledb postegrsql. This will help us to relate all metrics with test case id. This testcase id will be configured runtime in actual use case.

### Agent: 
Configuration for telegraf agent
```conf
[agent]
  interval = "30s"
  round_interval = true
  metric_batch_size = 1000
  metric_buffer_limit = 10000
  collection_jitter = "0s"
  flush_interval = "40s"
  flush_jitter = "0s"
  precision = ""

  ## Log at debug level.
  debug = true
  quiet = false
```
Agent is responsible for polling data from datagen by sending triggerbody configured in websocket input plugin. Agent collects data from datagen every 30s interval, and flush data every 40s and writes to output plugin.


### Input plugin :
Configuration for websocket input plugin to collect data from datagen whcih is nothing but UE box.

```conf
[[inputs.websocket]]
    name_override = "cellslayer"
    url = "ws://telegraf_datagen-1:9003"
    data_format = "json"
    trigger_body = "stats"
```
Here telegraf is listening to datagen-1 on websocket port 9003. It sends 'stats' as query message to ueserver and receives stats data from ueserver.

'name_override' -  is a metric filtering option in telegraf, to override input plugin name incase of configuring multiple plugins of same type. Telegraf will store stats data with 'cellslayer' as table name in timescaledb.

Similary we have configured websocket input plugin for ue_get, log_get and data.

### Output plugin :
Configuration for output plugin zincObserve:
```conf
[[outputs.elasticsearch]]
    urls = ["http://zincObserve:5080/api/default"]
    username = "root@example.com"
    password = "root"
    index_name = "telegraf-{{host}}-2023.04.19"
    health_check_interval = 0
    namepass = ["logdata"]
```
Here we have configured zincObserve as a search engine for log_get data coming from ueserver. It will store log data with index_name configured above, here host is nothing but container id of telegraf.

'namepass' is metric filtering option used to pass only log data to zincObserver.

Configuration for output plugin timesacledb postgresql:
```conf
[outputs.postgresql]
    connection = "postgresql://admin:admin123@timescaledb:5432"
    schema = "public"
    tags_as_foreign_keys = true
    namedrop = ["logdata"]
```

Here timescaledb postgresql is configured as a output plugin to store all stats, ue_get and pingData received from ueserver and appmanager.

'namedrop' is metric filtering option used to drop log data to database as its being stored in zincobserve.

Configuration for outputput plugin file:
```conf
[[outputs.file]]
    files = ["stdout"]
```

Output plugin to send metrics in files.

Configuration for kafka server:
```conf
[[outputs.kafka]]
    brokers = ["broker:9092"]
    topic = "telegraf"
    data_format = "json"
```
Kafka server is listening on port 9092, to send data on topic 'telegraf'.

Configuration for kafka consumer:
```conf
[[outputs.kafka_consumer]]
    brokers = ["broker:9092"]
    topic = ["telegraf"]
    data_format = "json"
```
Kafka consumer is listening on port 9092, to receive data on topic 'telegraf'.

Note: Kafka server and consumer are not configured in this poc. This configurations will be used further to integrate kafka with telegraf.