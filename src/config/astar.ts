import { ChainInfo, FEATURES, RPC_AUTHENTICATION } from '@safe-global/safe-gateway-typescript-sdk'

export const ASTAR_CHAIN_CONFIG: ChainInfo = {
  transactionService: 'https://transactions.multisig.astar.network', // 需要有适合ASTAR的交易服务URL
  chainId: '592',
  chainName: 'Astar Network',
  shortName: 'astr',
  l2: false,
  isTestnet: false,
  description: 'Astar Network - The smart contract hub for WASM and EVM',
  rpcUri: {
    authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
    value: 'https://evm.astar.network',
  },
  safeAppsRpcUri: {
    authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
    value: 'https://evm.astar.network',
  },
  publicRpcUri: {
    authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
    value: 'https://evm.astar.network',
  },
  blockExplorerUriTemplate: {
    address: 'https://blockscout.com/astar/address/{{address}}',
    txHash: 'https://blockscout.com/astar/tx/{{txHash}}',
    api: 'https://blockscout.com/astar/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
  },
  nativeCurrency: {
    name: 'Astar',
    symbol: 'ASTR',
    decimals: 18,
    logoUri: '/images/common/astar_logo.png', // 需要添加ASTAR的logo
  },
  theme: { textColor: '#ffffff', backgroundColor: '#1b6dc1' },
  gasPrice: [],
  disabledWallets: [],
  features: [
    FEATURES.ERC721,
    FEATURES.SAFE_APPS,
    FEATURES.SAFE_TX_GAS_OPTIONAL,
    FEATURES.SPENDING_LIMIT,
    FEATURES.TX_SIMULATION,
  ],
  balancesProvider: {
    chainName: null,
    enabled: false,
  },
  recommendedMasterCopyVersion: '1.4.1',
  contractAddresses: {
    createCallAddress: null,
    fallbackHandlerAddress: null,
    multiSendAddress: null,
    multiSendCallOnlyAddress: null,
    safeProxyFactoryAddress: null,
    safeSingletonAddress: null,
    safeWebAuthnSignerFactoryAddress: null,
    signMessageLibAddress: null,
    simulateTxAccessorAddress: null,
  },
}
