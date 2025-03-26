import { api } from "@/trpc/react";

export default function SchwabAccounts() {
    const { data: accounts } = api.schwab.getAccounts.useQuery();   

    return (
        <div>
            <h1>Schwab Accounts</h1>
            {accounts?.map((account) => (
                <div 
                    key={account.securitiesAccount.accountNumber}
                    className="p-4 mb-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-700">Account {account.securitiesAccount.accountNumber}</h2>
                        <p className="text-xl font-semibold text-gray-900">
                            ${account.securitiesAccount.initialBalances.accountValue.toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}   