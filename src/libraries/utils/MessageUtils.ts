import { IEmbedBuilder } from "../../structures/messages/IEmbedBuilder";

/**
 * @description Khemia message utilities.
 */
export class MessageUtils {
    public embed(): IEmbedBuilder {
        return new IEmbedBuilder();
    }
}
