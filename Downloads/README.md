# Eygle Downloads

### Prerequisits

+ [NodeJs](https://nodejs.org/en/download/package-manager/)
+ [Mongodb](https://docs.mongodb.com/manual/administration/install-community/)
+ [Nodemon](https://github.com/remy/nodemon#nodemon)

### Installation (Linux/OSX)
*Change all references to __~__ or __/home/eygle__ by your own installation path*

##### WebApp
```
cd ~
git clone https://github.com/Eygle/EygleServer.git
cd EygleServer/Downloads
npm install
```
##### Tools in crontab
```
sudo crontab -e
```
Add those lines:
```
# Extract all media info from your download dir each minutes
* * * * * /home/eygle/EygleServer/Downloads/scripts/extract-media-info.js > /home/eygle/EygleServer/Downloads/scripts/extract-media-info.log &2>1
```

### Launch
```
gulp serve:prod
```