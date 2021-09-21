export interface IUser {
    firstname: string;
    lastname: string;
    _id: string;
    assigned?: ITimeframe[];
}

interface ITimeframe {
    name: string;
    FTID?: string;
    schedule: {
        start: Date;
        end: Date;
    };
}

