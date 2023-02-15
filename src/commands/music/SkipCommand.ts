import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message } from "discord.js";
import { Queue, Song } from "distube";
import { ICommand } from "../../structures";

@ApplyOptions<ICommand.Options>({
    name: "skip",
    description: "Skip the song that is currently playing",
    extendedDescription: {
        usage: "skip",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
})
export class SkipCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        this.skip(message);
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        this.skip(interaction);
    }

    public override async registerApplicationCommands(registry: ICommand.Registry): Promise<void> {
        registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
            idHints: [],
        });
    }

    private async skip(ctx: Message | ICommand.ChatInputCommandInteraction): Promise<void> {
        const queue: Queue = this.container.distube.getQueue(ctx);

        if (!queue) {
            await ctx.reply({ content: await resolveKey(ctx, "CommandReponses:skip:error:noQueue") });
        }

        try {
            const song: Song<unknown> = await queue.skip();
            await ctx.channel.send({
                content: await resolveKey(ctx, "CommandResponses:skip:success", { song: song.name }),
            });
        } catch (error: any) {
            await ctx.channel.send({
                content: await resolveKey(ctx, "CommandResponses:skip:error:response", { error }),
            });
        }
    }
}
