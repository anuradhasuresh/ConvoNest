import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// import { profileTabs } from "@/constants";

// import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchUser } from "@/lib/actions/user.actions";

async function Page({ params }: { params: { id: string } }) {
  try {
    const user = await currentUser();
    if (!user) return null;

    console.log("Fetching user with ID:", params.id);
    const userInfo = await fetchUser(params.id);
    // console.log("Fetched user info:", userInfo);

    if (!userInfo) return <div>Profile not found</div>;
    if (!userInfo.onboardedStatus) redirect("/onboarding");

    return (
      <section>
        <ProfileHeader
          accountId={userInfo.id}
          authUserId={user.id}
          name={userInfo.name}
          username={userInfo.username}
          imgUrl={userInfo.image}
          bio={userInfo.bio}
        />
      </section>
    );
  } catch (error) {
    console.error("Error in profile page:", error);
    return <div>An error occurred while loading the profile</div>;
  }
}
export default Page;