# Convention Master API

https://github.com/sonicer105/convention-master-api

Really simple API for Convention Master.

It's meant to be run on the same host as Convention Master and patched through via reverse proxy at the location `/lp-api/`.

This API is read-only at the moment and provides its own JWT based auth with a config defined username and password.

Was tested on Node v20.10.0 and MariaDB 10.6.12 on linux but it should work with other versions/OSs

This is an extremely early version and there is a lot of work to do.

## Features

- Password/token protected
- Get JSON list of all higher tier members in real time.

## Installing

```
npm install
cp config/default.json5 config/production.json5
nano config/production.json5
```
Follow the comments and configure the server prior to running.

## Running
```
npm start
```

## Reverse Proxy

An example of a reverse proxy for Apache
```
<VirtualHost *:443>	
    ServerName reg.example-con.com
    ...
    ProxyPass /lp-api/ http://localhost:3000/lp-api/
</VirtualHost>
```
Make sure to enable `proxy_module` and `proxy_http_module` in Apache

## Running As Service

on systemd environments, creating `cm-api.service` in `/etc/systemd/system` with the following content:
```
[Unit]
Description=Convention Master API
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=www-data
WorkingDirectory=/opt/convention-master-api
ExecStart=/usr/bin/node /opt/convention-master-api/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
adjust user, path, node location as needed.

run `systemctl enable cm-api.service` and `systemctl start cm-api.service` when ready

This version's code licensed under MIT