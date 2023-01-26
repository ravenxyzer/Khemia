import { Listener, ListenerOptions, PieceContext } from "@sapphire/framework";
import { MessageUtils } from "../../libraries";

export interface IListenerOptions extends ListenerOptions {}
export abstract class IListener extends Listener {
    utils: MessageUtils;

    constructor(context: PieceContext, options?: IListenerOptions) {
        super(context, { ...options });
        this.utils = new MessageUtils();
    }
}
