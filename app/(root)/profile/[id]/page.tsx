import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";

import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className='mt-9'>
          <Tabs defaultValue='convos' className='w-full'>
            <TabsList className='tab'>
              {profileTabs.map((tab) => (
                <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                  <p className='max-sm:hidden'>{tab.label}</p>

                  {tab.label === "Convos" && (
                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {userInfo.convos.length}
                    </p>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
              {profileTabs.map((tab) => (
              <TabsContent
                key={`content-${tab.label}`}
                value={tab.value}
                className='w-full text-light-1'
              >
                {/* @ts-ignore */}
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType='User'
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in profile page:", error);
    return <div>An error occurred while loading the profile</div>;
  }
}
export default Page;