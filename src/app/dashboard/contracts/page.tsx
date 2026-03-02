import { ContractGenerator } from "@/components/dashboard/contract-generator";
import { getCandidatesFromSheet } from "@/lib/sheets";

export default async function ContractsPage() {
  const candidates = await getCandidatesFromSheet();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Contract Generation</h1>
        <p className="text-muted-foreground">
          Dynamically create personalized employment contracts using AI.
        </p>
      </header>
      <div className="animate-fade-in">
        <ContractGenerator candidates={candidates} />
      </div>
    </div>
  );
}
