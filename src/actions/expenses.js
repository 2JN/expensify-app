import db from '../firebase/firebase'

export const addExpense = (expense) => ({
  type: 'ADD_EXPENSE',
  expense
})

export const startAddExpense = ({
  description = '',
  note = '',
  amount = 0,
  createdAt = 0
}) => (dispatch, getState) => {
  const expense = { description, note, amount, createdAt }
  const uid = getState().auth.uid

  return db.ref(`users/${uid}/expenses`).push(expense)
    .then((ref) => {
      dispatch( addExpense({
        id: ref.key,
        ...expense
      }) )
    })
}

export const removeExpense = ({ id }) => ({
  type: 'REMOVE_EXPENSE',
  id
})

export const startRemoveExpense = ({ id }) => (dispatch, getState) => {
  const uid = getState().auth.uid

  return db.ref(`users/${uid}/expenses/${id}`).remove()
    .then(dispatch( removeExpense({ id }) ))
}

export const editExpense = ({ id }, updates) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates
})

export const startEditExpense = ({id}, updates) => (dispatch, getState) => {
  const uid = getState().auth.uid
  return db.ref(`/users/${uid}/expenses/${id}`).update(updates)
    .then(dispatch( editExpense({id}, updates) ))
}

export const setExpenses = (expenses) => ({
  type: 'SET_EXPENSES',
  expenses
})

export const startSetExpenses = () => (dispatch, getState) => {
  const uid = getState().auth.uid

  return db.ref(`users/${uid}/expenses`).once('value')
    .then(snapshot => {
      const expenses = []

      snapshot.forEach(expense => {
        expenses.push({
          id: expense.key,
          ...expense.val()
        })
      })

      dispatch( setExpenses(expenses) )
    })
}
