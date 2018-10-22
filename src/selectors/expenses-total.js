export default (expenses) => expenses
    .map((exp) => exp.amount)
    .reduce((acc, exp) => acc + exp, 0)
