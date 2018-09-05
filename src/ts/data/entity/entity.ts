export interface AuthRoute {
    /** test */
    id: number;
    className: string;
    name: string;
    order: number;
    parentId: number;
    path: string[];
    type: number;
}

export interface Word {
    id: number;
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
