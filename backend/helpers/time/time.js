
const pad = (num) => (num < 10 ? "0" + num : num);

exports.getTimestamp = () => {
    let date = new Date();

    return (
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    );
};