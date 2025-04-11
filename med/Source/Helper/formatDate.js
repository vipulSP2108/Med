export const formatDate = (date) => {
    if (!date) return '';

    // If the date is a string like '10/4/2025'
    const [day, month, year] = date.split('/').map(num => parseInt(num, 10));

    if (isNaN(month) || isNaN(day) || isNaN(year)) return '';

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let daySuffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
        daySuffix = 'st';
    } else if (day === 2 || day === 22) {
        daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
        daySuffix = 'rd';
    }

    return `${day}${daySuffix} ${months[month - 1]}, ${year}`;
};