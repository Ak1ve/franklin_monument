import { User } from "./User"


export interface CatalogedTask {
    id: string | number
    label: string
    description: string
    isDeleted: boolean
}

export interface TaskComment {
    id: string | number
    user: User
    postedOn: Date
    content: string
}

export interface UserTask {
    id: number
    taskId: number
    assignedUser: Optional<User> // TODO edit field in databse
    startedOn: Optional<Date>
    finishedOn: Optional<Date>
    comments: TaskComment[]
}