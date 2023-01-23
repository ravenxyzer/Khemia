import * as Preconditions from "../preconditions";

declare module "@sapphire/framework" {
    const enum Identifiers {
        DevsOnly = "preconditionDeveloperOnly",
        OwnerOnly = "preconditionOwnerOnly",
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        DevsOnly: never;
        OwnerOnly: never;
    }
}
