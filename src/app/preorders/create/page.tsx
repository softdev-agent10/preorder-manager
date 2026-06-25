import { PreorderForm } from "@/src/components/PreorderForm";


export default function CreatePreorderPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Preorder</h1>
        <p className="text-gray-600">Add a new preorder to the system</p>
      </div>
      <PreorderForm />
    </div>
  );
}
