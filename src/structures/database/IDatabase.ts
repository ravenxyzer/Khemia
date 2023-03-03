import { balanceModel, languageModel } from ".";

export class IDatabase {
    balance: typeof balanceModel;
    language: typeof languageModel;

    public constructor() {
        this.balance = balanceModel;
        this.language = languageModel;
    }
}
