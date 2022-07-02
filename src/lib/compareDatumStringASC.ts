const compareDatumStringASC = (a: string, b: string) => {
  const aSplitted = a.split('.')
  const bSplitted = b.split('.')

  if (aSplitted[2] < bSplitted[2]) {
    return -1
  }

  if (aSplitted[2] > bSplitted[2]) {
    return 1
  }

  if (aSplitted[1] < bSplitted[1]) {
    return -1
  }

  if (aSplitted[1] > bSplitted[1]) {
    return 1
  }

  if (aSplitted[0] < bSplitted[0]) {
    return -1
  }

  if (aSplitted[0] > bSplitted[0]) {
    return 1
  }

  return 0
}

export default compareDatumStringASC
