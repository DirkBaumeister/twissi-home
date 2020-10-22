# Home Automation Display "twissi-home"

## Requirements

- A raspberry pi (Version 4 works best)
- A touch display (I'm using this one: https://www.amazon.de/gp/product/B07YZ3ZVTW)
- Raspberry PI OS installed
- A webserver running on the pi (or any other webserver who can handle this symfony application)

## Installation

### The docker way

- Clone the project
- cd to the docker sub directory
- run ```./build.sh [docker build tag here]```
- Now you can run it via the command: ```docker run --restart always -d --name twissi-home -p [port]:80 [environment variables, see below] [docker build tag here]```
- You are done!

### The manual way

- Install yarn on your machine (https://classic.yarnpkg.com/en/docs/install/)
- Clone the project to a webroot
- Run ```composer install --no-dev```
- Run ```yarn install```
- Run ```yarn encore prod```
- Check if all file permissions are correct (especially the var folder should be read- and writable by the webserver user)
- Fill in a .env.local file in the root of your application with the environment variables below

## Setting up the pi

- Installing a chromium kiosk (German tutorial: https://itrig.de/index.php?/archives/2309-Raspberry-Pi-3-Kiosk-Chromium-Autostart-im-Vollbildmodus-einrichten.html)
- Point it to the app
- Probably harden the system by making it read only to prevent corruption on power loss (German tutorial: https://kofler.info/raspbian-lite-fuer-den-read-only-betrieb/)
- Connect the touch display
- Build a fancy case
<img src="https://github.com/DirkBaumeister/twissi-home/raw/main/assets/images/frame.jpg" width="400" alt="An idea for a frame" title="An idea for a frame">
- Enjoy!

## Environment Variables
|Variable Name           |                            Value|Optional|
|------------------------|---------------------------------|--------|
|APP_ENV                 |The environment to operate in (Either ```dev``` or ```prod```)|no|
|APP_LOCALE              |The locale of the app (Currently supported: ```en```, ```de```)|no|
|MQTT_HOST               |The ip address of the mqtt broker|(only if automation mode is ```home-assistant```)      |
|MQTT_PORT               |The port of the mqtt broker      |(only if automation mode is ```home-assistant```)      |
|MQTT_CLIENT_ID          |The client id for mqtt           |(only if automation mode is ```home-assistant```)      |
|MQTT_COMMAND_TOPIC      |The command topic for the light control (Example: ```ha/light/%s/cmd``` where %s represents the id of the entity)|(only if automation mode is ```home-assistant```)      |
|HOME_ASSISTANT_API_URL  |The url to the home assistant instance (in format http(s)://xxxxx:8123)|(only if automation mode is ```mqtt```)|
|HOME_ASSISTANT_API_KEY  |The long live access token for the home assistant api|(only if automation mode is ```mqtt```)|
|CALENDAR_CALDAV_URL     |The url to a caldav server       |no      |
|CALENDAR_CALDAV_USERNAME|The caldav username              |no      |
|CALENDAR_CALDAV_PASSWORD|The caldav password              |no      |
|AUTOMATION_MODE         |The mode to use for automation (Either ```mqtt``` or ```home-assistant```)   |no      |
|AUTOMATION_ENTITIES     |A json array in the following structure: ```[{"id":"test1","friendly_name":"Lamp 1"},{"id":"test2","friendly_name":"Lamp 2"}]```|no|
|WEATHER_CITY            |The city name for the weather    |no      |
|WEATHER_OPENWEATHERMAP_API_KEY|Api key for openweathermap |no      |
|SURVEILLANCE_IP         |The ip address of the IP Cam     |no      |
|SURVEILLANCE_USERNAME   |The username for the IP Cam      |no      |
|SURVEILLANCE_PASSWORD   |The password for the IP Cam      |no      |
|SCREENSAVER_PHOTO_DIR   |Directory of the images for the screensaver (default: ```[project_root]/public/photos```). Photos need to be named like ```screensaver1.jpg, screensaver2.jpg, screensaver3.jpg...```|yes|
|SCREENSAVER_PHOTO_DURATION|Duration for each photo on the screensaver (default: 30 sec.)|yes|
|SCREENSAVER_TIMEOUT     |Timeout when the screensaver is triggered (default: 120 sec.)|yes|
|SCREENSAVER_TO_DAY_MODE_HOUR|Hour (0-24) when the screensaver will change to day mode (Showing photo slideshow)|yes|
|SCREENSAVER_TO_NIGHT_MODE_HOUR|Hour (0-24) when the screensaver will change to night mode (Only greyscale clock)|yes|

## Current limitations

- At the moment this a very early alpha build
- It currently only supports a very specific IP Cam (This one: https://www.amazon.de/gp/product/B07T3JXMDM)
