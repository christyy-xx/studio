import { ContractGenerator } from "@/components/dashboard/contract-generator";

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Contract Generation</h1>
        <p className="text-muted-foreground">
          Dynamically create personalized employment contracts using AI.
        </p>
      </header>
      <div className="animate-fade-in">
        <ContractGenerator />
      </div>
    </div>
  );
}
