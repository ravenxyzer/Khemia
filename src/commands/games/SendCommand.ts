import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User } from "discord.js";

import { ICommand } from "../../structures";
import { Developers } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "send",
    description: "Send your balance to another person.",
    extendedDescription: {
        usage: "send <user> <balance>",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    cooldownFilteredUsers: [Developers[0]],
})
export class SendCommand extends ICommand {
    public async messageRun(message: Message, args: Args): Promise<void> {
        const user: User = await args.pick("user");
        const balance: number = await args.pick("number");
        void this.send(message, message.author, user, balance);
    }

    public async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser("user");
        const balance: number = interaction.options.getNumber("balance");
        void this.send(interaction, interaction.user, user, balance);
    }

    private async send(
        ctx: Message | ICommand.ChatInputCommandInteraction,
        author: User,
        user: User,
        balance: number
    ): Promise<void> {
        const db = await this.container.database.balance.findOne({ userId: user.id });

        if (!db) {
            await ctx.reply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(await resolveKey(ctx, "CommandResponses:balance:failed"))
                        .isErrorEmbed(true),
                ],
            });
        } else {
            const authorDb = await this.container.database.balance.findOne({ userId: author.id });

            if (authorDb.balance < balance) {
                await ctx.reply({
                    embeds: [this.utils.embed().setDescription(" UANGNYA GK CUKUP COK!").isErrorEmbed(true)],
                });
            } else {
                authorDb.balance = authorDb.balance - balance;
                db.balance = db.balance + balance;

                await authorDb.save();
                await db.save();

                await ctx.reply({ embeds: [this.utils.embed().setDescription(" BERHASIL ").isSuccessEmbed(true)] });
            }
        }
    }

    public registerApplicationCommands(registry: ICommand.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setDescriptionLocalizations({ id: "Mengirim saldo Anda ke orang lain." })
                    .addUserOption((option) =>
                        option
                            .setName("user")
                            .setDescription("Specify a user!")
                            .setDescriptionLocalizations({ id: "Tentukan user!" })
                            .setRequired(true)
                    )
                    .addNumberOption((option) =>
                        option
                            .setName("balance")
                            .setDescription("Specify the balance want to send!")
                            .setDescriptionLocalizations({ id: "Tentukan saldo yang akan dikirim!" })
                            .setRequired(true)
                    ),
            { idHints: ["1079444856293830768"] }
        );
    }
}
