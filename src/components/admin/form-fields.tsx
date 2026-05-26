import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FormField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function FormTextarea({
  label,
  name,
  defaultValue,
  rows = 5,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
      />
    </div>
  );
}

export function BilingualPair({
  base,
  label,
  values,
  multiline,
}: {
  base: string;
  label: string;
  values: { id: string; en: string };
  multiline?: boolean;
}) {
  const idName = `${base}Id`;
  const enName = `${base}En`;
  const Field = multiline ? FormTextarea : FormField;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label={`${label} (ID)`} name={idName} defaultValue={values.id} required />
      <Field label={`${label} (EN)`} name={enName} defaultValue={values.en} required />
    </div>
  );
}

export function PublishStatusField({
  defaultValue = "DRAFT",
}: {
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <select
        id="status"
        name="status"
        defaultValue={defaultValue}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </div>
  );
}

export function FormCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 rounded border"
      />
      {label}
    </label>
  );
}
