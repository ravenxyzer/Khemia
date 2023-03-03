import { model, Schema } from "mongoose";

import { BalanceModelTypes } from "../../../libraries";

export const balanceModel = model(
    "balance",
    new Schema<BalanceModelTypes>({
        userId: { type: String },
        balance: { type: Number },
    })
);
