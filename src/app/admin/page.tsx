import { redirect } from 'next/navigation';

export default function AdminPage() {
  // For this simple app, redirect directly to the orders page.
  // In a more complex app, this could be a dashboard.
  redirect('/admin/orders');
  
  // return (
  //   <div>
  //     <h1 className="text-2xl font-bold">Admin Dashboard</h1>
  //     <p>Welcome to the admin area.</p>
  //     <Link href="/admin/orders">Manage Orders</Link>
  //   </div>
  // );
}
