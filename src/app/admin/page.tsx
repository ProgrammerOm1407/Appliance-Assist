
import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to the orders page by default when accessing /admin
  redirect('/admin/orders');
}
