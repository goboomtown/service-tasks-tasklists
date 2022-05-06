export interface Task {
    ID: number,
    name?: string,
    description?: string,
    due_datetime?: string,
    completed?: boolean,
    deleted?: boolean
}