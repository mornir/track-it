export default function latestVisitDate(historyResults = []) {
  const latestVisitSites = historyResults.flat()
  if (latestVisitSites.length === 0) {
    return false
  }

  return latestVisitSites.reduce((prev, current) => {
    return prev.lastVisitTime > current.lastVisitTime ? prev : current
  })
}
