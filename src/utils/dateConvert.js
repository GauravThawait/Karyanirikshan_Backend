const formatedDate = (date) => {

    const currentDate = new Date(); // Get the current date and time
    const indiaOffset = 5 * 60 + 30; // IST offset in minutes (+5:30)
    const utcOffset = currentDate.getTimezoneOffset(); // Local timezone offset in minutes
    const totalOffset = indiaOffset - utcOffset; // Difference to adjust to IST

    // Convert the `date` string to a `Date` object
    const inputDate = new Date(date);

    // Set the current time to the input date
    inputDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());

    // Adjust to India timezone
    const adjustedDate = new Date(inputDate.getTime() + totalOffset * 60000);

    // Format the date to the desired format
    const formattedDate = adjustedDate.toISOString().replace('T', ' ').replace('Z', '+05:30');

    return formattedDate
}

export default formatedDate
