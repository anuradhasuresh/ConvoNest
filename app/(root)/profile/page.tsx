import { redirect } from 'next/navigation';
import { currentUser } from "@clerk/nextjs/server";

export default async function DefaultProfilePage() {
  try {
    const user = await currentUser();
    if (!user) {
      redirect('/sign-up');
    }

    // Redirect to the user's profile page
    redirect(`/profile/${user.id}`);
  } catch (error) {
    throw new Error(`Error in profile redirect: $(error.message)`)
  }
}