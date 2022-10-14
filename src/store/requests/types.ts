import type { Dayjs } from 'dayjs';

export interface Request {
    name: string,
    description: string,
    date: Dayjs | null,
    [key: string]: any
}

export interface RequestError {
    description: string,
    extra: string | Array<string>,
    status: number
}

export interface RequestsState {
    list: Array<Request>,
    item: Request | null,
    count: number,
    limit: number,
    page: number,
    loading: boolean,
    error: RequestError | false
}