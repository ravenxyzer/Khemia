import "dotenv/config";

import { IClient } from "./structures";
new IClient().login(process.env.TOKEN);
