// I added this file because i wanted to make my planner more accurate by having hours tasks should start and end at present

export function populateTimeDropdowns() {
    const hourSelects = [document.getElementById('startHour'), document.getElementById('endHour')];
    const minuteSelects = [document.getElementById('startMinute'), document.getElementById('endMinute')];

    // Populate hours (00–23)
    for (let h = 0; h < 24; h++) {
        const option = document.createElement('option');
        option.value = option.textContent = h.toString().padStart(2, '0');
        hourSelects.forEach(select => select?.appendChild(option.cloneNode(true)));
    }

    // Populate minutes (00–59)
    for (let m = 0; m < 60; m += 5) { 
        const option = document.createElement('option');
        option.value = option.textContent = m.toString().padStart(2, '0');
        minuteSelects.forEach(select => select?.appendChild(option.cloneNode(true)));
    }
}

export function setupTimeDurationListeners() {
    const startHour = document.getElementById('startHour');
    const startMinute = document.getElementById('startMinute');
    const endHour = document.getElementById('endHour');
    const endMinute = document.getElementById('endMinute');
    const durationInput = document.getElementById('duration');

    function updateDuration() {
        const startH = parseInt(startHour.value, 10);
        const startM = parseInt(startMinute.value, 10);
        const endH = parseInt(endHour.value, 10);
        const endM = parseInt(endMinute.value, 10);

        if ([startH, startM, endH, endM].some(isNaN)) {
            durationInput.value = '';
            return;
        }

        let duration = (endH * 60 + endM) - (startH * 60 + startM);
        if (duration < 0) duration += 24 * 60;

        durationInput.value = duration;
    }

    [startHour, startMinute, endHour, endMinute].forEach(el => {
        if (el) el.addEventListener('input', updateDuration);
    });
}
