import { ApplyOptions } from "@sapphire/decorators";
import { Message, EmbedBuilder } from "discord.js";
import { resolveKey } from "@sapphire/plugin-i18next";

import { ICommand } from "../../structures";
import { Colors, Languages } from "../../libraries";

/**
 * @description Language Command: Per user bot language configuration
 */
@ApplyOptions<ICommand.Options>({
    name: "language",
    description: "Language configuration for this bot.",
    extendedDescription: {
        usage: "/language list | /language update <language> | /language reset",
    },
    requiredClientPermissions: ["SendMessages"],
    subcommands: [
        { name: "list", chatInputRun: "showList" },
        { name: "update", chatInputRun: "updateLanguage" },
        { name: "reset", chatInputRun: "resetLanguage" },
    ],
})
export default class LanguageCommand extends ICommand {
    public override async messageRun(message: Message): Promise<void> {
        await message.reply({ content: await resolveKey(message, "CommandResponses:denied:slashOnly") });
    }

    public async showList(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const { client } = this.container;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: await resolveKey(interaction, "CommandResponses:language:name", {
                            name: client.user.username,
                        }),
                        iconURL: client.user.displayAvatarURL({ size: 512 }),
                    })
                    .setDescription(
                        await resolveKey(interaction, "CommandResponses:language:listDescription", {
                            languages: "\n" + Languages.join("\n"),
                        })
                    )
                    .setColor(Colors.default),
            ],
        });
    }

    public async updateLanguage(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const language: string = interaction.options.getString("language");
        const db = await this.container.database.language.findUnique({
            where: { userId: interaction.user.id },
        });

        if (!db) {
            if (language !== process.env.DEFAULT_LANGUAGE) {
                await interaction.reply({
                    content: await resolveKey(interaction, "CommandResponses:language:success:updateSuccess", {
                        language,
                    }),
                });

                await this.container.database.language.create({
                    data: {
                        userId: interaction.user.id,
                        language: language,
                    },
                });
            }

            await interaction.reply({
                content: await resolveKey(interaction, "CommandResponses:language:error:isDefault", {
                    language,
                }),
            });
        }

        if (db.language !== language) {
            await interaction.reply({
                content: await resolveKey(interaction, "CommandResponses:language:success:updateSuccess", { language }),
            });

            await this.container.database.language.update({
                where: { userId: interaction.user.id },
                data: { language: language },
            });
        }

        await interaction.reply({
            content: await resolveKey(interaction, "CommandResponses:language:error:isUsed"),
        });
    }

    public async resetLanguage(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const db = this.container.database.language.findFirst({
            where: { userId: interaction.user.id },
        });

        if (!db) {
            await interaction.reply({
                content: await resolveKey(interaction, "CommandResponses:language:error:isDefault"),
            });
        }

        await interaction.reply({
            content: await resolveKey(interaction, "CommandResponses:language:success:resetSuccess"),
        });

        await this.container.database.language.delete({
            where: { userId: interaction.user.id },
        });
    }

    public override registerApplicationCommands(registry: ICommand.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addSubcommand((subcommand) =>
                        subcommand.setName("list").setDescription("Displays available languages for this bot.")
                    )
                    .addSubcommand((subcommand) =>
                        subcommand
                            .setName("update")
                            .setDescription("Updates the language to the provided one.")
                            .addStringOption((option) =>
                                option
                                    .setName("language")
                                    .setDescription("Provide your language.")
                                    .setRequired(true)
                                    .addChoices(
                                        { name: "English US (en-US)", value: "en-US" },
                                        { name: "Indonesia (id-ID)", value: "id-ID" },
                                        { name: "日本語 (ja-JP)", value: "ja-JP" }
                                    )
                            )
                    )
                    .addSubcommand((subcommand) =>
                        subcommand.setName("reset").setDescription("Resets the language to the default one.")
                    ),
            { idHints: ["1056492429857009724"] }
        );
    }
}
