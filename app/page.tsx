"use client"
import { useAuth } from '@/context/authContext';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const {isAuthenticated}=useAuth()
   isAuthenticated? redirect('/dashboard/overview'):redirect('/auth/sign-in')
}
