import { z } from "zod";
import { standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake, deletedDate } from "./base";
import { User } from "./user";


const CatalogedTaskType = z.object({
    id: Snowflake,
    label: z.string(),
    description: z.string(),
    collation: z.number(),
    triggersAfter: z.array(
        z.object({
            id: Snowflake,
            label: z.string(),
            description: z.string(),
            collation: z.number(),
            // No triggersAfter
            triggersAtBeginning: z.boolean(),
            triggersAfterAllTasks: z.boolean(),
            deleted: deletedDate
        })
    ),
    triggersAtBeginning: z.boolean(),
    triggersAfterAllTasks: z.boolean(),
    deleted: deletedDate,
});

// TODO nulls
export const CatalogedTask = cs(CatalogedTaskType, standardRoute(), null);

export const TaskComment = cs(z.object({
    id: Snowflake,
    user: User.schema,
    postedOn: z.date(),
    content: z.string()
}), standardRoute(), null);

export const UserTask = cs(z.object({
    id: Snowflake,
    taskId: Snowflake,
    assignedUser: User.schema.nullable(),
    startedOn: z.date().nullable(),
    finishedOn: z.date().nullable(),
    comments: z.array(TaskComment.schema)
}), standardRoute(), null);


