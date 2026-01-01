import type { PartitionType } from "./partition-type";

export type Partition = {
    id: number;
    created_at: string;
    name: string | null;
    file_path: string | null;
    added_by: string | null;
    page: number | null;

    partition_types?: PartitionType[];
};
