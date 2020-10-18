import {
  getLatestVisitTime,
  getLongestStreak,
} from '../../src/utils/getHistoryFunctions'
import historyItems from '../fixtures/historyItems.json'
import visitItems from '../fixtures/visitItems.json'

it('returns false if there are no history results', () => {
  expect(getLatestVisitTime()).toBe(false)
  expect(getLatestVisitTime([Array(0), Array(0), Array(0)])).toBe(false)
})

it('returns the latest visited site among the provided urls', () => {
  expect(getLatestVisitTime(historyItems).id).toBe('31583')
})

it('verifies the properties of the streak object', () => {
  const {
    firstTimestamp,
    secondTimestamp,
    startOfRecording,
    diff,
  } = getLongestStreak(visitItems)
  expect(startOfRecording).toBe(1594125399723.5461)
  expect(firstTimestamp).toBe(1600447529443.713)
  expect(secondTimestamp).toBe(1601383980119.988)
  expect(secondTimestamp - firstTimestamp).toBe(diff)
  expect(diff).toBe(936450676.2751465)
})
