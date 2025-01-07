const formatedDate = (date, offsetMinutes = 330) => {
    const currentDate = new Date();
    const inputDate = new Date(date);
    inputDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());
    const adjustedDate = new Date(inputDate.getTime() + offsetMinutes * 60000);
    return adjustedDate.toISOString();
};

export default formatedDate

