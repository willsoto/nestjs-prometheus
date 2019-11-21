import { Inject } from "@nestjs/common";
import { getToken } from "./metrics";

export function InjectMetric(name: string) {
  const token = getToken(name);

  return Inject(token);
}
