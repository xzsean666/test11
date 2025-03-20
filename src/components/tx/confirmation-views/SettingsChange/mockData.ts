import type { SettingsChange } from '@safe-global/safe-gateway-typescript-sdk'
import { SettingsInfoType, TransactionInfoType } from '@safe-global/safe-gateway-typescript-sdk'

export const ownerAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
export const txInfo: SettingsChange = {
  type: TransactionInfoType.SETTINGS_CHANGE,
  humanDescription: 'Add new owner 0xd8dA...6045 with threshold 1',
  dataDecoded: {
    method: 'addOwnerWithThreshold',
    parameters: [
      {
        name: 'owner',
        type: 'address',
        value: ownerAddress,
      },
      {
        name: '_threshold',
        type: 'uint256',
        value: '1',
      },
    ],
  },
  settingsInfo: {
    type: SettingsInfoType.ADD_OWNER,
    owner: {
      value: ownerAddress,
      name: 'Nevinha',
      logoUri: 'http://something.com',
    },
    threshold: 1,
  },
}
