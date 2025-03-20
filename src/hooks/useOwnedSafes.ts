import { useMemo } from 'react'
import { type OwnedSafes } from '@safe-global/safe-gateway-typescript-sdk'

import useWallet from '@/hooks/wallets/useWallet'
import useChainId from './useChainId'
import { useGetOwnedSafesQuery } from '@/store/slices'
import { skipToken } from '@reduxjs/toolkit/query'

type OwnedSafesCache = {
  [walletAddress: string]: {
    [chainId: string]: OwnedSafes['safes']
  }
}

const useOwnedSafes = (): OwnedSafesCache['walletAddress'] => {
  const chainId = useChainId()
  const { address: walletAddress } = useWallet() || {}

  const { data: ownedSafes } = useGetOwnedSafesQuery(walletAddress ? { chainId, walletAddress } : skipToken)

  const result = useMemo(() => ({ [chainId]: ownedSafes?.safes ?? [] }), [chainId, ownedSafes])

  return result ?? {}
}

export default useOwnedSafes
