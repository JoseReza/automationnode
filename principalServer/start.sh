cd /home/pi/Desktop/labVirtual/principalServer
sudo /usr/bin/lxterminal --command="npm run start" &
sleep 20
chromium-browser http://localhost:3000 &

#run on starttup
#sudo nano /etc/xdg/autostart/myapp.desktop

#add
#[Desktop Entry]
#Exec=/home/pi/Desktop/labVirtual/principalServer/start.sh

#sudo chmod +777 /etc/xdg/autostart/myapp.desktop