import { Listener, ListenerOptions } from "@sapphire/framework";
import { MessageUtils } from "../../libraries";

export interface IListenerOptions extends ListenerOptions {}
export abstract class IListener extends Listener {
    utils: MessageUtils;

    constructor(context: Listener.Context, options?: IListenerOptions) {
        super(context, { ...options });
        this.utils = new MessageUtils();
    }
}

export declare namespace IListener {
    type Options = IListenerOptions;
    type JSON = Listener.JSON;
    type Context = Listener.Context;
}
