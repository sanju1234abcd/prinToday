/**
 * Client-side pending order limit guard.
 *
 * Checks if the authenticated user already has 3 or more orders whose
 * payment status is still pending (PENDING or PENDING_VERIFICATION).
 * Call this before any action that would consume Cloudinary quota or
 * add items to the cart, so malicious/accidental flooding is prevented
 * at the same boundary that the server enforces on checkout.
 *
 * Returns:
 *   - null  → user is within the limit, action is allowed
 *   - string → user-friendly error message, action must be blocked
 */

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const PENDING_STATUSES = new Set(['PENDING', 'PENDING_VERIFICATION']);
const MAX_PENDING = 3;

export async function checkPendingOrderLimit(): Promise<string | null> {
  try {
    const res = await fetch(`${API}/orders/my-orders`, {
      method: 'GET',
      credentials: 'include',
    });

    // Not logged in — let normal auth guards handle it
    if (res.status === 401) return null;

    if (!res.ok) return null; // fail open on unexpected server errors

    const json = await res.json();
    const orders: any[] = json?.data ?? [];

    const pendingCount = orders.filter(
      (o) => PENDING_STATUSES.has(o.paymentStatus)
    ).length;

    if (pendingCount >= MAX_PENDING) {
      return (
        `You have ${pendingCount} unpaid order${pendingCount > 1 ? 's' : ''} pending payment. ` +
        `Please complete payment for your existing orders before placing new ones. ` +
        `Contact us at 9432954099 if you need help.`
      );
    }

    return null;
  } catch {
    // Network failure — fail open so genuine users are not blocked
    return null;
  }
}
