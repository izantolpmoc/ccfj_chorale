import { ChantType } from "./chant-type";

export type PartitionType = {
  id: number;
  partition_id: number;
  chant_type_id: number | null;

  chant_type?: ChantType | null;
};
