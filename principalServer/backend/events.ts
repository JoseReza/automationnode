import { configuration } from "./interfaces";
import * as email from "./email";
import * as fs from "fs";

export function start(intervalUpdate: number){
    setInterval(async()=>{
        let configurationJson: configuration = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", { encoding: "utf-8"}));
        //listen for new datetimes
        for(let indexA in configurationJson.users){
            for(let indexB in configurationJson.users[indexA].templates){
                if(configurationJson.users[indexA].templates[indexB].enabledNotification){
                    if(configurationJson.users[indexA].templates[indexB].schedule.start.hours <= configurationJson.users[indexA].templates[indexB].schedule.end.hours){ //End.hours and Start.hours in the same day:
                        //console.log("--> End.hours and Start.hours in the same day:", configurationJson.users[indexA].templates[indexB]);
                        let date = new Date();
                        let trancurredTimeSinceLastDayInMs = ((date.getHours() * 3600000) + (date.getMinutes() * 60000) + (date.getSeconds() * 1000));

                        let calculatedTimeFromScheduleStartForDayOffsetInMs = ((configurationJson.users[indexA].templates[indexB].schedule.start.hours * 3600000) + (configurationJson.users[indexA].templates[indexB].schedule.start.minutes * 60000) + (configurationJson.users[indexA].templates[indexB].schedule.start.seconds * 1000));
                        let calculatedTimeFromScheduleEndForDayOffsetInMs = ((configurationJson.users[indexA].templates[indexB].schedule.end.hours * 3600000) + (configurationJson.users[indexA].templates[indexB].schedule.end.minutes * 60000) + (configurationJson.users[indexA].templates[indexB].schedule.end.seconds * 1000));
                            
                        let scheduledTimeStartInMs = Date.now() - trancurredTimeSinceLastDayInMs + calculatedTimeFromScheduleStartForDayOffsetInMs;
                        let scheduledTimeEndInMs = Date.now() - trancurredTimeSinceLastDayInMs + calculatedTimeFromScheduleEndForDayOffsetInMs;
                        //console.log("-->checking time: ", scheduledTimeStartInMs, Date.now(), scheduledTimeEndInMs);
                        
                        if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == false){
                            if(Date.now() >= scheduledTimeStartInMs && Date.now() < scheduledTimeEndInMs){
                                if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == false){
                                    await email.sendMailForTemplate(configurationJson.users[indexA], configurationJson.users[indexA].templates[indexB], configurationJson);
                                    configurationJson.users[indexA].templates[indexB].schedule.sentWarning = true;
                                }
                            }
                        }else{
                            if(!(Date.now() >= scheduledTimeStartInMs && Date.now() < scheduledTimeEndInMs)){
                                if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == true){
                                    await email.sendMailForTemplate(configurationJson.users[indexA], configurationJson.users[indexA].templates[indexB], configurationJson);
                                    configurationJson.users[indexA].templates[indexB].schedule.sentWarning = false;
                                }
                            }
                        }
                    }else if (configurationJson.users[indexA].templates[indexB].schedule.start.hours > configurationJson.users[indexA].templates[indexB].schedule.end.hours){ // end.hours at day before and start.hours at day after
                        //console.log("--> End.hours at day before and Start.hours at day after:", configurationJson.users[indexA].templates[indexB]);
                        let date = new Date();
                        let trancurredTimeSinceLastDayInMs = ((date.getHours() * 3600000) + (date.getMinutes() * 60000) + (date.getSeconds() * 1000));

                        let dayToMs = 86400000; // day in milliseconds equivalent
                        let calculatedTimeFromScheduleStartForDayOffsetInMs = ((configurationJson.users[indexA].templates[indexB].schedule.start.hours * 3600000) + (configurationJson.users[indexA].templates[indexB].schedule.start.minutes * 60000) + (configurationJson.users[indexA].templates[indexB].schedule.start.seconds * 1000));
                        let calculatedTimeFromScheduleEndForDayOffsetInMs = dayToMs + ((configurationJson.users[indexA].templates[indexB].schedule.end.hours * 3600000) + (configurationJson.users[indexA].templates[indexB].schedule.end.minutes * 60000) + (configurationJson.users[indexA].templates[indexB].schedule.end.seconds * 1000));
                            
                        let scheduledTimeStartInMs = Date.now() - trancurredTimeSinceLastDayInMs + calculatedTimeFromScheduleStartForDayOffsetInMs;
                        let scheduledTimeEndInMs = Date.now() - trancurredTimeSinceLastDayInMs + calculatedTimeFromScheduleEndForDayOffsetInMs;
                        //console.log("-->checking time: ", scheduledTimeStartInMs, Date.now(), scheduledTimeEndInMs);
                        
                        if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == false){
                            if(Date.now() >= scheduledTimeStartInMs && Date.now() < scheduledTimeEndInMs){
                                if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == false){
                                    await email.sendMailForTemplate(configurationJson.users[indexA], configurationJson.users[indexA].templates[indexB], configurationJson);
                                    configurationJson.users[indexA].templates[indexB].schedule.sentWarning = true;
                                }
                            }
                        }else{
                            if(!(Date.now() >= scheduledTimeStartInMs && Date.now() < scheduledTimeEndInMs)){
                                if(configurationJson.users[indexA].templates[indexB].schedule.sentWarning == true){
                                    await email.sendMailForTemplate(configurationJson.users[indexA], configurationJson.users[indexA].templates[indexB], configurationJson);
                                    configurationJson.users[indexA].templates[indexB].schedule.sentWarning = false;
                                }
                            }
                        }
                    }
                }
            }
        }
        fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
    }, intervalUpdate);
}