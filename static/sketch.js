let capsuleData;
let canvasWidth = 800; // Define the width of the canvas
let canvasHeight = 600; // Define the height of the canvas

function preload() {
    let url = '/get-capsule-data';  // Ensure this URL matches the Flask route
    capsuleData = loadJSON(url);
}

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');  // Positioning the canvas in the specified div
    textSize(12);
    textAlign(CENTER, CENTER);
}

function draw() {
    background(245);
    if (capsuleData) {
        drawCapsule();
    }
}

function drawCapsule() {
    let centerX = width / 2;
    let centerY = height / 2;
    let yearRadius = 100;
    let monthRadius = 40;
    let fileRadius = 20;

    Object.keys(capsuleData).forEach((year, i) => {
        // Draw the year in the center
        ellipseAndText(centerX, centerY, yearRadius, year, 'magenta');

        let months = Object.keys(capsuleData[year]);
        let angleStep = TWO_PI / months.length;

        months.forEach((month, j) => {
            let angle = angleStep * j;
            let xMonth = centerX + 150 * cos(angle);
            let yMonth = centerY + 150 * sin(angle);
            ellipseAndText(xMonth, yMonth, monthRadius, month, 'turquoise');

            // Draw line from year to month
            stroke(0);
            line(centerX, centerY, xMonth, yMonth);

            // If the month is hovered, display files
            if (dist(mouseX, mouseY, xMonth, yMonth) < monthRadius) {
                let files = Object.keys(capsuleData[year][month]);
                let fileAngleStep = TWO_PI / files.length;
                files.forEach((fileKey, k) => {
                    let fileAngle = fileAngleStep * k;
                    let xFile = xMonth + 100 * cos(fileAngle);
                    let yFile = yMonth + 100 * sin(fileAngle);
                    ellipseAndText(xFile, yFile, fileRadius, capsuleData[year][month][fileKey], 'red', true);

                    // Draw line from month to file
                    line(xMonth, yMonth, xFile, yFile);
                });
            }
        });
    });
}

function ellipseAndText(x, y, radius, textContent, fillColor, showDetailsOnHover = false) {
    let hovering = dist(mouseX, mouseY, x, y) < radius;
    fill(hovering ? 'rgba(255, 255, 0, 0.25)' : fillColor);
    ellipse(x, y, radius * 2, radius * 2);
    fill(0);

    // Show detailed text below the circle on hover if specified
    if (showDetailsOnHover && hovering) {
        push();
        fill(0);
        stroke(255);
        textSize(10);
        text(textContent, x, y + 20);  // Show full details below the circle
        pop();
    } else if (!showDetailsOnHover || !hovering) {
        text(textContent.split(' - ')[0], x, y);  // Show only the main identifier
    }
}
