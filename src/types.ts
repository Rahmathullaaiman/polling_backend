/* eslint-disable prettier/prettier */
export type IUser = {
    id?: string;
    username?: string;
    password?: string;
    role?: string;
    permissions?: Record<string, any>;
};

export type IPoll = {
    id?: string;
    title: string;
    options: string[];
    votes: Record<string, string[]>;
    visibility: 'public' | 'private';
    allowedUsers: string[];
    createdBy: string;
    expiresAt: Date;
    duration: number;
};

export type IVoteResult = {
    id: string;
    title: string;
    options: string[];
    visibility: 'public' | 'private';
    isExpired: boolean;
    results: Record<string, number>;
};

export interface ICreatePollDto {
    title: string;
    options: string[];
    duration: number;
    visibility: 'public' | 'private';
    allowedUsers?: string[];
}

export interface IVoteDto {
    option: string;
}

export interface IUpdatePollDto {
    title?: string;
    options?: string[];
    duration?: number;
    visibility?: 'public' | 'private';
    allowedUsers?: string[];
}
