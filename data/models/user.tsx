// export interface User {
//     id: string | number
//     userName: string
// }
import {z} from "zod";
import {standardRoute } from "../schema";
import cs from "../schema";
import { Snowflake } from "./base";

/*
id            Int       @id @default(autoincrement())
name          String?
email         String?   @unique
image         String?

canCreateCatalogedItems Boolean @default(false)
canEditCatalogedItems   Boolean @default(false)
canDeleteCatalogedItems Boolean @default(false)
canViewCatalogedItems   Boolean @default(true)
canCreateCatalogedTasks Boolean @default(false)
canEditCatalogedTasks   Boolean @default(false)
canDeleteCatalogedTasks Boolean @default(false)
canViewCatalogedTasks   Boolean @default(true)
canCreateAddresses Boolean @default(false)
canEditAddresses   Boolean @default(false)
canDeleteAddresses Boolean @default(false)
canViewAddresses   Boolean @default(true)
canCreateOrders Boolean @default(false)
canEditOrders   Boolean @default(false)
canViewOrders   Boolean @default(false)
canForceStartTasks          Boolean @default(false)
canUploadDocuments          Boolean @default(false)
canMakeTaskComments         Boolean @default(false)
canMarkForeignTasksComplete Boolean @default(false)
canCreateOrderItems         Boolean @default(false)
canEditOrderItems           Boolean @default(false)
canViewOrderFinancials      Boolean @default(false)

canViewReports Boolean @default(false)
canCreateUsers Boolean @default(false)
canEditUsers   Boolean @default(false)
canDeleteUsers Boolean @default(false)

createdOrders    Order[]
assignedTasks    UserTask[]
userTaskComments UserTaskComment[]
listenedTasks    CatalogedTask[]
}
*/

export const UserPermissions = cs(z.object({
    canCreateCatalogedItems: z.boolean(),
    canEditCatalogedItems: z.boolean(),
    canDeleteCatalogedItems: z.boolean(),
    canViewCatalogedItems: z.boolean(),
    canCreateCatalogedTasks: z.boolean(),
    canEditCatalogedTasks: z.boolean(),
    canDeleteCatalogedTasks: z.boolean(),
    canViewCatalogedTasks: z.boolean(),
    canCreateAddresses: z.boolean(),
    canEditAddresses: z.boolean(),
    canDeleteAddresses: z.boolean(),
    canViewAddresses: z.boolean(),
    canCreateOrders: z.boolean(),
    canEditOrders: z.boolean(),
    canViewOrders: z.boolean(),
    canForceStartTasks: z.boolean(),
    canUploadDocuments: z.boolean(),
    canMakeTaskComments: z.boolean(),
    canMarkForeignTasksComplete: z.boolean(),
    canCreateOrderItems: z.boolean(),
    canEditOrderItems: z.boolean(),
    canViewOrderFinancials: z.boolean(),
    canViewReports: z.boolean(),
    canCreateUsers: z.boolean(),
    canEditUsers: z.boolean(),
    canDeleteUsers: z.boolean(),
}), standardRoute(["get", "post"], undefined, "/permissions"), null);

export const User = cs(z.object({
    id: Snowflake,
    name: z.string().nullable(),
    email: z.string().email().nullable(),
    image: z.string().nullable(),
    permissions: UserPermissions.schema
}), standardRoute(), null); // TODO User.createNew

type name = string;
type id = string;
export type UserSelectOptions = {label: name, value: id}[];