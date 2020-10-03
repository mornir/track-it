import getLatestVisitedSite from '../../src/utils/getLatestVisitedSite'
import historySearch from '../fixtures/historySearch.json'

it('returns false if there are no history results', () => {
  expect(getLatestVisitedSite()).toBe(false)
  expect(getLatestVisitedSite([Array(0), Array(0), Array(0)])).toBe(false)
})

it('returns the latest visited site among the provided urls', () => {
  expect(getLatestVisitedSite(historySearch).id).toBe('31583')
})
