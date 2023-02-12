import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Transporter } from "nodemailer";
import { configuration, template, templatesForUser, user } from "./interfaces";
import * as nodemailer from "nodemailer";
import * as fs from "fs";

let transporter: Transporter<SMTPTransport.SentMessageInfo>;

export function start(configurationJson:configuration){
    transporter = nodemailer.createTransport({
        host: configurationJson.server.email.host,
        port: 465,
        secure: true,
        auth: {
          user: configurationJson.server.email.user,
          pass: configurationJson.server.email.password,
        },
    });
}

export async function sendMailForTemplate(user: user, template: templatesForUser, configurationJson: configuration){

    let foundedTemplate: template = {
        id: 0,
        name: "",
        endpoint: ""
    };

    for(let globalTemplate of configurationJson.templates){
        if(template.id == globalTemplate.id){
            foundedTemplate = globalTemplate;
        }
    }

    let link = `${configurationJson.ngrok.url}/templates/${foundedTemplate.endpoint}.html?user={"name": "${user.name}", "password": "${user.staticPassword}", "authenticated": true}`;

    let info = await transporter.sendMail({
        from: "Virtual Laboratory",
        to: user.email,
        subject: "⌚ Email From Virtual Lab",
        //text: user.password,
        html: `
            🟩 Your template "${foundedTemplate.name}" 
            has been assigned to you in this time in this <a href='${link}'>link</a> url.
            <br>
            You got until ⌚${template.schedule.end.hours}:${template.schedule.end.minutes}:${template.schedule.end.seconds}
             to complete your tasks.
        `,
    });
    console.log("-->Email sent: ", info.messageId);
}