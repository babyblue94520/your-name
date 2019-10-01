export interface AuthRoute {
    /** test */
    id: number;
    className: string;
    name: string;
    parentId: number;
    path: string[];
    type: number;
    sort: number;
    active?: boolean;
}

export interface Word {
    num: number;
    word: string;
    sound: string;
    content: string;
    type: string;
}

export interface Fortune {
    id: number;
    num: number;
    name: string;
    content: string;
    type: string;
    luck: string;
}
