import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  startAddExpense,
  addExpense,
  editExpense,
  removeExpense,
  setExpenses,
  startSetExpenses,
  startRemoveExpense,
  startEditExpense
} from '../../actions/expenses'
import db from '../../firebase/firebase'
import expenses from '../fixtures/expenses'

const createMockStore = configureMockStore([ thunk ])

beforeEach(done => {
  const expensesData = {}

  expenses.forEach(({ id, description, note, amount, createdAt }) => {
    expensesData[id] = { description, note, amount, createdAt }
  })

  db.ref('expenses').set(expensesData).then( () => done() )
})

test('should setup remove expense action object', () => {
  const action = removeExpense({ id: '123abc'})
  expect(action).toEqual({
    type: 'REMOVE_EXPENSE',
    id: '123abc'
  })
})

test('should setup edit expense action object', () => {
  const action = editExpense(
    { id: '123abc' },
    { description: 'abc', amount: 10 }
  )
  expect(action).toEqual({
    type: 'EDIT_EXPENSE',
    id: '123abc',
    updates: { description: 'abc', amount: 10 }
  })
})

test('should setup add expense action object with provided values', () => {
  const action = addExpense(expenses[2])
  expect(action).toEqual({
    type: 'ADD_EXPENSE',
    expense: expenses[2]
  })
})

test('should add expense to database and store', (done) => {
  const store = createMockStore({})
  const expenseData = {
    description: 'Mouse',
    amount: 3000,
    note: 'This one is better',
    createdAt: 1000
  }

  store.dispatch(startAddExpense(expenseData))
    .then(() => {
      const actions = store.getActions()
      expect(actions[0]).toEqual({
        type:'ADD_EXPENSE',
        expense: {
          id: expect.any(String),
          ...expenseData
        }
      })

      return db.ref(`expenses/${actions[0].expense.id}`).once('value')
    })
  .then((snapshot) => {
    expect(snapshot.val()).toEqual(expenseData)
    done()
  })
})

test('should add expense with defaults to database store', (done) => {
  const store = createMockStore({})
  const expenseDefault = {
    description: '',
    amount: 0,
    note: '',
    createdAt: 0
  }

  store.dispatch(startAddExpense({}))
    .then(() => {
      const actions = store.getActions()
      expect(actions[0]).toEqual({
        type:'ADD_EXPENSE',
        expense: {
          id: expect.any(String),
          ...expenseDefault
        }
      })

      return db.ref(`expenses/${actions[0].expense.id}`).once('value')
    })
  .then((snapshot) => {
    expect(snapshot.val()).toEqual(expenseDefault)
    done()
  })
})

test('should setup set expense action object with data', () => {
  const action = setExpenses(expenses)
  expect(action).toEqual({
    type: 'SET_EXPENSES',
    expenses
  })
})

test('should fetch the expenses from firebase', (done) => {
  const store = createMockStore({})
  store.dispatch(startSetExpenses())
    .then(() => {
      const actions = store.getActions()
      expect(actions[0]).toEqual({
        type: 'SET_EXPENSES',
        expenses
      })
    
      done()
    })
})

test('should remove expenses from firebase', (done) => {
  const store = createMockStore({})
  store.dispatch(startRemoveExpense({ id: 3 }))
    .then(() => {
      const actions = store.getActions({})
      expect(actions[0]).toEqual({
        type: 'REMOVE_EXPENSE',
        id: 3
      })

      return db.ref('expenses/3').once('value')
    })
    .then((snapshot) => {
      expect(snapshot.val()).toBeFalsy()

      done()
    })
})

test('should update expenses from firebase', (done) => {
  const store = createMockStore({})
  const updates = {
    description: 'electricity',
    note: 'electricity bill',
    amount: 2000,
  }
    store.dispatch(startEditExpense({ id: 2 }, updates))
    .then(() => {
      const actions = store.getActions({})
      expect(actions[0]).toEqual({
        type: 'EDIT_EXPENSE',
        id:2,
        updates
      })

      return db.ref('expenses/2').once('value')
    })
    .then((snapshot) => {
      Object.keys(updates).forEach((key) => {
        expect( snapshot.val()[key] ).toEqual( updates[key] )
      })

      done()
    })
})
