import { redirect } from 'next/navigation';
import { currentUser } from "@clerk/nextjs/server";

export default async function DefaultProfilePage() {
  const user = await currentUser();
  if (!user) return null;

  // Redirect to the user's profile page
  redirect(`/profile/${user.id}`);
}