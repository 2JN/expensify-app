import moment from 'moment'

export let filters = {
  text: '',
  sortBy: 'date',
  startDate: undefined,
  endDate: undefined
}

export let altFilters = {
  text: 'bills',
  sortBy: 'amount',
  startDate: moment(0),
  endDate: moment(0).add(3, 'days')
}
