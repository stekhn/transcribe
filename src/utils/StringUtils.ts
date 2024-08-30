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

    const pluralize = (value: number, unit: string): string => {
        return `${value} ${unit}${value !== 1 ? "s" : ""}`;
    };

    if (ms >= msInHour) {
        const hours = Math.floor(ms / msInHour);
        return pluralize(hours, "hour");
    } else if (ms >= msInMinute) {
        const minutes = Math.floor(ms / msInMinute);
        return pluralize(minutes, "minute");
    } else {
        const seconds = Math.floor(ms / msInSecond);
        return pluralize(seconds, "second");
    }
};

export const secondsToTimecode = (s: number): string => {
    if (typeof s === "number" && !isNaN(s)) {
        const minutes = Math.floor(s / 60);
        const seconds = Math.floor(s % 60);

        const formatMinutes = minutes.toString().padStart(2, "0");
        const formatSeconds = seconds.toString().padStart(2, "0");

        return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
};
