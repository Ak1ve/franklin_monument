import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";
import { User } from "./user";

export const CatalogedTask = cs(z.object({
    id: Snowflake,
    label: z.string(),
    description: z.string(),
    isDeleted: z.boolean()
}), standardRoute());

export const TaskComment = cs(z.object({
    id: Snowflake,
    user: User.schema,
    postedOn: z.date(),
    content: z.string()
}), standardRoute());

export const UserTask = cs(z.object({
    id: Snowflake,
    taskId: Snowflake,
    assignedUser: User.schema.nullable(),
    startedOn: z.date().nullable(),
    finishedOn: z.date().nullable(),
    comments: z.array(TaskComment.schema)
}), standardRoute());
