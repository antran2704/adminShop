import { IGross } from "./index";

interface IGrossMonth extends IGross {
  month: string;
  year: string;
}

export type { IGrossMonth };
