// formatDate2
// Input: 2025-04-10T00:00:00.000Z
// Output: Tuesday, July 9th 2024


export const formatDate2 = (dateString) => {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Array for month names
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Array for day suffixes
    const suffixes = ["th", "st", "nd", "rd"];

    // Function to get the suffix for the day
    function getDaySuffix(day) {
        const ones = day % 10;
        const tens = Math.floor(day / 10) % 10;
        if (tens === 1) {
            return suffixes[0]; // For 11th, 12th, 13th, etc.
        }
        return suffixes[ones] || suffixes[0];
    }

    // Format the date into a human-readable format
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const weekday = date.toLocaleString('en-us', { weekday: 'long' });

    // Get the day suffix (e.g., "st", "nd", "rd", "th")
    const dayWithSuffix = day + getDaySuffix(day);

    // Return the formatted date
    return `${weekday}, ${month} ${dayWithSuffix} ${year}`;
}