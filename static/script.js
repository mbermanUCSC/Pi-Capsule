var buttons = {
    capsule: document.getElementById('menu-capsule'),
    entry: document.getElementById('menu-entry'),
    schedule: document.getElementById('menu-schedule'),
    settings: document.getElementById('menu-settings'),

    saveentry: document.getElementById('saveentry-button'),
    deleteentry: document.getElementById('deleteentry-button'),
};

var sections = {
    capsule: document.getElementById('capsule'),
    entry: document.getElementById('entry'),
};

var data_canvas = document.getElementById('data-canvas');
var note_text = document.getElementById('note-text');
var note_title = document.getElementById('note-title');

document.addEventListener('DOMContentLoaded', function() {

    // set all but capsule to display none
    sections.entry.style.display = 'none';

    // turn off delete button until user starts typing
    buttons.deleteentry.disabled = true;

    // scroll to top when page is loaded
    window.scrollTo(0, 0);

    var id = document.getElementById('id-field');
    var finalId = parseInt(id.innerHTML);

    var hasScrolled = false;

    // listen for scroll events
    window.addEventListener('scroll', function() {
        if (hasScrolled) return;
        document.querySelector('.capsule').style.left = '0';  // Reset left to bring into view
        document.querySelector('.menu').style.color = '#b8b8b8';
        buttons.capsule.style.color = '#000000';

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
            // scroll to top of capsule section
            slowScrollTo(sections.capsule.offsetHeight, 2000);
            document.querySelector('.capsule').style.left = '0';  // Reset left to bring into view
            document.querySelector('.menu').style.color = 'b8b8b8';
            buttons.capsule.style.color = '#000000';
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

    // // fill the canvas with some random circles
    // var ctx = data_canvas.getContext('2d');
    // var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    // for (var i = 0; i < 100; i++) {
    //     var x = Math.random() * data_canvas.width;
    //     var y = Math.random() * data_canvas.height;
    //     var radius = Math.random() * 50;
    //     var color = colors[Math.floor(Math.random() * colors.length)];

    //     ctx.beginPath();
    //     ctx.arc(x, y, radius, 0, 2 * Math.PI);
    //     ctx.fillStyle = color;
    //     ctx.fill();
    // }

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
        alert("Shutting down...");
    })
    .catch(error => console.error('Error:', error));
    
});

document.getElementById('reboot-button').addEventListener('click', function() {
    
        fetch('/reboot', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            alert("Rebooting...");
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


// listeners for menu buttons
buttons.capsule.addEventListener('click', function() {
    document.querySelector('.capsule').style.left = '0';
    document.querySelector('.menu').style.color = '#b8b8b8';
    buttons.capsule.style.color = '#000000';
    sections.capsule.style.display = 'grid';
    sections.entry.style.display = 'none';
});

buttons.entry.addEventListener('click', function() {
    document.querySelector('.capsule').style.left = '-100%';
    document.querySelector('.menu').style.color = '#b8b8b8';
    buttons.entry.style.color = '#000000';
    sections.capsule.style.display = 'none';
    sections.entry.style.display = 'grid';
});


// listeners for entry buttons
// # print the note
// @app.route('/entry', methods=['POST'])
// def entry():
//     entry = request.json['entry']
//     id = request.json['id']
//     print(entry, id)
//     return jsonify(success=True, message="Entry saved.")

buttons.saveentry.addEventListener('click', function() {
    // get entry text

    fetch('/note-entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entry: note_text.value, title: note_title.value})
    })
    .then(response => response.json())
    .then(data => {
        alert("Entry saved.");
        note_text.value = '';
        note_title.value = '';
        buttons.deleteentry.disabled = true;
    })
    .catch(error => console.error('Error:', error));
});


// when the user starts typing in the note field, enable the delete button
note_text.addEventListener('input', function() {
    buttons.deleteentry.disabled = false;
    buttons.deleteentry.style.cursor = 'pointer';
    // if empty, disable the delete button
    if (note_text.value === '') {
        buttons.deleteentry.disabled = true;
    } 
});



// clear the note field and disable the delete button
buttons.deleteentry.addEventListener('click', function() {
    note_text.value = '';
    buttons.deleteentry.disabled = true;
});