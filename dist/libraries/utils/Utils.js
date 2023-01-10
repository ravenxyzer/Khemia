"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
/**
 * @description Custom Utility Functions
 */
exports.Utils = {
    capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    bold: function (str) {
        return `**${str}**`;
    },
    randomArray: function (array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    stripUrl: function (url) {
        return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
    },
    mapUrls: function (urls) {
        return urls.map((url) => `[${this.stripUrl(url)}](${url})`).join(" ");
    },
    stripHtmlTags: function (str) {
        return str.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]*>/gi, "");
    },
    trimString: function (str, length) {
        return str.length > length ? str.substring(0, length) + "..." : str;
    },
    msToSeconds: function (ms) {
        return ms / 1000;
    },
    secondsToMs: function (seconds) {
        return seconds * 1000;
    },
    minutesToMs: function (minutes) {
        return minutes * 60 * 1000;
    },
    formatTime: function (ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours} hours ${minutes % 60} minutes`;
        }
        else if (minutes > 0) {
            return `${minutes} minutes`;
        }
        else {
            return `${seconds} seconds`;
        }
    },
    pad: function (num, size) {
        let s = num + "";
        while (s.length < size)
            s = "0" + s;
        return s;
    },
    formatTimestamp: function (ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${this.pad(hours, 2)}:${this.pad(minutes % 60, 2)}:${this.pad(seconds % 60, 2)}`;
        }
        else if (minutes > 0) {
            return `${this.pad(minutes, 2)}:${this.pad(seconds % 60, 2)}`;
        }
        else {
            return `${this.pad(seconds, 2)}`;
        }
    },
};
