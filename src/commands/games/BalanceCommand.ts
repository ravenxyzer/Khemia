import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User } from "discord.js";

import { ICommand } from "../../structures";
import { Developers } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "balance",
    aliases: ["wallet", "cash"],
    description: "Check your balance or another person's balance.",
    extendedDescription: {
        usage: "balance <user>",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    cooldownFilteredUsers: [Developers[0]],
})
export class BalanceCommand extends ICommand {
    public async messageRun(message: Message, args: Args): Promise<void> {
        const user: User = args.finished ? message.author : await args.pick("user");
        void this.balance(message, user);
    }

    public async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser("user") || interaction.user;
        void this.balance(interaction, user);
    }

    private async balance(ctx: Message | ICommand.ChatInputCommandInteraction, user: User): Promise<void> {
        const db = await this.container.database.balance.findOne({
            userId: user.id,
        });

        if (!db) {
            await ctx.reply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(
                            await resolveKey(ctx, "CommandResponses:balance:failed", { user: `<@${user.id}` })
                        )
                        .isErrorEmbed(true),
                ],
            });
        } else {
            await ctx.reply({
                embeds: [
                    this.utils.embed().setDescription(
                        await resolveKey(ctx, "CommandResponses:balance:success", {
                            user: user.tag,
                            balance: db.balance.toLocaleString(`us`),
                        })
                    ),
                ],
            });
        }
    }

    public registerApplicationCommands(registry: ICommand.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setDescriptionLocalizations({ id: "Menampilkan saldo Anda atau saldo orang lain." })
                    .addUserOption((option) =>
                        option
                            .setName("user")
                            .setDescription("Specify a user!")
                            .setDescriptionLocalizations({ id: "Tentukan user!" })
                            .setRequired(false)
                    ),
            { idHints: ["1078335614119841822"] }
        );
    }
}
