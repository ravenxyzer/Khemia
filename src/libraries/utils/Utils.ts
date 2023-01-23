import timers from "node:timers/promises";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { Command, Listener } from "@sapphire/framework";
import type { Message } from "discord.js";

import { ResponseInterface } from "./Interfaces";

/**
 * @description Custom Utility Functions
 */
export const Utils = {
    capitalize: function (str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    bold: function (str: string): string {
        return `**${str}**`;
    },

    randomArray: function (array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    },

    stripUrl: function (url: string): string {
        return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
    },

    mapUrls: function (urls: string[]): string {
        return urls.map((url) => `[${this.stripUrl(url)}](${url})`).join(" ");
    },

    stripHtmlTags: function (str: string): string {
        return str.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]*>/gi, "");
    },

    trimString: function (str: string, length: number): string {
        return str.length > length ? str.substring(0, length) + "..." : str;
    },

    msToSeconds: function (ms: number): number {
        return ms / 1000;
    },

    secondsToMs: function (seconds: number): number {
        return seconds * 1000;
    },

    minutesToMs: function (minutes: number): number {
        return minutes * 60 * 1000;
    },

    formatTime: function (ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours} hours ${minutes % 60} minutes`;
        } else if (minutes > 0) {
            return `${minutes} minutes`;
        } else {
            return `${seconds} seconds`;
        }
    },

    pad: function (num: number, size: number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    },

    formatTimestamp: function (ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${this.pad(hours, 2)}:${this.pad(minutes % 60, 2)}:${this.pad(seconds % 60, 2)}`;
        } else if (minutes > 0) {
            return `${this.pad(minutes, 2)}:${this.pad(seconds % 60, 2)}`;
        } else {
            return `${this.pad(seconds, 2)}`;
        }
    },

    wait: function (ms: number): Promise<void> {
        return timers.setTimeout(ms);
    },
};
