function buildSummary(expenses) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = {};
  for (const e of expenses) {
    const cat = e.category || 'uncategorized';
    byCategory[cat] = (byCategory[cat] || 0) + e.amount;
  }

  return { total, count: expenses.length, byCategory };
}

function buildMonthlySummary(expenses) {
  const byMonth = {};
  for (const e of expenses) {
    if (!e.date) continue;
    const month = e.date.slice(0, 7); // YYYY-MM
    byMonth[month] = (byMonth[month] || 0) + e.amount;
  }
  return byMonth;
}

module.exports = { buildSummary, buildMonthlySummary };
