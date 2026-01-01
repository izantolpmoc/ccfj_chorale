export type ProgramPartitionRow = {
    id: number;
    chant_types: {
        id: number;
        name: string;
    } | null;
    partitions: {
        id: number;
        name: string;
        file_path: string | null;
    } | null;
};