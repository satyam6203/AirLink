import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/Redux/user/userThunks";
import {
  Users,
  Search,
  Shield,
  User,
  Plane,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

/* ─────────────────────── helpers ─────────────────────── */
const ROLE_META = {
  ROLE_SUPER_ADMIN: { label: "Super Admin", color: "bg-purple-100 text-purple-700" },
  ROLE_AIRLINE_ADMIN: { label: "Airline Admin", color: "bg-blue-100 text-blue-700" },
  ROLE_PASSENGER: { label: "Passenger", color: "bg-green-100 text-green-700" },
  ROLE_CUSTOMER: { label: "Customer", color: "bg-teal-100 text-teal-700" },
};

function getRoleMeta(role) {
  return ROLE_META[role] || { label: role || "Unknown", color: "bg-gray-100 text-gray-600" };
}

function formatDate(dateStr) {
  if (!dateStr) return "Never";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

/* ─────────────────────── stat card ─────────────────────── */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`rounded-xl p-4 flex items-center gap-4 ${color}`}>
      <div className="p-3 bg-white/40 rounded-lg">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm opacity-80">{label}</p>
      </div>
    </div>
  );
}

/* ─────────────────────── sort header ─────────────────────── */
function SortHeader({ label, field, sortField, sortDir, onSort }) {
  const active = sortField === field;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <span className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 -mb-1 ${active && sortDir === "asc" ? "text-indigo-600" : "text-gray-300"}`}
          />
          <ChevronDown
            className={`h-3 w-3 ${active && sortDir === "desc" ? "text-indigo-600" : "text-gray-300"}`}
          />
        </span>
      </span>
    </th>
  );
}

/* ─────────────────────── main component ─────────────────────── */
const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, usersLoading, error } = useSelector((s) => s.user);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("fullName");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  /* stats derived from real data */
  const stats = useMemo(() => {
    const total = users.length;
    const passengers = users.filter((u) => u.role === "ROLE_PASSENGER" || u.role === "ROLE_CUSTOMER").length;
    const admins = users.filter((u) => u.role === "ROLE_AIRLINE_ADMIN").length;
    const superAdmins = users.filter((u) => u.role === "ROLE_SUPER_ADMIN").length;
    return { total, passengers, admins, superAdmins };
  }, [users]);

  /* filtered + sorted list */
  const filtered = useMemo(() => {
    let list = [...users];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      );
    }

    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }

    list.sort((a, b) => {
      let av = a[sortField] ?? "";
      let bv = b[sortField] ?? "";
      if (sortField === "lastLogin") {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [users, search, roleFilter, sortField, sortDir]);

  const uniqueRoles = useMemo(() => [...new Set(users.map((u) => u.role).filter(Boolean))], [users]);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            All registered users across the platform
          </p>
        </div>
        <button
          onClick={() => dispatch(getAllUsers())}
          disabled={usersLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
        >
          <RefreshCw className={`h-4 w-4 ${usersLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.total} color="bg-indigo-100 text-indigo-700" />
        <StatCard icon={User} label="Passengers" value={stats.passengers} color="bg-green-100 text-green-700" />
        <StatCard icon={Plane} label="Airline Admins" value={stats.admins} color="bg-blue-100 text-blue-700" />
        <StatCard icon={Shield} label="Super Admins" value={stats.superAdmins} color="bg-purple-100 text-purple-700" />
      </div>

      {/* filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="all">All Roles</option>
          {uniqueRoles.map((r) => (
            <option key={r} value={r}>
              {getRoleMeta(r).label}
            </option>
          ))}
        </select>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {usersLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="h-8 w-8 animate-spin mb-3 text-indigo-400" />
            <p className="text-sm">Loading users…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <p className="font-medium">Failed to load users</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Users className="h-10 w-10 mb-3 opacity-40" />
            <p className="font-medium">No users found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <SortHeader label="Name" field="fullName" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Email" field="email" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <SortHeader label="Last Login" field="lastLogin" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user, idx) => {
                  const roleMeta = getRoleMeta(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs flex-shrink-0">
                            {(user.fullName || user.email || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName || "—"}</p>
                            {user.username && (
                              <p className="text-xs text-gray-400">@{user.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          {user.email || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleMeta.color}`}>
                          {roleMeta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {user.phone || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {formatDate(user.lastLogin)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 text-right">
              Showing {filtered.length} of {users.length} users
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
