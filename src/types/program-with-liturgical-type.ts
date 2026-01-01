export type ProgramWithLiturgicalTime = {
    id: number;
    date: string;
    liturgical_times: {
        name: string;
        year_cycle: string;
    } | null;
};