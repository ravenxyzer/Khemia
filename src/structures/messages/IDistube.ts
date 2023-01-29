import { DisTube, Queue, Song, Playlist } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { container } from "@sapphire/framework";
import { GuildTextBasedChannel, Message } from "discord.js";

import { Emojis } from "../../libraries";
import { IClient, IEmbedBuilder } from "..";

/**
 * @description DisTube client configurations
 */
export class IDistube extends DisTube {
    public constructor(client: IClient) {
        super(client, {
            leaveOnStop: false,
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: false,
            emitAddListWhenCreatingQueue: false,
            plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin(), new YtDlpPlugin()],
        });

        super.on("playSong", (queue: Queue, song: Song<unknown>) =>
            // `${Emojis.music.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
            //     song.user
            // }\n${container.utils.status(queue)}`,
            queue.textChannel.send({
                content: `${Emojis.music.play} | Playing: **${song.name}** - \`${song.formattedDuration}\``,
                embeds: [
                    new IEmbedBuilder().setDescription(
                        `> Requested by ${song.user}\n> ${container.utils.status(queue)}`
                    ),
                ],
            })
        );

        super.on("addSong", (queue: Queue, song: Song<unknown>) =>
            queue.textChannel.send(
                `${Emojis.music.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
            )
        );

        super.on("addList", (queue: Queue, playlist: Playlist<unknown>) =>
            queue.textChannel.send(
                `${Emojis.music.success} | Added \`${playlist.name}\` playlist (${
                    playlist.songs.length
                } songs) to queue\n${container.utils.status(queue)}`
            )
        );

        super.on("error", (channel: GuildTextBasedChannel, error: Error) => {
            if (channel)
                channel.send(`${Emojis.music.error} | An error encountered: ${error.toString().slice(0, 1974)}`);
            else console.error(error);
        });

        super.on("empty", (queue: Queue) => queue.textChannel.send("Voice channel is empty! Leaving the channel..."));

        super.on("searchNoResult", (message: Message<true>, query: string) =>
            message.channel.send(`${Emojis.music.error} | No result found for \`${query}\`!`)
        );

        super.on("finish", (queue: Queue) => queue.textChannel.send("Finished!"));
    }
}
