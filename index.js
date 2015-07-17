
var fs =  require("fs");
//      exec = require('child_process').exec;

var raspi = [];
var data;

var PiStats = function(){
    var temperature = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp");
    temperature = ((temperature/1000).toPrecision(3)) + "°C";



      function getValFromLine(line){
            var match = line.match(/[0-9]+/gi);
            if(match !== null)
                return parseInt(match[0]);
            else
                return null;
       }

        var memInfo = {};
            fs.readFile("/proc/meminfo", "utf8", function(err, data){
                if(err){
                    return err;
                }
                var lines = data.split('\n');
                memInfo.total = Math.floor(getValFromLine(lines[0]) / 1024);
                memInfo.free = Math.floor(getValFromLine(lines[1]) / 1024);
                memInfo.cached = Math.floor(getValFromLine(lines[3]) / 1024);
                memInfo.used = memInfo.total - memInfo.free;
                memInfo.percentUsed = Math.ceil(((memInfo.used - memInfo.cached) / memInfo.total) * 100);

                data = {"cpu_temp": temperature, "total_memory": memInfo.total, "free_memory": memInfo.free, "cached_memory": memInfo.cached, "used_memory": memInfo.used, "percent_memory_used": memInfo.percentUsed, "timeStamp": Date.now() };
                raspi.push(data);
                console.log(data);
                });
            //console.log(raspi);
};

setInterval(PiStats, 3000);

