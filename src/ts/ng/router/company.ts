
export enum CompanyRouteName {
    Name = 'name',
    Find = 'find',
    Description = 'description',
    Rule = 'rule',
}

export interface CompanyRoute {
    Name: string[];
    Find: string[];
    Description: string[];
    Rule: string[];
}
