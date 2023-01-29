import timers from "node:timers/promises";
import { UserError } from "@sapphire/framework";
import { Queue } from "distube";

export class Utils {
    /**
     * @description Throws a user error.
     */
    error(identifier: string, message: string, context?: unknown): void {
        throw typeof identifier === "string"
            ? new UserError({
                  identifier: identifier,
                  message: message,
                  context: context,
              })
            : identifier;
    }

    /**
     * @description Capitalize the first letter of a string.
     */
    capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * @description Randomize a array.
     */
    randomArray(array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * @description Strip www and top level domain from a url.
     */
    stripUrl(url: string): string {
        return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
    }

    /**
     * @description Map urls into a markdown links.
     */
    mapUrls(urls: string[]): string {
        return urls.map((url) => `[${this.stripUrl(url)}](${url})`).join(" ");
    }

    /**
     * @description Strip HTML tags from a tag.
     */
    stripHtmlTags(str: string): string {
        return str.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]*>/gi, "");
    }

    /**
     * @description Trims a string to a certain length.
     */
    trimString(str: string, length: number): string {
        return str.length > length ? str.substring(0, length) + "..." : str;
    }

    /**
     * @description Convert milliseconds into seconds.
     */
    msToSeconds(ms: number): number {
        return ms / 1000;
    }

    /**
     * @description Convert seconds into milliseconds.
     */
    secondsToMs(seconds: number): number {
        return seconds * 1000;
    }

    /**
     * @description Convert minutes into milliseconds.
     */
    minutesToMs(minutes: number): number {
        return minutes * 60 * 1000;
    }

    /**
     * @description Format milliseconds into human readable format.
     */
    formatTime(ms: number): string {
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
    }

    /**
     * @description Pad a string with a certain length.
     */
    pad(num: number, size: number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    /**
     * @description Format miliseconds into 00:00:00 format.
     */
    formatTimestamp(ms: number): string {
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
    }

    wait(ms: number): Promise<void> {
        return timers.setTimeout(ms);
    }

    toMention(id: string): string {
        return `<@${id}>`;
    }

    status(queue: Queue): string {
        return `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(", ") || "Off"}\` | Loop: \`${
            queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "This Song") : "Off"
        }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
    }
}
