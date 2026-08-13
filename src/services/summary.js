function buildSummary(expenses) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = {};
  for (const e of expenses) {
    const cat = e.category || 'uncategorized';
    byCategory[cat] = (byCategory[cat] || 0) + e.amount;
  }

  return { total, count: expenses.length, byCategory };
}

function buildMonthlySummary(expenses, budgets = {}) {
  const byMonth = {};
  for (const e of expenses) {
    if (!e.date) continue;
    const month = e.date.slice(0, 7); // YYYY-MM
    byMonth[month] = (byMonth[month] || 0) + e.amount;
  }

  const result = {};
  for (const [month, total] of Object.entries(byMonth)) {
    const budget = budgets[month];
    result[month] = {
      total,
      budget: budget ?? null,
      overBudget: budget !== undefined ? total > budget : null,
    };
  }
  return result;
}

module.exports = { buildSummary, buildMonthlySummary };
