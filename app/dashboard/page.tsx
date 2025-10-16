import { redirect } from 'next/navigation';

export default async function Dashboard() {
const userId=null;
  if (!userId) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
