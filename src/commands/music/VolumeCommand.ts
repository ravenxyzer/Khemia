import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message } from "discord.js";
import { Queue } from "distube";
import { ICommand } from "../../structures";

@ApplyOptions<ICommand.Options>({
    name: "volume",
    description: "Set the volume.",
    extendedDescription: {
        usage: "volume <number>",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
})
export class VolumeCommand extends ICommand {
    public async messageRun(message: Message, args: Args): Promise<void> {
        const volume: number = await args.pick("number");
        this.setVolume(message, volume);
    }

    public async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const volume: number = interaction.options.getNumber("volume");
        this.setVolume(interaction, volume);
    }

    private async setVolume(ctx: Message | ICommand.ChatInputCommandInteraction, volume: number): Promise<void> {
        const queue: Queue = this.container.distube.getQueue(ctx);

        if (!queue) {
            await ctx.reply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(await resolveKey(ctx, "CommandResponses:volume:error:noQueue"))
                        .isErrorEmbed(true),
                ],
            });
        }

        if (volume < 0 || volume > 200) {
            await ctx.reply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(await resolveKey(ctx, "CommandResponses:volume:error:volumeError"))
                        .isErrorEmbed(true),
                ],
            });
        } else {
            queue.setVolume(volume);
            await ctx.reply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(await resolveKey(ctx, "CommandResponses:volume:success", { volume }))
                        .isSuccessEmbed(true),
                ],
            });
        }
    }
}
