function getLatestVisitedSite(historyResults = []) {
  const latestVisitSites = historyResults.flat()
  if (latestVisitSites.length === 0) {
    return false
  }

  return latestVisitSites.reduce((prev, current) => {
    return prev.lastVisitTime > current.lastVisitTime ? prev : current
  })
}

function getLongestStreak(historyResults = []) {
  const latestVisitSites = historyResults.flat()
  if (latestVisitSites.length === 0) {
    return false
  }

  const timestamps = latestVisitSites
    .map(item => item.visitTime)
    .sort((a, b) => a - b)

  let streak = {
    diff: 0,
    firstTimestamp: 0,
    secondTimestamp: 0,
    startDate: timestamps[0],
  }

  for (let i = 0; i < timestamps.length; i++) {
    const currentTimestamp = timestamps[i]
    const nextTimestamp = timestamps[i + 1]

    const diff = nextTimestamp - currentTimestamp
    if (diff > streak.diff) {
      streak.diff = diff
      streak.firstTimestamp = currentTimestamp
      streak.secondTimestamp = nextTimestamp
    }
  }

  return streak
}

export { getLatestVisitedSite, getLongestStreak }