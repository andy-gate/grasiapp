"use client";

import { createUser, updateUser } from "@/actions/admin/users";
import { AdminForm } from "@/components/admin/admin-form";
import { FormCheckbox, FormField } from "@/components/admin/form-fields";
import type { Role, User } from "@/generated/prisma/client";

export function UserForm({
  user,
  roles,
  selectedRoleIds,
}: {
  user?: User;
  roles: Role[];
  selectedRoleIds?: string[];
}) {
  const action = user ? updateUser.bind(null, user.id) : createUser;

  return (
    <AdminForm action={action} cancelHref="/admin/users">
      <FormField
        label="Email"
        name="email"
        type="email"
        defaultValue={user?.email}
        required
      />
      <FormField
        label="Username"
        name="username"
        defaultValue={user?.username}
        hint="3–32 karakter: huruf kecil, angka, underscore"
        required
      />
      <FormField label="Nama" name="name" defaultValue={user?.name} required />
      <FormField
        label={user ? "Password baru (opsional)" : "Password"}
        name="password"
        type="password"
        required={!user}
      />
      <FormCheckbox
        label="Akun aktif"
        name="isActive"
        defaultChecked={user?.isActive ?? true}
      />
      <fieldset className="space-y-3 rounded-lg border p-4">
        <legend className="px-1 text-sm font-medium">Role</legend>
        {roles.map((role) => (
          <label key={role.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="roleIds"
              value={role.id}
              defaultChecked={selectedRoleIds?.includes(role.id)}
              className="size-4 rounded border"
            />
            <span>
              {role.name}{" "}
              <span className="text-muted-foreground">({role.slug})</span>
            </span>
          </label>
        ))}
      </fieldset>
    </AdminForm>
  );
}
