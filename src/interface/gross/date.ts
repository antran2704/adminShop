import { IGross } from "./index";

interface IGrossDate extends IGross {
  day: string;
  month: string;
  year: string;
}

export type { IGrossDate };
