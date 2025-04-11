// Tuesday, July 9th 2024

export function formatDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    // Add 'th', 'st', 'nd', 'rd' to the day
    const day = date.getDate();
    let daySuffix;
    if (day >= 11 && day <= 13) {
      daySuffix = 'th';
    } else {
      switch (day % 10) {
        case 1: daySuffix = 'st'; break;
        case 2: daySuffix = 'nd'; break;
        case 3: daySuffix = 'rd'; break;
        default: daySuffix = 'th';
      }
    }

    return formattedDate.replace(/(\d+)(,)/, `$1${daySuffix}`);
  }