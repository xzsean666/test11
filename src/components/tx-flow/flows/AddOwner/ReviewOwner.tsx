import { useCurrentChain } from '@/hooks/useChains'
import { useContext, useEffect } from 'react'

import SignOrExecuteForm from '@/components/tx/SignOrExecuteForm'
import useSafeInfo from '@/hooks/useSafeInfo'
import { trackEvent, SETTINGS_EVENTS } from '@/services/analytics'
import { createSwapOwnerTx, createAddOwnerTx } from '@/services/tx/tx-sender'
import { useAppDispatch } from '@/store'
import { upsertAddressBookEntries } from '@/store/addressBookSlice'
import { SafeTxContext } from '../../SafeTxProvider'
import type { AddOwnerFlowProps } from '.'
import type { ReplaceOwnerFlowProps } from '../ReplaceOwner'
import { SettingsChangeContext } from './context'

export const ReviewOwner = ({ params }: { params: AddOwnerFlowProps | ReplaceOwnerFlowProps }) => {
  const dispatch = useAppDispatch()
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext)
  const { safe } = useSafeInfo()
  const { chainId } = safe
  const chain = useCurrentChain()
  const { newOwner, removedOwner, threshold } = params

  useEffect(() => {
    if (!chain) return

    const promise = removedOwner
      ? createSwapOwnerTx(chain, safe.deployed, {
          newOwnerAddress: newOwner.address,
          oldOwnerAddress: removedOwner.address,
        })
      : createAddOwnerTx(chain, safe.deployed, {
          ownerAddress: newOwner.address,
          threshold,
        })

    promise.then(setSafeTx).catch(setSafeTxError)
  }, [removedOwner, newOwner, threshold, setSafeTx, setSafeTxError, chain, safe.deployed])

  const addAddressBookEntryAndSubmit = () => {
    if (typeof newOwner.name !== 'undefined') {
      dispatch(
        upsertAddressBookEntries({
          chainIds: [chainId],
          address: newOwner.address,
          name: newOwner.name,
        }),
      )
    }

    trackEvent({ ...SETTINGS_EVENTS.SETUP.THRESHOLD, label: safe.threshold })
    trackEvent({ ...SETTINGS_EVENTS.SETUP.OWNERS, label: safe.owners.length })
  }

  return (
    <SettingsChangeContext.Provider value={params}>
      <SignOrExecuteForm onSubmit={addAddressBookEntryAndSubmit} showMethodCall />
    </SettingsChangeContext.Provider>
  )
}
