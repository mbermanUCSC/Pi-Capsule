document.addEventListener('DOMContentLoaded', function() {
    const uiElements = {
        buttons: {
            capsule: document.getElementById('menu-capsule'),
            entry: document.getElementById('menu-entry'),
            unlock: document.getElementById('menu-unlock'),
            saveEntry: document.getElementById('saveentry-button'),
            deleteEntry: document.getElementById('deleteentry-button'),
            power: document.getElementById('power-button'),
            reboot: document.getElementById('reboot-button'),
            submitFile: document.getElementById('submit-file'),
            unlockFiles: document.getElementById('unlock-button'),
            downloadFiles: document.getElementById('download-button')
        },
        sections: {
            capsule: document.getElementById('capsule'),
            entry: document.getElementById('entry'),
            canvasContainer: document.getElementById('canvas-container'),
            unlock: document.getElementById('unlock')
        },
        dataCanvas: document.getElementById('data-canvas'),
        noteText: document.getElementById('note-text'),
        noteTitle: document.getElementById('note-title'),
        timeElement: document.getElementById('current-time'),
        dateElement: document.getElementById('current-date'),
        idField: document.getElementById('id-field'),
        menuItems: document.querySelectorAll('.menu-item'),
        fileUpload: document.getElementById('file-upload-input'),
        unlockInput: document.getElementById('unlock-input')
    };

    // Initial setup
    initializeUI();

    // Event listeners
    setupEventListeners();

    function initializeUI() {
        // check if the capsule is locked
        fetch('/lock-status')  // Ensure the endpoint matches your Flask route
            .then(response => response.json())
            .then(data => {
                if (data.locked) {
                    console.log("Capsule is locked.");
                }
                else {
                    console.log("Capsule is unlocked.");
                    uiElements.buttons.unlockFiles.disabled = true;
                    uiElements.buttons.unlockFiles.style.cursor = 'default';
                    uiElements.buttons.downloadFiles.style.display = 'block';
                    uiElements.unlockInput.disabled = true;
                    uiElements.unlockInput.value = data.capsule_id;
                    // hide the entry menu button
                    uiElements.menuItems[1].style.display = 'none';
                }
            })
            .catch(error => console.error('Error:', error));

        uiElements.sections.entry.style.display = 'none';
        uiElements.sections.unlock.style.display = 'none';
        uiElements.buttons.deleteEntry.disabled = true;
        uiElements.buttons.deleteEntry.style.cursor = 'default';
        uiElements.sections.canvasContainer.style.visibility = 'hidden';
        uiElements.sections.canvasContainer.style.opacity = '0';
        
        window.scrollTo(0, 0);
    }

    function setupEventListeners() {
        window.addEventListener('scroll', handleScroll);
        setInterval(updateTime, 1000);
        updateTime();

        uiElements.buttons.power.addEventListener('click', () => postAction('/power-off', "Shutting down..."));
        uiElements.buttons.reboot.addEventListener('click', () => postAction('/reboot', "Rebooting..."));

        uiElements.menuItems.forEach(item => {
            item.addEventListener('click', function() {
                uiElements.menuItems.forEach(menuItem => menuItem.style.color = '#b8b8b8');
                item.style.color = '#000000';
            });
        });

        setupNavigationListeners();
        setupEntryListeners();
        setupUnlockListeners();
    }

    function handleScroll() {
        const hasScrolled = false;
        if (!hasScrolled) {
            document.querySelector('.capsule').style.left = '0';
            uiElements.sections.canvasContainer.style.visibility = 'visible';
            uiElements.sections.canvasContainer.style.opacity = '1';
            document.querySelector('.menu').style.color = '#b8b8b8';
            uiElements.buttons.capsule.style.color = '#000000';
        }
    }

    function updateTime() {
        fetch('/time').then(response => response.json()).then(data => {
            uiElements.timeElement.textContent = data.current_time;
        }).catch(error => console.error('Error fetching time:', error));
        fetch('/date').then(response => response.json()).then(data => {
            uiElements.dateElement.textContent = data.current_date;
        }).catch(error => console.error('Error fetching date:', error));
    }

    function setupNavigationListeners() {
        uiElements.buttons.capsule.addEventListener('click', () => switchSection('capsule'));
        uiElements.buttons.entry.addEventListener('click', () => switchSection('entry'));
        uiElements.buttons.unlock.addEventListener('click', () => switchSection('unlock'));
    }

    function switchSection(section) {
        ['capsule', 'entry', 'unlock'].forEach(sec => {
            uiElements.sections[sec].style.display = sec === section ? 'grid' : 'none';
        });
        document.querySelector('.capsule').style.left = section === 'entry' ? '-100%' : '0';
        // show canvas only when capsule is selected
        uiElements.sections.canvasContainer.style.display = section === 'capsule' ? 'flex' : 'none';
    }

    function setupEntryListeners() {
        uiElements.buttons.submitFile.addEventListener('click', submitFile);

        uiElements.buttons.saveEntry.addEventListener('click', saveEntry);
        uiElements.noteText.addEventListener('input', handleNoteInput);
        uiElements.buttons.deleteEntry.addEventListener('click', clearEntry);
    }

    function setupUnlockListeners() {
        uiElements.buttons.unlockFiles.addEventListener('click', unlockFiles);
        uiElements.buttons.downloadFiles.addEventListener('click', downloadFiles);
    }

    function submitFile() {
        const formData = new FormData();
        const file = document.querySelector('input[type="file"]').files[0];
        formData.append('file', file);

        fetch('/file-upload', {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(data => {
            alert('File uploaded.');
        }).catch(error => console.error('Error:', error));

        uiElements.fileUpload.value = '';
        
    }


    function saveEntry() {
        const entryData = { entry: uiElements.noteText.value, title: uiElements.noteTitle.value };
        postData('/note-entry', entryData, "Entry saved.");
    }

    function handleNoteInput() {
        const isEmpty = uiElements.noteText.value === '';
        uiElements.buttons.deleteEntry.disabled = isEmpty;
        uiElements.buttons.deleteEntry.style.cursor = isEmpty ? 'default' : 'pointer';
    }

    function clearEntry() {
        uiElements.noteText.value = '';
        uiElements.buttons.deleteEntry.disabled = true;
    }

    function unlockFiles() {
        const unlockData = { capsule_id: uiElements.unlockInput.value };
    
        fetch('/unlock-capsule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(unlockData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Capsule unlocked successfully.");
                alert(data.message);
                uiElements.buttons.unlockFiles.disabled = true;
                uiElements.buttons.unlockFiles.style.cursor = 'default';
                uiElements.buttons.downloadFiles.style.display = 'block';
                uiElements.unlockInput.disabled = true;
                // hide the entry menu button
                uiElements.menuItems[1].style.display = 'none';
            } else {
                console.log("Failed to lock capsule.");
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function downloadFiles() {
        fetch('/download-capsule', { method: 'POST' })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'capsule.zip';
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error:', error));
    }
        
    function postAction(url, message) {
        fetch(url, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                alert(message);
            })
            .catch(error => console.error('Error:', error));
    }

    function postData(url, data, successMessage) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => {
            alert(successMessage);
            uiElements.noteText.value = '';
            uiElements.noteTitle.value = '';
            uiElements.buttons.deleteEntry.disabled = true;
        }).catch(error => console.error('Error:', error));
    }
});
