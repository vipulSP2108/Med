export const GOOGLE_SCRIPT_getMessMenu = 'https://script.google.com/macros/s/AKfycbzuVwc1mIeMqG06hw5S56Bsn6QVWBZCHyCkr2FvaS7veccuByKHul9aW0PpegZBQUUqPA/exec';
export const GOOGLE_SCRIPT_getTodayMessHistory = 'https://script.google.com/macros/s/AKfycbwiogJ69CuiF_ecWohpMo5iXvvmuy8DOJKxyticu7oMjOjvBSil2_7RioolqWcgLY7kxQ/exec';
export const GOOGLE_SCRIPT_getFullMessHistory = 'https://script.google.com/macros/s/AKfycbw_RGhpytBsI4M71sBC8AjkyUns1FTjfQwlUoTsbC6vl7SOeyHImVLzXIX-fK-p986vVg/exec';
export const GOOGLE_SCRIPT_getMessByEmail = 'https://script.google.com/macros/s/AKfycbyc-E_1T67dKlfPKRWvWy0zSidprR8iao8uUh9k21fBEk8BNeFviEn8uP96urX_yE8wIg/exec';
export const GOOGLE_SCRIPT_getSpecial = "https://script.google.com/macros/s/AKfycbz2t-UiIjaWJu23L1zW1CN-M3NRVwpgrUKT1rLpu91mwNplVcMuvLx1gcw-7WJzkKxcFA/exec";

export const fetchMessMenuData = async (setMessMealData) => {
  fetch(GOOGLE_SCRIPT_getMessMenu)
    .then(response => response.json())
    .then(data => {
      setMessMealData(data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
};


export const fetchSpecialData = async (setSpecialMessData) => {
  fetch(GOOGLE_SCRIPT_getSpecial)
    .then(response => response.json())
    .then(data => {
      // console.log('data', data)
      setSpecialMessData(data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
};

export const fetchMessTodayHistory = async (setMessTodayHistory) => {
  fetch(GOOGLE_SCRIPT_getTodayMessHistory)
    .then(response => response.json())
    .then(data => {
      setMessTodayHistory(data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
};

export const getMessByEmail = async (contactinfo, setUserMess) => {
  if (!contactinfo) {
    console.error("userData is not Provided");
    return;
  }
  try {
    const response = await fetch(GOOGLE_SCRIPT_getMessByEmail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputEmail: contactinfo,  // Make sure this is the correct format for the API
      }),
    });

    if (!response.ok) {
      console.error(`Server error: response`);
    }

    const text = await response.text(); // Get raw response text
    try {
      const data = JSON.parse(text); // Attempt to parse the JSON response
      console.log(`got userMess`, data)
      setUserMess(data.mess);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  } catch (error) {
    console.error("Error fetching available slots:", error);
  }
  // finally {
  // setLoading(false);  // Stop loading once data is fetched or error occurs
  // }
};