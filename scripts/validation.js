export const ValidationRules = {
    // Basic validations
    title: /^\S(?:.*\S)?$/, // No leading/trailing spaces
    numeric: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // Positive number with max 2 decimals
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // YYYY-MM-DD
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, // Letters, spaces, hyphens
    
    // Advanced: duplicate word detection
    duplicateWords: /\b(\w+)\s+\1\b/,
    
    // Advanced: time format HH:MM
    time: /^([01]\d|2[0-3]):([0-5]\d)$/
};

export function validateTask(taskData) {
    const errors = [];
    
    if (!ValidationRules.title.test(taskData.title)) {
        errors.push("Title cannot have leading/trailing spaces.");
    }
    
    if (ValidationRules.duplicateWords.test(taskData.title)) {
        errors.push("Title contains duplicate words.");
    }
    
    if (!ValidationRules.numeric.test(taskData.duration)) {
        errors.push("Duration must be a positive number (max 2 decimals).");
    }
    
    if (!ValidationRules.date.test(taskData.dueDate)) {
        errors.push("Date must be in YYYY-MM-DD format.");
    }
    
    if (!ValidationRules.tag.test(taskData.tag)) {
        errors.push("Tag can only contain letters, spaces, or hyphens.");
    }
    
    return errors.length > 0 ? errors.join(' ') : null;
}

export function showInlineError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let errorSpan = field.nextElementSibling;
    
    if (!errorSpan || !errorSpan.classList.contains('error-message')) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.style.color = 'red';
        errorSpan.style.fontSize = '0.875rem';
        field.parentNode.insertBefore(errorSpan, field.nextSibling);
    }
    
    errorSpan.textContent = message;
}

export function clearInlineErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}