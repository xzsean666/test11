import { proposerEndpoints } from '@/store/api/gateway/proposers'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  type AllOwnedSafes,
  getAllOwnedSafes,
  getTransactionDetails,
  type TransactionDetails,
  type OwnedSafes,
  getOwnedSafes,
} from '@safe-global/safe-gateway-typescript-sdk'
import { asError } from '@/services/exceptions/utils'
import { safeOverviewEndpoints } from './safeOverviews'
import { createSubmission, getSubmission } from '@safe-global/safe-client-gateway-sdk'

export async function buildQueryFn<T>(fn: () => Promise<T>) {
  try {
    return { data: await fn() }
  } catch (error) {
    return { error: asError(error) }
  }
}

export const gatewayApi = createApi({
  reducerPath: 'gatewayApi',
  baseQuery: fakeBaseQuery<Error>(),
  tagTypes: ['Submissions'],
  endpoints: (builder) => ({
    getTransactionDetails: builder.query<TransactionDetails, { chainId: string; txId: string }>({
      queryFn({ chainId, txId }) {
        return buildQueryFn(() => getTransactionDetails(chainId, txId))
      },
    }),
    getMultipleTransactionDetails: builder.query<TransactionDetails[], { chainId: string; txIds: string[] }>({
      queryFn({ chainId, txIds }) {
        return buildQueryFn(() => Promise.all(txIds.map((txId) => getTransactionDetails(chainId, txId))))
      },
    }),
    getAllOwnedSafes: builder.query<AllOwnedSafes, { walletAddress: string }>({
      queryFn({ walletAddress }) {
        return buildQueryFn(() => getAllOwnedSafes(walletAddress))
      },
    }),
    getOwnedSafes: builder.query<OwnedSafes, { chainId: string; walletAddress: string }>({
      queryFn({ chainId, walletAddress }) {
        return buildQueryFn(() => getOwnedSafes(chainId, walletAddress))
      },
    }),
    getSubmission: builder.query<
      getSubmission,
      { outreachId: number; chainId: string; safeAddress: string; signerAddress: string }
    >({
      queryFn({ outreachId, chainId, safeAddress, signerAddress }) {
        return buildQueryFn(() =>
          getSubmission({ params: { path: { outreachId, chainId, safeAddress, signerAddress } } }),
        )
      },
      providesTags: ['Submissions'],
    }),
    createSubmission: builder.mutation<
      createSubmission,
      { outreachId: number; chainId: string; safeAddress: string; signerAddress: string }
    >({
      queryFn({ outreachId, chainId, safeAddress, signerAddress }) {
        return buildQueryFn(() =>
          createSubmission({
            params: {
              path: { outreachId, chainId, safeAddress, signerAddress },
            },
            body: { completed: true },
          }),
        )
      },
      invalidatesTags: ['Submissions'],
    }),
    ...proposerEndpoints(builder),
    ...safeOverviewEndpoints(builder),
  }),
})

export const {
  useGetTransactionDetailsQuery,
  useGetMultipleTransactionDetailsQuery,
  useLazyGetTransactionDetailsQuery,
  useGetProposersQuery,
  useDeleteProposerMutation,
  useAddProposerMutation,
  useGetSubmissionQuery,
  useCreateSubmissionMutation,
  useGetSafeOverviewQuery,
  useGetMultipleSafeOverviewsQuery,
  useGetAllOwnedSafesQuery,
  useGetOwnedSafesQuery,
} = gatewayApi
