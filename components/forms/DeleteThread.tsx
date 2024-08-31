"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { deleteConvo } from "@/lib/actions/convo.actions";
import { useState } from "react";

interface Props {
  convoId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  convoId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const [showAlert, setShowAlert] = useState(false);

  if (currentUserId !== authorId || pathname === "/") return null;

  const handleDelete = async () => {
    await deleteConvo(JSON.parse(convoId), pathname);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
  };

  return (
    <div className="relative">
      <Image
        src='/assets/delete.svg'
        alt='delete'
        width={18}
        height={18}
        className='cursor-pointer object-contain'
        onClick={handleDelete}
      />
      {showAlert && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          Thread deleted successfully!
        </div>
      )}
    </div>
  );
}

export default DeleteThread;