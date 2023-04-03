import * as React from 'react'
import { ClipLoader } from 'react-spinners'

export function Spinner() {
  return <ClipLoader
    color={'#333'}
    loading={true}
    cssOverride={{
      borderColor: '#6723f0',
    }}
    size="15"
    data-testid="loader"
  />
}
