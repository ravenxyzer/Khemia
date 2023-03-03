import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User } from "discord.js";

import { ICommand } from "../../structures";
import { Developers, Characters } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "gacha",
    aliases: ["wish"],
    description: "",
    extendedDescription: {
        usage: "gacha",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    cooldownFilteredUsers: [Developers[0]],
})
export class GachaCommand extends ICommand {
    public async messageRun(message: Message): Promise<void> {
        this.gacha(message);
    }

    public async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {}

    private async gacha(ctx: Message | ICommand.ChatInputCommandInteraction): Promise<void> {
        const rand = this.container.utils.randomGacha(Characters);
        await ctx.reply({
            embeds: [
                this.utils.embed().setDescription(`Name: ${rand.name}\nRarity: ${rand.rarity}`).setImage(rand.image),
            ],
        });
    }
}
