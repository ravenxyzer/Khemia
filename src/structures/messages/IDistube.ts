import { container } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { GuildTextBasedChannel, Message, CommandInteraction } from "discord.js";
import { DisTube, Queue, Song, Playlist, formatDuration } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { YtDlpPlugin } from "@distube/yt-dlp";

import { IClient, IEmbedBuilder } from "..";

export class IDistube extends DisTube {
    context: Message | CommandInteraction;

    public constructor(client: IClient) {
        super(client, {
            leaveOnStop: false,
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: false,
            emitAddListWhenCreatingQueue: true,
            plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin(), new YtDlpPlugin()],
        });

        super.on(
            "playSong",
            async (queue: Queue, song: Song<unknown>) =>
                await queue.textChannel.send({
                    embeds: [
                        new IEmbedBuilder()
                            .setDescription(
                                await resolveKey(this.context, "DistubeResponses:playSong:success", {
                                    name: container.utils.trimString(song.name, 35),
                                    url: song.url,
                                    duration: song.formattedDuration,
                                })
                            )
                            .setFooter({ text: `Status: ${container.utils.status(queue)}` }),
                    ],
                })
        );

        super.on(
            "addList",
            async (queue: Queue, playlist: Playlist<unknown>) =>
                await queue.textChannel.send({
                    embeds: [
                        new IEmbedBuilder().setDescription(
                            await resolveKey(this.context, "DistubeResponses:addList:success", {
                                name: playlist.name,
                                length: playlist.songs.length,
                            })
                        ),
                    ],
                })
        );

        super.on(
            "addSong",
            async (queue: Queue, song: Song<unknown>) =>
                await queue.textChannel.send({
                    embeds: [
                        new IEmbedBuilder().setDescription(
                            await resolveKey(this.context, "DistubeResponses:addSong:success", {
                                name: container.utils.trimString(song.name, 35),
                                duration: song.formattedDuration,
                            })
                        ),
                    ],
                })
        );

        super.on("error", async (channel: GuildTextBasedChannel, error: Error) => {
            if (channel)
                await channel.send({
                    embeds: [
                        new IEmbedBuilder().isErrorEmbed(true).setDescription(
                            await resolveKey(this.context, "DistubeResponses:error:response", {
                                error: error.toString().slice(0, 1974),
                            })
                        ),
                    ],
                });
            else console.error(error);
        });

        super.on(
            "empty",
            async (queue: Queue) =>
                await queue.textChannel.send({
                    embeds: [
                        new IEmbedBuilder().setDescription(
                            await resolveKey(this.context, "DistubeResponses:empty:response")
                        ),
                    ],
                })
        );

        super.on(
            "searchNoResult",
            async (message: Message<true>, query: string) =>
                await message.channel.send({
                    embeds: [
                        new IEmbedBuilder()
                            .isErrorEmbed(true)
                            .setDescription(
                                await resolveKey(this.context, "DistubeResponses:error:searchNoResult", { query })
                            ),
                    ],
                })
        );

        super.on(
            "finish",
            async (queue: Queue) =>
                await queue.textChannel.send({
                    embeds: [
                        new IEmbedBuilder().setDescription(
                            await resolveKey(this.context, "DistubeResponses:finish:success")
                        ),
                    ],
                })
        );
    }

    public setContext(ctx: Message | CommandInteraction): Message<boolean> | CommandInteraction {
        return (this.context = ctx);
    }
}
