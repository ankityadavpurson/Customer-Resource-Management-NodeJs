module.exports = moment = (timeStamp) => {
    let date = '';
    const spliter = '-';
    const d = new Date(timeStamp);
    date += d.getDate() < 10 ? '0' + d.getDate() + spliter : d.getDate() + spliter;
    date += (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) + spliter : +(d.getMonth() + 1) + spliter;
    date += d.getFullYear();
    return date;
}