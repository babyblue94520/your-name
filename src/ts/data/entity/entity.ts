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

export interface CompanyFortune {
    num: number;
    name: string;
    content: string;
    type: string;
    luck: string;
}


export interface NameFortune {
    num: string;
    type: string;
    luck: string;
    content: string;
}

export interface NameNumFortune {
    num: number;
    luck: string;
    content: string;
}
