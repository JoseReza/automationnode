export interface email {
  user: string;
  password: string;
  host: string;
  port: number;
}

export interface server {
  port: number,
  update: number,
  intervalUpdate: number
  production: boolean;
  showBrowser: boolean;
  email: email;
}

export interface ngrok{
  url: string;
}

export interface device {
  id: number;
  name: string;
  type: string;
  protocol: string;
  port: number;
  direction: string;
  template: string;
}

export interface template {
  id: number;
  name: string;
  endpoint: string;
}

export interface time {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface schedule {
  start: time,
  end: time,
  sentWarning: boolean
}

export interface templatesForUser {
  id: number;
  schedule: schedule;
  enabledNotification?: boolean;
}

export interface user {
  id: number;
  name: string;
  email: string;
  staticPassword: string;
  dynamicPassword: string;
  templates: templatesForUser[];
  admin: boolean;
  authenticated: boolean;
}

export interface configuration {
  server: server;
  ngrok: ngrok;
  devices: device[];
  templates: template[];
  users: user[];
}



export interface petition {
  url: string;
  method: petitionMethods;
  body: any;
}

