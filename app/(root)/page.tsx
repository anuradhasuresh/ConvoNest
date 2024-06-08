import { ClerkProvider, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <ClerkProvider>
        <UserButton afterSignOutUrl="/" />
      </ClerkProvider>
    </div>
  )
}