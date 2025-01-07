const formatedDate = (date) => {
    // Ensure input date is always in UTC
    const inputDate = new Date(date); // Parse the input date
    const currentDate = new Date(); // Get the current date and time


    // Set the time of the input date to the current time
    inputDate.setUTCHours(
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds(),
        currentDate.getUTCMilliseconds()
    );

    // Convert to ISO format in UTC
    return inputDate.toISOString();
};

export default formatedDate;
