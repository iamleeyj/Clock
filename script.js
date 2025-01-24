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


const steps = [
    {
        element: '#time-display',
        message: '이곳에서 현재 시간을 확인할 수 있습니다!',
        position: 'top',
    },
    {
        element: '#add-alarm',
        message: '여기에서 알람을 추가할 수 있어요. 시, 분, 초를 설정한 후 클릭하세요!',
        position: 'top',
    },
    {
        element: '#charge-battery',
        message: '배터리가 부족할 때 이 버튼으로 충전할 수 있습니다!',
        position: 'top',
    },
    {
        element: '#toggle-theme',
        message: '🌙 버튼으로 라이트모드와 다크모드를 전환할 수 있습니다.',
        position: 'top',
    },
];

let currentStep = 0;

function showStep(stepIndex) {
    const step = steps[stepIndex];
    const element = document.querySelector(step.element);
    const overlay = document.createElement('div');
    const tutorialBox = document.createElement('div');
    const rect = element.getBoundingClientRect();

    overlay.className = 'tutorial-overlay';
    tutorialBox.className = 'tutorial-box';
    tutorialBox.innerHTML = `
        <p>${step.message}</p>
        <button id="next-step">다음</button>
        <button id="skip-tutorial">건너뛰기</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(tutorialBox);

    element.classList.add('tutorial-highlight');

    tutorialBox.style.top = `${rect.top + window.scrollY - tutorialBox.offsetHeight - 10}px`;
    tutorialBox.style.left = `${rect.left + rect.width / 2 - tutorialBox.offsetWidth / 2}px`;

    document.getElementById('next-step').onclick = () => {
        cleanupStep();
        currentStep++;
        if (currentStep < steps.length) {
            showStep(currentStep);
        } else {
            endTutorial();
        }
    };

    document.getElementById('skip-tutorial').onclick = () => {
        cleanupStep();
        endTutorial();
    };

    function cleanupStep() {
        element.classList.remove('tutorial-highlight');
        overlay.remove();
        tutorialBox.remove();
    }
}

function endTutorial() {
    sessionStorage.setItem('seeTutorial', 'true');
}

// 튜토리얼
window.onload = () => {
    if (!sessionStorage.getItem('seeTutorial')) {
        showStep(currentStep);
    }
};