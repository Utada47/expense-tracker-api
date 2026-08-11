function validateExpenseInput(body) {
  const { amount, description, category } = body;

  if (typeof amount !== 'number') {
    return 'amount (number) is required';
  }
  if (!description) {
    return 'description is required';
  }
  if (category !== undefined && typeof category !== 'string') {
    return 'category must be a string';
  }
  return null;
}

function validateExpenseUpdate(body) {
  if (body.amount !== undefined && typeof body.amount !== 'number') {
    return 'amount must be a number';
  }
  if (body.category !== undefined && typeof body.category !== 'string') {
    return 'category must be a string';
  }
  return null;
}

module.exports = { validateExpenseInput, validateExpenseUpdate };
