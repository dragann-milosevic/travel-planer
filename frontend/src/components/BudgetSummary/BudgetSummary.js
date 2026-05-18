import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ExpenseCategoryLabel } from "../../models/Expense";

const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1", "#0dcaf0"];

function BudgetSummary({ budget, expenses }) {
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const remaining = Number(budget) - totalSpent;
    const percentSpent = budget > 0 ? Math.min(100, (totalSpent / budget) * 100) : 0;

    const categoryData = expenses.reduce((acc, e) => {
        const key = ExpenseCategoryLabel[e.category] || "Ostalo";
        acc[key] = (acc[key] || 0) + Number(e.amount || 0);
        return acc;
    }, {});

    const chartData = Object.entries(categoryData).map(([name, value]) => ({
        name, value
    }));

    const progressClass =
        percentSpent < 70 ? "bg-success" :
        percentSpent < 100 ? "bg-warning" : "bg-danger";

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h5 className="card-title">Pregled budžeta</h5>
                <div className="row align-items-center">
                    <div className="col-md-7">
                        <div className="mb-2 d-flex justify-content-between">
                            <span>Planirani budžet:</span>
                            <strong>{Number(budget).toFixed(2)} €</strong>
                        </div>
                        <div className="mb-2 d-flex justify-content-between">
                            <span>Potrošeno:</span>
                            <strong>{totalSpent.toFixed(2)} €</strong>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <span>Preostalo:</span>
                            <strong className={remaining < 0 ? "text-danger" : "text-success"}>
                                {remaining.toFixed(2)} €
                            </strong>
                        </div>
                        <div className="progress" style={{ height: "1.25rem" }}>
                            <div
                                className={`progress-bar ${progressClass}`}
                                role="progressbar"
                                style={{ width: `${percentSpent}%` }}
                                aria-valuenow={percentSpent}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {percentSpent.toFixed(0)}%
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="45%"
                                        outerRadius={70}
                                        labelLine={false}
                                        label={({ percent }) =>
                                            percent > 0.05
                                                ? `${Math.round(percent * 100)}%`
                                                : ""
                                        }
                                    >
                                        {chartData.map((_, idx) => (
                                            <Cell
                                                key={idx}
                                                fill={COLORS[idx % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v) => `${Number(v).toFixed(2)} €`}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: "12px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-muted small py-4">
                                Nema evidentiranih troškova.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BudgetSummary;