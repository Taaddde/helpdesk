export interface TodoItem {
    id?: number;
    numTodo?: number;
    _id?: string;
    title?: string;
    note?: string;
    response?: string;
    important?: boolean;
    starred?: boolean;
    done?: boolean;
    read?: boolean;
    selected?: boolean;
    startDate?: string;
    dueDate?: string;
    tags?: string[];
    team?: string;
    users?: string[];
    usersWhoRead? : string[];
    files?: string[];
    company?: string;
    userCreate?: string;
}

export interface TagItem {
    id?: number;
    name?: string;
}