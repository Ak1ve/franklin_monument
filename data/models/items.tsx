import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";
import { CatalogedTask } from "./tasks";

export const ItemOptionValue = cs(
  z.object({
    id: Snowflake,
    label: z.string(),
    subtext: z.string(),
    isDeleted: z.boolean(),
  }),
  standardRoute(),
  {
    id: 0,
    label: "",
    subtext: "",
    isDeleted: false
  }
);

export const ItemOption = cs(
  z.object({
    id: Snowflake,
    key: z.string(),
    allowNull: z.boolean(),
    allowMulti: z.boolean(),
    isDeleted: z.boolean(),
    values: z.array(ItemOptionValue.schema),
  }),
  standardRoute(),
  {
    id: 0,
    key: "",
    allowNull: false,
    allowMulti: false,
    isDeleted: false,
    values: []
  }
);

export const CatalogedItem = cs(
  z.object({
    id: Snowflake,
    type: z.string(),
    subType: z.string(),
    description: z.string(),
    commissionable: z.boolean(),
    sizeable: z.boolean(),
    options: z.array(ItemOption.schema),
    tasks: z.array(CatalogedTask.schema),
    isDeleted: z.boolean(),
    price: z.string(),
  }),
  standardRoute(),
  {
    id: 0,
    type: "",
    subType: "",
    description: "",
    commissionable: false,
    sizeable: false,
    options: [],
    tasks: [],
    isDeleted: false,
    price: "",
  }
);
