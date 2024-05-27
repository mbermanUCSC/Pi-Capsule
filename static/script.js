document.addEventListener('DOMContentLoaded', function() {
    const uiElements = {
        buttons: {
            capsule: document.getElementById('menu-capsule'),
            entry: document.getElementById('menu-entry'),
            schedule: document.getElementById('menu-schedule'),
            settings: document.getElementById('menu-settings'),
            saveEntry: document.getElementById('saveentry-button'),
            deleteEntry: document.getElementById('deleteentry-button'),
            power: document.getElementById('power-button'),
            reboot: document.getElementById('reboot-button'),
            submitFile: document.getElementById('submit-file')
        },
        sections: {
            capsule: document.getElementById('capsule'),
            entry: document.getElementById('entry')
        },
        dataCanvas: document.getElementById('data-canvas'),
        noteText: document.getElementById('note-text'),
        noteTitle: document.getElementById('note-title'),
        timeElement: document.getElementById('current-time'),
        dateElement: document.getElementById('current-date'),
        idField: document.getElementById('id-field'),
        menuItems: document.querySelectorAll('.menu-item'),
        fileUpload: document.getElementById('file-upload')
    };

    // Initial setup
    initializeUI();

    // Event listeners
    setupEventListeners();

    function initializeUI() {
        uiElements.sections.entry.style.display = 'none';
        uiElements.buttons.deleteEntry.disabled = true;
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
    }

    function handleScroll() {
        const hasScrolled = false;
        if (!hasScrolled) {
            document.querySelector('.capsule').style.left = '0';
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
    }

    function switchSection(section) {
        ['capsule', 'entry'].forEach(sec => {
            uiElements.sections[sec].style.display = sec === section ? 'grid' : 'none';
        });
        document.querySelector('.capsule').style.left = section === 'entry' ? '-100%' : '0';
    }

    function setupEntryListeners() {
        uiElements.buttons.submitFile.addEventListener('click', submitFile);

        uiElements.buttons.saveEntry.addEventListener('click', saveEntry);
        uiElements.noteText.addEventListener('input', handleNoteInput);
        uiElements.buttons.deleteEntry.addEventListener('click', clearEntry);
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
