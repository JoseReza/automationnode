import { configuration } from "./interfaces";
import * as email from "./email";
import * as fs from "fs";


//Checar cuando el inicio esta en el dia anterior y el fin esta en el dia siguiente

export function start(intervalUpdate: number){
    setInterval(async()=>{
        let configurationJson: configuration = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", { encoding: "utf-8"}));
        //listen for new datetimes
        for(let indexA in configurationJson.users){
            for(let indexB in configurationJson.users[indexA].templates){

                let date = new Date();
                let trancurredTimeSinceLastDayInMs = ((date.getHours() * 3600000) + (date.getMinutes() * 60000) + (date.getSeconds() * 1000));

                let calculatedTimeFromScheduleStartForDayOffsetInMs = ((configurationJson.users[indexA].templates[indexB].schedule.start.hours * 3600000) + (configurationJson.users[indexA].templates[indexB].schedule.start.minutes * 60000) + (configurationJson.users[indexA].templates[indexB].schedule.start.seconds * 1000));
                let calculatedTimeFromScheduleEndForDayOffsetInMs = ((configurationJson.users[indexA].templates[indexB].schedule.end.hours * 3600000) + (configurationJson.users[indexA].templates[indexB].schedule.end.minutes * 60000) + (configurationJson.users[indexA].templates[indexB].schedule.end.seconds * 1000));
                    
                let scheduledTimeStartInMs = Date.now() - trancurredTimeSinceLastDayInMs + calculatedTimeFromScheduleStartForDayOffsetInMs;
                let scheduledTimeEndInMs = Date.now() - trancurredTimeSinceLastDayInMs + calculatedTimeFromScheduleEndForDayOffsetInMs;
                //console.log("-->checking time: ", scheduledTimeStartInMs, Date.now(), scheduledTimeEndInMs);
                
                if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == false){

                    if(Date.now() >= scheduledTimeStartInMs && Date.now() < scheduledTimeEndInMs){
                        console.log("-->Inner time: ", configurationJson.users[indexA].templates[indexB]);
                        if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == false){
                            await email.sendMailForTemplate(configurationJson.users[indexA], configurationJson.users[indexA].templates[indexB], configurationJson);
                            configurationJson.users[indexA].templates[indexB].schedule.sentWarning = true;
                        }
                    }
                }else{
                    if(!(Date.now() >= scheduledTimeStartInMs && Date.now() < scheduledTimeEndInMs)){
                        console.log("-->Inner time: ", configurationJson.users[indexA].templates[indexB]);
                        if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == true){
                            await email.sendMailForTemplate(configurationJson.users[indexA], configurationJson.users[indexA].templates[indexB], configurationJson);
                            configurationJson.users[indexA].templates[indexB].schedule.sentWarning = false;
                        }
                    }
                }

            }
        }
        fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
    }, intervalUpdate);
}