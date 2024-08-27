export const titleCase = (str: string) => {
    str = str.toLowerCase();
    return (str.match(/\w+.?/g) || [])
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
};

export const secondsToSRT = (seconds: number): string => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const milliseconds = seconds * 1000;
    return (
        date.toISOString().substr(11, 8) +
        "," +
        ("000" + (milliseconds % 1000)).slice(-3)
    );
};

export const millisecondsToTime = (ms: number): string => {
    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;

    if (ms >= msInHour) {
        const hours = ms / msInHour;
        return `${hours.toFixed(0)} hours`;
    } else if (ms >= msInMinute) {
        const minutes = ms / msInMinute;
        return `${minutes.toFixed(0)} minutes`;
    } else {
        const seconds = ms / msInSecond;
        return `${seconds.toFixed(0)} seconds`;
    }
};
