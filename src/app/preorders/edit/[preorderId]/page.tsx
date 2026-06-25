import { PreorderForm } from "@/src/components/PreorderForm";
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";

interface EditPreorderPageProps {
  params: Promise<{
    preorderId: string;
  }>;
}

export default async function EditPreorderPage({
  params,
}: EditPreorderPageProps) {
  const { preorderId } = await params;

  const preorder = await prisma.preorder.findUnique({
    where: {
      id: preorderId,
    },
  });

  if (!preorder) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Preorder</h1>
        <p className="text-gray-600">Update the preorder details</p>
      </div>

      <PreorderForm initialData={preorder} isEditing />
    </div>
  );
}
