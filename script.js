let batteryLevel = 100;
const batteryElement = document.getElementById('battery-level');
const timeDisplay = document.getElementById('time-display');
const alarmList = document.getElementById('alarm-list');
const addAlarmButton = document.getElementById('add-alarm');

let alarms = [];

// Update time and battery level every second
setInterval(() => {
    const now = new Date();
    const formattedTime = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
    timeDisplay.textContent = formattedTime;

    // Decrease battery level
    if (batteryLevel > 0) {
        batteryLevel--;
        batteryElement.textContent = `${batteryLevel}%`;
    }

    // Hide time if battery is 0%
    if (batteryLevel === 0) {
        timeDisplay.style.backgroundColor = '#000';
        timeDisplay.style.color = '#000';
    }

    // Check alarms
    alarms.forEach(alarm => {
        if (
            alarm.hour === now.getHours() &&
            alarm.minute === now.getMinutes() &&
            alarm.second === now.getSeconds()
        ) {
            alert(`Alarm! Time: ${formattedTime}`);
        }
    });
}, 1000);

// Add alarm functionality
addAlarmButton.addEventListener('click', () => {
    const hour = parseInt(document.getElementById('hour').value);
    const minute = parseInt(document.getElementById('minute').value);
    const second = parseInt(document.getElementById('second').value);

    if (
        !isNaN(hour) && hour >= 0 && hour <= 23 &&
        !isNaN(minute) && minute >= 0 && minute <= 59 &&
        !isNaN(second) && second >= 0 && second <= 59
    ) {
        if (alarms.length < 3) {
            alarms.push({ hour, minute, second });
            updateAlarmList();
        } else {
            alert('You can only set up to 3 alarms.');
        }
    } else {
        alert('Please enter valid time values.');
    }
});

// Update the displayed alarm list
function updateAlarmList() {
    alarmList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const li = document.createElement('li');
        li.textContent = `${alarm.hour.toString().padStart(2, '0')}:` +
                         `${alarm.minute.toString().padStart(2, '0')}:` +
                         `${alarm.second.toString().padStart(2, '0')}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', () => {
            alarms.splice(index, 1);
            updateAlarmList();
        });
        li.appendChild(deleteButton);
        alarmList.appendChild(li);
    });
}
