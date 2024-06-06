# Pi Capsule
A raspberri pi time capsule

# Deployment
Click the link below to demo! PLEASE NOTE: THIS IS PUBLIC! DO NOT UPLOAD ANY SENSITIVE FILES, AS THEY WILL
BE VISIBLE TO ANYONE WITH THE LINK!. Also, the server is missing some of the features of the full project,
such as the auto-camera capture and the ability to shutdown the device, for obvious reasons.

http://milesberm.pythonanywhere.com/

# Postmortem
What went well: This was my first time really using a Raspberry Pi in this way, and while there were definitely hiccups, I surprised myself with how much I was able to figure out on my own. I was able to get the Pi up and running, ssh into it, and easily work on the project through GitHub. This was also my first time ever working with flask. I'm pretty experienced with web-dev, but had never done server sites quite like this. While a little tricky to understand initially, I was able to learn it pretty fast and get it working exactly how I had hoped. All in all, I am really happy with the way I have the Pi set up, the way the web interface looks and works, and the functionality of the time capsule related code itself (like storing and organizing files).

What didn't work out: The physical additions to the Pi caused me a lot of problems. I didn't realize that the solderless GPIO pins needed a special tool to be installed, so I had to literally use a piece of plastic and a hammer to install it myself. I may have bent a pin or two, as the RTC module wasn't being recognized at all. I was eventually able to get it working by using the "wrong" pins, but it was definitely not ideal. Similarly, I had multiple cameras not work with the Pi, but gladly eventually found one after many tries. I also initially planned for the device to be weatherproof, and much less interactive (more like a real time capsule), but had to scrap this, as it was out of scope, prevented cool features, and made the project a lot less interesting to me.

What would I do differently: The Pi Zero is quite a slow board, and made the dev process much more tedious. I should have invested a little bit more money in something like a Pi 4 or 5, or even just a Pi 3, which are much faster and have full size USB and ethernet ports. I also should have bought the actual hammer tool to install the GPIO pins, instead of making it myself. Lastly, I should have scrapped using a special Pi camera, and just used a USB webcam so I could take higher quality pictures, and even use its mic for audio.

# Artistic Statement
I made this project to challenge myself to work outside of a strictly software environment. Working on a physical device was really cool, and I'm very glad I did it. I learned a ton about things like GPIO/soldering, ssh, and overall just small boards like the Raspberry Pi in general. Also, my favorite topics from this course were using external inputs (mic/camera), data visualization, and physical installments. I felt this was a good combination of the topics, and pushed me to work outside of what I usually do. 

# Credits
Hardware used:
Raspberry Pi Zero 2 W - https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/
PiSugar S - https://www.pisugar.com/
Arducam - https://www.arducam.com/
Dorhea DS3231 RTC - https://www.amazon.com/Dorhea-DS3231-Module-Memory-Raspberry/dp/B08X4H3NBR?th=1

Font:
NASA21 - https://www.dafont.com/nasa21.font

Software:
Python for time capsule logic and flask server
HTML, CSS, and JavaScript for web interface