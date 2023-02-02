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
}

export interface user {
  id: number;
  name: string;
  email: string;
  password: string;
  templates: templatesForUser[];
}

export interface configuration {
  server: server;
  ngrok: ngrok;
  devices: device[];
  templates: template[];
  users: user[];
}

