export function titleCase(str: string) {
    str = str.toLowerCase();
    return (str.match(/\w+.?/g) || [])
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
}

export const formatTime = (seconds: number): string => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const milliseconds = seconds * 1000;
    return (
        date.toISOString().substr(11, 8) +
        "," +
        ("000" + (milliseconds % 1000)).slice(-3)
    );
};
