// Stub auth hook for marketing site - no authentication needed
export type UserRole = "admin" | "supplier" | "buyer" | "support";

export function useAuth() {
  return {
    user: null,
    roles: [] as UserRole[],
    hasRole: (_role: UserRole) => false,
    loading: false,
    sessionChecked: true,
  };
}
