import WalletRejectionError from '@/components/tx/SignOrExecuteForm/WalletRejectionError'
import { isWalletRejection } from '@/utils/wallets'
import { type ReactElement, type SyntheticEvent, useContext, useState } from 'react'
import { Box, Button, CardActions, CircularProgress, Divider, Typography } from '@mui/material'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import CheckWallet from '@/components/common/CheckWallet'
import { TxModalContext } from '@/components/tx-flow'
import commonCss from '@/components/tx-flow/common/styles.module.css'
import { TxSecurityContext } from '@/components/tx/security/shared/TxSecurityContext'
import { useTxActions } from '@/components/tx/SignOrExecuteForm/hooks'
import type { SignOrExecuteProps } from '@/components/tx/SignOrExecuteForm/SignOrExecuteForm'
import useWallet from '@/hooks/wallets/useWallet'
import { Errors, trackError } from '@/services/exceptions'
import { asError } from '@/services/exceptions/utils'
import madProps from '@/utils/mad-props'
import Stack from '@mui/system/Stack'

export const ProposerForm = ({
  safeTx,
  origin,
  disableSubmit = false,
  txActions,
  txSecurity,
  onSubmit,
}: SignOrExecuteProps & {
  txActions: ReturnType<typeof useTxActions>
  txSecurity: ReturnType<typeof useTxSecurityContext>
  safeTx?: SafeTransaction
}): ReactElement => {
  // Form state
  const [isSubmittable, setIsSubmittable] = useState<boolean>(true)
  const [isRejectedByUser, setIsRejectedByUser] = useState<Boolean>(false)

  // Hooks
  const wallet = useWallet()
  const { signProposerTx } = txActions
  const { setTxFlow } = useContext(TxModalContext)
  const { needsRiskConfirmation, isRiskConfirmed, setIsRiskIgnored } = txSecurity

  // On modal submit
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    if (needsRiskConfirmation && !isRiskConfirmed) {
      setIsRiskIgnored(true)
      return
    }

    if (!safeTx || !wallet) return

    setIsSubmittable(false)
    setIsRejectedByUser(false)

    try {
      const txId = await signProposerTx(safeTx, origin)
      onSubmit?.(txId)
    } catch (_err) {
      const err = asError(_err)
      if (isWalletRejection(err)) {
        setIsRejectedByUser(true)
      } else {
        trackError(Errors._805, err)
      }
      setIsSubmittable(true)
      return
    }

    setTxFlow(undefined)
  }

  const submitDisabled = !safeTx || !isSubmittable || disableSubmit || (needsRiskConfirmation && !isRiskConfirmed)

  return (
    <form onSubmit={handleSubmit}>
      <Typography>
        As a <strong>Proposer</strong>, you&apos;re creating this transaction without any signatures. It will need
        approval from a signer before it becomes a valid transaction.
      </Typography>

      {isRejectedByUser && (
        <Box mt={1}>
          <WalletRejectionError />
        </Box>
      )}

      <Divider className={commonCss.nestedDivider} sx={{ pt: 3 }} />

      <CardActions>
        <Stack
          sx={{
            width: ['100%', '100%', '100%', 'auto'],
          }}
          direction={{ xs: 'column-reverse', lg: 'row' }}
          spacing={{ xs: 2, md: 2 }}
        >
          {/* Submit button */}
          <CheckWallet checkNetwork>
            {(isOk) => (
              <Button
                data-testid="sign-btn"
                variant="contained"
                type="submit"
                disabled={!isOk || submitDisabled}
                sx={{ minWidth: '82px', order: '1', width: ['100%', '100%', '100%', 'auto'] }}
              >
                {!isSubmittable ? <CircularProgress size={20} /> : 'Propose transaction'}
              </Button>
            )}
          </CheckWallet>
        </Stack>
      </CardActions>
    </form>
  )
}

const useTxSecurityContext = () => useContext(TxSecurityContext)

export default madProps(ProposerForm, {
  txActions: useTxActions,
  txSecurity: useTxSecurityContext,
})
