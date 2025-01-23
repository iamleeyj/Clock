let batteryLevel = 100;
const batteryElement = document.getElementById('battery-level');
const batteryIcon = document.getElementById('battery-icon');
const timeDisplay = document.getElementById('time-display');
const alarmList = document.getElementById('alarm-list');
const addAlarmButton = document.getElementById('add-alarm');

let alarms = [];

setInterval(() => {
    const now = new Date();
    const formattedTime = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
    timeDisplay.textContent = formattedTime;

    if (batteryLevel > 0) {
        batteryLevel--;
        batteryElement.textContent = `${batteryLevel}%`;
        if (batteryLevel <= 20) {
            batteryElement.classList.add('low');
            batteryIcon.classList.add('low');
        } else {
            batteryElement.classList.remove('low');
            batteryIcon.classList.remove('low');
        }
    }

    if (batteryLevel === 0) {
        timeDisplay.style.backgroundColor = '#000';
        timeDisplay.style.color = '#000';
    }

    alarms.forEach(alarm => {
        if (
            alarm.hour === now.getHours() &&
            alarm.minute === now.getMinutes() &&
            alarm.second === now.getSeconds()
        ) {
            alert(`알람! 시간: ${formattedTime}`);
        }
    });
}, 1000);

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
            alert('알람은 최대 3개까지 설정할 수 있습니다.');
        }
    } else {
        alert('유효한 시간 값을 입력해주세요.');
    }
});

function updateAlarmList() {
    alarmList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const li = document.createElement('li');
        li.textContent = `${alarm.hour.toString().padStart(2, '0')}:` +
                         `${alarm.minute.toString().padStart(2, '0')}:` +
                         `${alarm.second.toString().padStart(2, '0')}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', () => {
            alarms.splice(index, 1);
            updateAlarmList();
        });
        li.appendChild(deleteButton);
        alarmList.appendChild(li);
    });
}

const chargeButton = document.getElementById('charge-battery');

chargeButton.addEventListener('click', () => {
    if (batteryLevel === 0) {
        batteryLevel = 100;
        batteryElement.textContent = `${batteryLevel}%`;
        batteryIcon.classList.remove('low');
        timeDisplay.style.backgroundColor = '#333';
        timeDisplay.style.color = '#fff';
    } else {
        alert('완전히 방전되어야 사용할 수 있습니다.');
    }
});

const toggleThemeButton = document.getElementById('toggle-theme');

toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.clock-container').classList.toggle('dark-mode');
    document.getElementById('battery-level').classList.toggle('dark-mode');
    document.getElementById('time-display').classList.toggle('dark-mode');
    toggleThemeButton.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// 페이지 로드 시 알림창을 최초 1번만 표시하고, 새로고침 시 초기화
window.onload = function() {
    // 세션 저장소에 'hasSeenManual' 키가 없으면 최초 방문으로 간주
    if (!sessionStorage.getItem('hasSeenManual')) {
        // 알림창을 표시
        document.getElementById('welcome-modal').style.display = 'flex';

        // 사용자가 알림창을 닫을 때 세션 저장소에 정보를 저
        document.getElementById('close-modal').onclick = function() {
            sessionStorage.setItem('hasSeenManual', 'true');
            document.getElementById('welcome-modal').style.display = 'none';
        };
    }
};
