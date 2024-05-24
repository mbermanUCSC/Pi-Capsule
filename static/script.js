document.addEventListener('DOMContentLoaded', function() {

    var capsule_btn = document.getElementById('menu-capsule');
    var notes_btn = document.getElementById('menu-notes');
    var schedule_btn = document.getElementById('menu-schedule');
    var settings_btn = document.getElementById('menu-settings');




    // scroll to top when page is loaded
    window.scrollTo(0, 0);

    var id = document.getElementById('id-field');
    var finalId = parseInt(id.innerHTML);

    var hasScrolled = false;

    // listen for scroll events
    window.addEventListener('scroll', function() {
        if (hasScrolled) return;
        document.querySelector('.toolbar').style.left = '0';  // Reset left to bring into view
        document.querySelector('.menu').style.color = '#b8b8b8';
        capsule_btn.style.color = '#000000';

        hasScrolled = true;
    });

    // number jumble effect
    var interval = setInterval(function() {
        id.innerHTML = Math.floor(Math.random() * 100000);  // limit to 5 digits
    }, 100);  // change every 100ms

    setTimeout(function() {
        clearInterval(interval);
        id.innerHTML = finalId; 
        
        if (!hasScrolled) {
            slowScrollTo(document.body.scrollHeight, 3500);  // Scroll over 1500 milliseconds
            document.querySelector('.toolbar').style.left = '0';  // Reset left to bring into view
            document.querySelector('.menu').style.color = 'b8b8b8';
            capsule_btn.style.color = '#000000';
        }
        
    }, 2000);  // total time 2s


    // fetch current time and date
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');

    function updateTime() {
        fetch('/time')
            .then(response => response.json())
            .then(data => {
                timeElement.textContent = data.current_time;
            })
            .catch(error => console.error('Error fetching time:', error));
        fetch('/date')
            .then(response => response.json())
            .then(data => {
                dateElement.textContent = data.current_date;
            })
            .catch(error => console.error('Error fetching date:', error));
    }

    setInterval(updateTime, 1000); // Update every second
    updateTime(); // Also update immediately on page load
});


// custom scroll function
function slowScrollTo(targetHeight, duration) {
    var startPosition = window.pageYOffset;
    var distance = targetHeight - startPosition;
    var startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var timeElapsed = currentTime - startTime;
        var next = easeInOutQuad(timeElapsed, startPosition, distance, duration);

        window.scrollTo(0, next);
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }

    requestAnimationFrame(animation);
}


document.getElementById('power-button').addEventListener('click', function() {

    fetch('/power-off', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        // console.log(data);
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('reboot-button').addEventListener('click', function() {
    
        fetch('/reboot', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
        })
        .catch(error => console.error('Error:', error));
    });


// listeners for menu text to act as buttons
// first get them all because we need to reference colors for each
var menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(function(item) {
    item.addEventListener('click', function() {
        menuItems.forEach(function(item) {
            item.style.color = '#b8b8b8';
        });
        item.style.color = '#000000';
    });
});

