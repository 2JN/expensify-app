import React from 'react'
import { connect } from 'react-redux'

import ExpenseForm from './ExpenseForm'
import { editExpense, startRemoveExpense } from '../actions/expenses'

export class EditExpensePage extends React.Component {
  onSubmit = (expense) => {
    this.props.editExpense(this.props.expense, expense)
    this.props.history.push('/')
  }

  onClick = (e) => {
    this.props.startRemoveExpense({ id: this.props.expense.id })
    this.props.history.push('/')
  }

  render() {
    return (
      <div>
        <ExpenseForm
          expense={this.props.expense}
          onSubmit={this.onSubmit}
        />
        <button
          onClick={this.onClick}
        >
          remove
        </button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  editExpense: (expense, update) =>
    dispatch(editExpense(expense, update)),
  startRemoveExpense: (expense) => dispatch(startRemoveExpense( expense ))
})

const mapStateToProps = (state, props) => {
  return {
    expense: state.expenses.find((expense) =>
      expense.id === props.match.params.id
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditExpensePage)
