import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User } from "discord.js";

import { ICommand } from "../../structures";
import { Developers } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "register",
    description: "Register your Khemia account.",
    extendedDescription: {
        usage: "register",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    cooldownFilteredUsers: [Developers[0]],
})
export class RegisterCommand extends ICommand {
    public async messageRun(message: Message): Promise<void> {
        void this.register(message, message.author);
    }

    public async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        void this.register(interaction, interaction.user);
    }

    private async register(ctx: Message | ICommand.ChatInputCommandInteraction, user: User): Promise<void> {
        const db = await this.container.database.balance.findOne({
            userId: user.id,
        });

        if (!db) {
            await this.container.database.balance.create({
                userId: user.id,
                balance: 0,
            });

            await ctx.reply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(
                            await resolveKey(ctx, "CommandResponses:register:success", {
                                client: this.container.client.user.username,
                            })
                        )
                        .isSuccessEmbed(true),
                ],
            });
        } else {
            await ctx.reply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(await resolveKey(ctx, "CommandResponses:register:failed"))
                        .isErrorEmbed(true),
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
                    .setDescriptionLocalizations({ id: "Registrasi akun Khemia Anda." }),
            { idHints: ["1078335616330244146"] }
        );
    }
}
