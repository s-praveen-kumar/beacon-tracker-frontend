const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.getHours() + ":" + date.getMinutes() + " - " + date.getDate() + " " + months[date.getMonth()];
}

export function formatRelativeTime(isoString) {
    const date = new Date(isoString);
    const start = date.getTime();
    const end = new Date().getTime();
    const diff = (end - start) / 1000;
    if (diff < 0) {
        if (diff > -60) {
            return "in a moment"
        }
        else if (diff > -3600)
            return "in "+Math.floor(-diff / 60) + "m";
        else if (diff > -86400)
            return "in "+Math.floor(-diff / 3600) + "h";
        else
            return "in "+Math.floor(-diff / 86400) + "d";
    } else {
        if (diff < 60)
            return "Just now";
        else if (diff < 3600)
            return Math.floor(diff / 60) + "m ago";
        else if (diff < 86400)
            return Math.floor(diff / 3600) + "h ago";
        else
            return Math.floor(diff / 86400) + "d ago";
    }
}