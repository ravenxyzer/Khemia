import { Command, CommandOptionsRunTypeEnum } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, MessageEmbed } from "discord.js";
import dayjs from "dayjs";

import { Colors, Developers, InviteLink, Utils } from "../../libraries";

/**
 * @description About Command: Information about Khemia
 */
@ApplyOptions<Command.Options>({
    name: "about",
    description: "Displays an information about this bot.",
    requiredClientPermissions: ["SEND_MESSAGES"],
    runIn: CommandOptionsRunTypeEnum.GuildAny,
})
export default class AboutCommand extends Command {
    public override async messageRun(message: Message): Promise<void> {
        await message.reply({ embeds: [await this._showResponse(message)] });
    }

    public override async chatInputRun(interaction: Command.ChatInputInteraction): Promise<void> {
        await interaction.reply({ embeds: [await this._showResponse(interaction)] });
    }

    private async _showResponse(interaction: Message | Command.ChatInputInteraction): Promise<MessageEmbed> {
        return new MessageEmbed()
            .setAuthor({
                name: this.container.client.user.username,
                iconURL: this.container.client.user.displayAvatarURL({ dynamic: true, size: 512 }),
            })
            .setDescription(
                await resolveKey(interaction, "AboutCommand:success", {
                    client: this.container.client.user.username,
                    owner: (await interaction.client.users.fetch(Developers[0])).tag,
                    guild: (await interaction.client.guilds.fetch("761550024131215430")).name,
                })
            )
            .addFields([
                {
                    name: "Genshin Impact ID",
                    value: `[${await resolveKey(interaction, "AboutCommand:join")}](https://discord.gg/sPcbcaKyz7)`,
                },
                {
                    name: "Khemia",
                    value: `[${await resolveKey(interaction, "AboutCommand:invite")}](${InviteLink})`,
                    inline: true,
                },
                {
                    name: "Guilds",
                    value: this.container.client.guilds.cache.size.toLocaleString("en-US"),
                },
                {
                    name: "Users",
                    value: this.container.client.users.cache.size.toLocaleString("en-US"),
                    inline: true,
                },
            ])
            .setImage(
                Utils.randomArray([
                    "https://cdn.discordapp.com/attachments/1055879106090238073/1055882394353279066/bg1.jpg",
                    "https://cdn.discordapp.com/attachments/1055879106090238073/1055882503946244196/bg2.jpg",
                ])
            )
            .setColor(Colors.default);
    }
}
