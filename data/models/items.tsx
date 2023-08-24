import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake, deletedDate } from "./base";
import { CatalogedTask } from "./tasks";



export const CatalogedItemOptionValue = cs(z.object({
  id: Snowflake,
  label: z.string(),
  subtext: z.string(),
  deleted: deletedDate,
}), {}, null);

export const CatalogedItemOption = cs(z.object({
  id: Snowflake,
  key: z.string(),
  allowNull: z.boolean(),
  allowMulti: z.boolean(),
  deleted: deletedDate,
  values: z.array(CatalogedItemOptionValue.schema),
}), {}, null);

export const CatalogedItem = cs(z.object({
  id: Snowflake,
  type: z.string(),
  subtype: z.string(),
  description: z.string(),
  catalogedTasks: z.array(CatalogedTask.schema),
  isCommissionable: z.boolean(),
  isSizeable: z.boolean(),
  deleted: deletedDate,
  options: z.array(CatalogedItemOption.schema)
}), standardRoute(), {
  id: 0,
  type: "",
  subtype: "",
  description: "",
  catalogedTasks: [],
  isCommissionable: false,
  isSizeable: false,
  deleted: null,
  options: []
});