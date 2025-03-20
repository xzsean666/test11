import { OrderByOption } from '@/store/orderByPreferenceSlice'
import { safeItemBuilder } from '@/tests/builders/safeItem'
import { render } from '@/tests/test-utils'
import React from 'react'
import { screen } from '@testing-library/react'
import AccountsList from './index'
import FilteredSafes from '@/features/myAccounts/components/FilteredSafes'
import PinnedSafes from '@/features/myAccounts/components/PinnedSafes'
import AllSafes from '@/features/myAccounts/components/AllSafes'
import type { AllSafeItemsGrouped } from '@/features/myAccounts/hooks/useAllSafesGrouped'

// Mock child components to simplify tests, we just need to verify their rendering and props.
jest.mock('@/features/myAccounts/components/FilteredSafes', () => jest.fn(() => <div>FilteredSafes Component</div>))
jest.mock('@/features/myAccounts/components/PinnedSafes', () => jest.fn(() => <div>PinnedSafes Component</div>))
jest.mock('@/features/myAccounts/components/AllSafes', () => jest.fn(() => <div>AllSafes Component</div>))

describe('AccountsList', () => {
  const baseSafes: AllSafeItemsGrouped = {
    allMultiChainSafes: [
      { name: 'MultiChainSafe1', address: '0xA', isPinned: false, lastVisited: 0, safes: [safeItemBuilder().build()] },
      { name: 'MultiChainSafe2', address: '0xB', isPinned: false, lastVisited: 1, safes: [safeItemBuilder().build()] },
    ],
    allSingleSafes: [
      { name: 'SingleSafe1', address: '0xC', isPinned: true, chainId: '3', isReadOnly: false, lastVisited: 2 },
    ],
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders FilteredSafes when searchQuery is not empty', () => {
    render(<AccountsList searchQuery="Multi" safes={baseSafes} isSidebar={true} />, {
      initialReduxState: { orderByPreference: { orderBy: OrderByOption.NAME } },
    })

    expect(screen.getByText('FilteredSafes Component')).toBeInTheDocument()
    expect(screen.queryByText('PinnedSafes Component')).not.toBeInTheDocument()
    expect(screen.queryByText('AllSafes Component')).not.toBeInTheDocument()

    // Check that FilteredSafes is called with the correct props
    const filteredSafesMock = (FilteredSafes as jest.Mock).mock.calls[0][0]
    expect(filteredSafesMock.searchQuery).toBe('Multi')
    expect(filteredSafesMock.onLinkClick).toBeUndefined()

    // The combined allSafes array sorted by name
    const expectedSortedSafes = [
      { name: 'MultiChainSafe1', address: '0xA', isPinned: false, lastVisited: 0, safes: expect.anything() },
      { name: 'MultiChainSafe2', address: '0xB', isPinned: false, lastVisited: 1, safes: expect.anything() },
      { name: 'SingleSafe1', address: '0xC', isPinned: true, chainId: '3', isReadOnly: false, lastVisited: 2 },
    ]
    expect(filteredSafesMock.allSafes).toEqual(expectedSortedSafes)
  })

  it('renders PinnedSafes and AllSafes when searchQuery is empty', () => {
    render(<AccountsList searchQuery="" safes={baseSafes} isSidebar={false} />, {
      initialReduxState: { orderByPreference: { orderBy: OrderByOption.NAME } },
    })

    expect(screen.queryByText('FilteredSafes Component')).not.toBeInTheDocument()
    expect(screen.getByText('PinnedSafes Component')).toBeInTheDocument()
    expect(screen.getByText('AllSafes Component')).toBeInTheDocument()

    // Check that PinnedSafes and AllSafes received the correct props
    const pinnedSafesMock = (PinnedSafes as jest.Mock).mock.calls[0][0]
    const allSafesMock = (AllSafes as jest.Mock).mock.calls[0][0]

    // Sorted array as in the previous test
    const expectedSortedSafes = [
      { name: 'MultiChainSafe1', address: '0xA', isPinned: false, lastVisited: 0, safes: expect.anything() },
      { name: 'MultiChainSafe2', address: '0xB', isPinned: false, lastVisited: 1, safes: expect.anything() },
      { name: 'SingleSafe1', address: '0xC', isPinned: true, chainId: '3', isReadOnly: false, lastVisited: 2 },
    ]

    expect(pinnedSafesMock.allSafes).toEqual(expectedSortedSafes)
    expect(allSafesMock.allSafes).toEqual(expectedSortedSafes)
    expect(allSafesMock.isSidebar).toBe(false)
  })

  it('sorts by lastVisited', () => {
    render(<AccountsList searchQuery="" safes={baseSafes} isSidebar={false} />, {
      initialReduxState: { orderByPreference: { orderBy: OrderByOption.LAST_VISITED } },
    })

    expect(screen.queryByText('FilteredSafes Component')).not.toBeInTheDocument()
    expect(screen.getByText('PinnedSafes Component')).toBeInTheDocument()
    expect(screen.getByText('AllSafes Component')).toBeInTheDocument()

    // Check that PinnedSafes and AllSafes received the correct props
    const pinnedSafesMock = (PinnedSafes as jest.Mock).mock.calls[0][0]
    const allSafesMock = (AllSafes as jest.Mock).mock.calls[0][0]

    const expectedSortedSafes = [
      { name: 'SingleSafe1', address: '0xC', isPinned: true, chainId: '3', isReadOnly: false, lastVisited: 2 },
      { name: 'MultiChainSafe2', address: '0xB', isPinned: false, lastVisited: 1, safes: expect.anything() },
      { name: 'MultiChainSafe1', address: '0xA', isPinned: false, lastVisited: 0, safes: expect.anything() },
    ]

    expect(pinnedSafesMock.allSafes).toEqual(expectedSortedSafes)
    expect(allSafesMock.allSafes).toEqual(expectedSortedSafes)
  })

  it('passes onLinkClick prop down to children', () => {
    const onLinkClickFn = jest.fn()

    render(<AccountsList searchQuery="" safes={baseSafes} onLinkClick={onLinkClickFn} isSidebar={true} />)

    const pinnedSafesMock = (PinnedSafes as jest.Mock).mock.calls[0][0]
    const allSafesMock = (AllSafes as jest.Mock).mock.calls[0][0]
    expect(pinnedSafesMock.onLinkClick).toBe(onLinkClickFn)
    expect(allSafesMock.onLinkClick).toBe(onLinkClickFn)
  })
})
