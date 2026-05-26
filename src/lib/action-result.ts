export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export function fail(error: string): ActionResult {
  return { ok: false, error };
}
