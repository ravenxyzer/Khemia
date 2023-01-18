import { Subcommand } from "@sapphire/plugin-subcommands";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed } from "discord.js";
import { resolveKey } from "@sapphire/plugin-i18next";

import { Colors } from "../../libraries";
import lang from "../../schemas/LanguageSchema";
import "dotenv/config";

/**
 * @description Language Command: Per user bot language configuration
 */
@ApplyOptions<Subcommand.Options>({
    name: "language",
    description: "Language configuration for this bot.",
    subcommands: [
        { name: "list", chatInputRun: "showList" },
        { name: "update", chatInputRun: "updateLanguage" },
        { name: "reset", chatInputRun: "resetLanguage" },
    ],
})
export default class LanguageCommand extends Subcommand {
    public override async messageRun(message: Message): Promise<void> {
        await message.reply({ content: await resolveKey(message, "LanguageCommand:IsSlash") });
    }

    public async showList(interaction: Subcommand.ChatInputInteraction): Promise<void> {
        const languages: string[] = [":flag_us: `en-US`", ":flag_id: `id-ID`", ":flag_jp: `ja-JP`"];
        const { client } = this.container;
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setAuthor({
                        name: await resolveKey(interaction, "LanguageCommand:Name", { name: client.user.username }),
                        iconURL: client.user.displayAvatarURL({ size: 512, dynamic: true }),
                    })
                    .setDescription(
                        await resolveKey(interaction, "LanguageCommand:ListDescription", {
                            languages: languages.join(", "),
                        })
                    )
                    .setColor(Colors.default),
            ],
        });
    }

    public async updateLanguage(interaction: Subcommand.ChatInputInteraction): Promise<void> {
        const language: string = interaction.options.getString("language");
        const languageCheck = await lang.findOne({
            userId: interaction.user.id,
        });

        if (!languageCheck) {
            if (language == process.env.DEFAULT_LANGUAGE) {
                await interaction.reply({ content: await resolveKey(interaction, "LanguageCommand:IsUsed") });
            }

            await interaction.reply({
                content: await resolveKey(interaction, "LanguageCommand:UpdateSuccess", { language }),
            });

            await new lang({
                userId: interaction.user.id,
                language,
            }).save();
        }

        if (languageCheck.language == language) {
            await interaction.reply({ content: await resolveKey(interaction, "LanguageCommand:IsUsed") });
        }

        await interaction.reply({
            content: await resolveKey(interaction, "LanguageCommand:UpdateSuccess", { language }),
        });

        languageCheck.language = language;
        languageCheck.save();
    }

    public async resetLanguage(interaction: Subcommand.ChatInputInteraction): Promise<void> {
        const languageCheck = await lang.findOne({
            userId: interaction.user.id,
        });

        if (!languageCheck) {
            await interaction.reply({ content: await resolveKey(interaction, "LanguageCommand:IsDefault") });
        }

        await interaction.reply({ content: await resolveKey(interaction, "LanguageCommand:ResetSuccess") });
        await lang.findOneAndDelete({
            userId: interaction.user.id,
        });
    }

    public override registerApplicationCommands(registry: Subcommand.Registry): void {
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
