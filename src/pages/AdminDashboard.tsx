import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, Save, Search, Shield, Trash2, User, X } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

type AdminUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string | null;
  last_login: string | null;
};

type UserForm = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
};

type ApiMessage = {
  error?: string;
  message?: string;
};

type UserListResponse = ApiMessage & {
  users?: AdminUser[];
};

type UserResponse = ApiMessage & {
  user?: AdminUser;
  welcome_email_sent?: boolean;
};

const emptyForm: UserForm = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  is_active: true,
  is_staff: false,
  is_superuser: false,
};

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

function formatDate(value: string | null) {
  if (!value) return 'Never';
  return new Date(value).toLocaleString();
}

function roleLabel(user: AdminUser) {
  if (user.is_superuser) return 'Superuser';
  if (user.is_staff) return 'Staff';
  return 'User';
}

export default function AdminDashboard() {
  const canAccessAdmin =
    localStorage.getItem('isStaff') === 'true' ||
    localStorage.getItem('isSuperuser') === 'true';
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return users;

    return users.filter((currentUser) => {
      const searchable = [
        currentUser.username,
        currentUser.email,
        currentUser.first_name,
        currentUser.last_name,
        roleLabel(currentUser),
      ].join(' ').toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [query, users]);

  const fetchUsers = async (clearMessage = true) => {
    setIsLoading(true);
    if (clearMessage) setMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_USERS, {
        credentials: 'include',
      });
      const data = await readJson<UserListResponse>(response);

      if (!response.ok) {
        setMessage(data.error || 'Unable to load users.');
        setUsers([]);
        return;
      }

      setUsers(data.users || []);
    } catch {
      setMessage('Network error. Please check your connection and try again.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!canAccessAdmin) return;
    void fetchUsers();
  }, [canAccessAdmin]);

  const openCreateModal = () => {
    setForm(emptyForm);
    setSelectedUser(null);
    setMessage('');
    setModalMode('create');
  };

  const openEditModal = (userToEdit: AdminUser) => {
    setForm({
      username: userToEdit.username,
      email: userToEdit.email,
      first_name: userToEdit.first_name,
      last_name: userToEdit.last_name,
      is_active: userToEdit.is_active,
      is_staff: userToEdit.is_staff,
      is_superuser: userToEdit.is_superuser,
    });
    setSelectedUser(userToEdit);
    setMessage('');
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setForm(emptyForm);
    setIsSaving(false);
  };

  const updateTextField = (
    field: 'username' | 'email' | 'first_name' | 'last_name',
    value: string,
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const updateBooleanField = (
    field: 'is_active' | 'is_staff' | 'is_superuser',
    value: boolean,
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    const userBeingEdited = modalMode === 'edit' ? selectedUser : null;
    const endpoint = userBeingEdited ? API_ENDPOINTS.ADMIN_USER(userBeingEdited.id) : API_ENDPOINTS.ADMIN_USERS;
    const payload = userBeingEdited ? form : { username: form.username, email: form.email };

    try {
      const response = await fetch(endpoint, {
        method: userBeingEdited ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await readJson<UserResponse>(response);

      if (!response.ok) {
        setMessage(data.error || 'Unable to save user.');
        return;
      }

      setMessage(
        modalMode === 'create'
          ? `User created. Welcome email ${data.welcome_email_sent ? 'sent' : 'queued or skipped by email backend'}.`
          : data.message || 'User updated.',
      );
      closeModal();
      await fetchUsers(false);
    } catch {
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (userToDelete: AdminUser) => {
    const confirmed = window.confirm(`Delete ${userToDelete.username}?`);
    if (!confirmed) return;

    setDeletingUserId(userToDelete.id);
    setMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_USER(userToDelete.id), {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await readJson<ApiMessage>(response);

      if (!response.ok) {
        setMessage(data.error || 'Unable to delete user.');
        return;
      }

      setMessage(data.message || 'User deleted.');
      await fetchUsers(false);
    } catch {
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (!canAccessAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white">
        <div className="max-w-md rounded-lg border border-[#262626] bg-[#171717] p-6 text-center">
          <Shield className="mx-auto mb-3 text-[#c88a65]" size={32} />
          <h1 className="text-xl font-bold">Admin Access Required</h1>
          <p className="mt-2 text-sm text-white/60">
            Log in with a staff or superuser account to manage users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-[#262626] pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#c88a65]">Admin Panel</p>
            <h1 className="text-2xl font-bold text-white">Users</h1>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#c88a65] px-4 text-sm font-bold text-black transition hover:bg-[#eab2a0]"
          >
            <Plus size={18} />
            Create User
          </button>
        </header>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={17} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users"
              className="h-10 w-full rounded-lg border border-[#262626] bg-[#111] pl-10 pr-3 text-sm text-white outline-none transition focus:border-[#c88a65]"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-white/55">
            <User size={16} />
            <span>{users.length} total</span>
          </div>
        </div>

        {message && (
          <div className="rounded-lg border border-[#3a302b] bg-[#171717] px-4 py-3 text-sm text-white/80">
            {message}
          </div>
        )}

        <section className="overflow-hidden rounded-lg border border-[#262626] bg-[#111]">
          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="animate-spin text-[#c88a65]" size={30} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead className="border-b border-[#262626] bg-[#171717] text-xs uppercase tracking-wide text-white/45">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold">Last Login</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-white/50">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((currentUser) => (
                      <tr key={currentUser.id} className="bg-[#111] transition hover:bg-[#171717]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c88a65]/15 text-sm font-bold text-[#c88a65]">
                              {currentUser.username.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{currentUser.username}</p>
                              <p className="truncate text-xs text-white/45">{currentUser.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#3a302b] px-2 py-1 text-xs font-semibold text-white/70">
                            <Shield size={13} />
                            {roleLabel(currentUser)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                              currentUser.is_active
                                ? 'bg-emerald-500/10 text-emerald-300'
                                : 'bg-red-500/10 text-red-300'
                            }`}
                          >
                            {currentUser.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-white/55">{formatDate(currentUser.date_joined)}</td>
                        <td className="px-4 py-4 text-xs text-white/55">{formatDate(currentUser.last_login)}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(currentUser)}
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#333] px-3 text-xs font-semibold text-white/75 transition hover:border-[#c88a65] hover:text-white"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(currentUser)}
                              disabled={deletingUserId === currentUser.id}
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-500/25 px-3 text-xs font-semibold text-red-200 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingUserId === currentUser.id ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#333] bg-[#171717] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#c88a65]">
                  {modalMode === 'create' ? 'New Account' : 'Edit Account'}
                </p>
                <h2 className="text-xl font-bold text-white">
                  {modalMode === 'create' ? 'Create User' : selectedUser?.username}
                </h2>
              </div>
              <button
                type="button"
                title="Close"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#333] text-white/60 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-semibold text-white/75">
                  Username
                  <input
                    type="text"
                    value={form.username}
                    onChange={(event) => updateTextField('username', event.target.value)}
                    required
                    className="h-10 rounded-lg border border-[#333] bg-[#0a0a0a] px-3 text-sm text-white outline-none transition focus:border-[#c88a65]"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-semibold text-white/75">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateTextField('email', event.target.value)}
                    required
                    className="h-10 rounded-lg border border-[#333] bg-[#0a0a0a] px-3 text-sm text-white outline-none transition focus:border-[#c88a65]"
                  />
                </label>
              </div>

              {modalMode === 'edit' && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-white/75">
                      First Name
                      <input
                        type="text"
                        value={form.first_name}
                        onChange={(event) => updateTextField('first_name', event.target.value)}
                        className="h-10 rounded-lg border border-[#333] bg-[#0a0a0a] px-3 text-sm text-white outline-none transition focus:border-[#c88a65]"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-white/75">
                      Last Name
                      <input
                        type="text"
                        value={form.last_name}
                        onChange={(event) => updateTextField('last_name', event.target.value)}
                        className="h-10 rounded-lg border border-[#333] bg-[#0a0a0a] px-3 text-sm text-white outline-none transition focus:border-[#c88a65]"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="flex items-center gap-3 rounded-lg border border-[#333] bg-[#0a0a0a] p-3 text-sm font-semibold text-white/75">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(event) => updateBooleanField('is_active', event.target.checked)}
                        className="h-4 w-4 accent-[#c88a65]"
                      />
                      Active
                    </label>

                    <label className="flex items-center gap-3 rounded-lg border border-[#333] bg-[#0a0a0a] p-3 text-sm font-semibold text-white/75">
                      <input
                        type="checkbox"
                        checked={form.is_staff}
                        onChange={(event) => updateBooleanField('is_staff', event.target.checked)}
                        className="h-4 w-4 accent-[#c88a65]"
                      />
                      Staff
                    </label>

                    <label className="flex items-center gap-3 rounded-lg border border-[#333] bg-[#0a0a0a] p-3 text-sm font-semibold text-white/75">
                      <input
                        type="checkbox"
                        checked={form.is_superuser}
                        onChange={(event) => updateBooleanField('is_superuser', event.target.checked)}
                        className="h-4 w-4 accent-[#c88a65]"
                      />
                      Superuser
                    </label>
                  </div>
                </>
              )}

              <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[#333] px-4 text-sm font-semibold text-white/70 transition hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#c88a65] px-4 text-sm font-bold text-black transition hover:bg-[#eab2a0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
                  {modalMode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
