import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation'

async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    // console.log("User info from database:", userInfo);
    if (!userInfo?.onboardedStatus) redirect("/onboarding");

    return (
    <>
        <h1 className="head-text">Create Convo</h1>
        <PostThread userId = {userInfo._id} />
    </>
    )
}
export default Page;