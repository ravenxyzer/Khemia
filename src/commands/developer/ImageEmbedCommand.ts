import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Attachment, AttachmentBuilder, Message, User } from "discord.js";

import { ICommand } from "../../structures";

@ApplyOptions<ICommand.Options>({
    name: "image",
    aliases: ["im"],
    description: "",
    extendedDescription: {
        usage: "",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    preconditions: ["OwnerOnly"],
    runIn: ["GUILD_ANY"],
})
export class ImageEmbedCommand extends ICommand {
    public async messageRun(message: Message, args: Args): Promise<void> {
        message.delete();
        const link: string = await args.rest("string");
        const response = await message.channel.send({
            embeds: [this.utils.embed().setImage(link).setColor("#ffc5ee")],
        });

        await response.react("💕");
    }
}
