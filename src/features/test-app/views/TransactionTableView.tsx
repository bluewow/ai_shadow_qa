export interface Transaction {
  orderId: string;
  customer: string;
  status: "paid" | "failed" | "pending";
  amount: string;
}

export interface TransactionTableViewProps {
  transactions: Transaction[];
  onFailedRowClick?: (orderId: string) => void;
}

const statusStyles = {
  paid: "bg-green-500/10 text-green-500",
  failed: "bg-red-500/10 text-red-500",
  pending: "bg-slate-700 text-slate-400",
};

export function TransactionTableView({
  transactions,
  onFailedRowClick,
}: TransactionTableViewProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white">
          Recent Transactions
        </h3>
        <span className="text-xs text-slate-400">
          Showing last {transactions.length} activities
        </span>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="px-4 py-3 font-medium">Order ID</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="text-slate-200">
          {transactions.map((tx) => (
            <tr
              key={tx.orderId}
              className={`border-b border-slate-700/50 ${
                tx.status === "failed"
                  ? "bg-red-500/5 cursor-pointer hover:bg-red-500/10 transition-colors"
                  : ""
              }`}
              onClick={
                tx.status === "failed"
                  ? () => onFailedRowClick?.(tx.orderId)
                  : undefined
              }
            >
              <td
                className={`px-4 py-3 ${
                  tx.status === "failed"
                    ? "font-medium text-red-400"
                    : ""
                }`}
              >
                {tx.orderId}
              </td>
              <td className="px-4 py-3">{tx.customer}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${statusStyles[tx.status]}`}
                >
                  {tx.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 bg-slate-800/80">
        <div className="w-full h-32 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
          <span className="text-slate-500 text-xs italic">
            Chart Visualization: Checkout Flow Performance
          </span>
        </div>
      </div>
    </div>
  );
}
