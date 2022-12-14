import CopyHelper from 'components/AccountDetails/Copy'
// import { Context, useCallback, useContext } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useAppDispatch } from 'state/hooks'
import { useChainId } from 'state/user/hooks'
import { ResetConnection, useAccount, useWallet } from 'state/wallets/hooks'
import { removeConnectedWallet, setSelectedWallet } from 'state/wallets/reducer'
import { getWalletName } from 'state/wallets/types'
// import { DefaultTheme } from 'styled-components/macro'
// import styled, { ThemeContext } from 'styled-components/macro'
import styled from 'styled-components/macro'

import { ReactComponent as Close } from '../../assets/x.svg'
// import { clearAllTransactions } from '../../state/transactions/reducer'
import { ExternalLink } from '../../theme'
// import { ExternalLink, LinkStyledButton, ThemedText } from '../../theme'
import { shortenAddress } from '../../utils'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { ButtonSecondary } from '../Button'
// import { AutoRow } from '../Row'
// import Transaction from './Transaction'

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.deprecated_primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.deprecated_bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.deprecated_text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  padding: 0rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

// const LowerSection = styled.div`
//   ${({ theme }) => theme.flexColumnNoWrap}
//   padding: 1.5rem;
//   flex-grow: 1;
//   overflow: auto;
//   background-color: ${({ theme }) => theme.deprecated_bg2};
//   border-bottom-left-radius: 20px;
//   border-bottom-right-radius: 20px;

//   h5 {
//     margin: 0;
//     font-weight: 400;
//     color: ${({ theme }) => theme.deprecated_text3};
//   }
// `

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const AddressLink = styled(ExternalLink)`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.deprecated_text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.deprecated_text2};
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.deprecated_text4};
  }
`

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: ${({ theme }) => theme.deprecated_text3};
`

// const TransactionListWrapper = styled.div`
//   ${({ theme }) => theme.flexColumnNoWrap};
// `

const WalletAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

// function renderTransactions(transactions: string[]) {
//   return (
//     <TransactionListWrapper>
//       {transactions.map((hash, i) => {
//         return <Transaction key={i} hash={hash} />
//       })}
//     </TransactionListWrapper>
//   )
// }

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  openOptions: () => void
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  openOptions,
}: AccountDetailsProps) {
  const account = useAccount()
  const walletType = useWallet()
  const walletName = getWalletName(walletType)
  const chainId = useChainId()

  // const theme = useContext(ThemeContext as Context<DefaultTheme>)
  const dispatch = useAppDispatch()

  function formatConnectorName() {
    return <WalletName>Connected with {walletName}</WalletName>
  }

  // const clearAllTransactionsCallback = useCallback(() => {
  //   if (chainId) dispatch(clearAllTransactions({ chainId }))
  // }, [dispatch, chainId])

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>Account</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {formatConnectorName()}
                <div>
                  <WalletAction
                    style={{ fontSize: '.825rem', fontWeight: 400, marginRight: '8px' }}
                    onClick={() => {
                      ResetConnection()
                      dispatch(setSelectedWallet({ wallet: undefined }))
                      dispatch(removeConnectedWallet({ account, walletType: walletName }))
                      openOptions()
                    }}
                  >
                    Disconnect
                  </WalletAction>
                  <WalletAction
                    style={{ fontSize: '.825rem', fontWeight: 400 }}
                    onClick={() => {
                      openOptions()
                    }}
                  >
                    Change
                  </WalletAction>
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow data-testid="web3-account-identifier-row">
                <AccountControl>
                  <div>
                    <p>{account && shortenAddress(account)}</p>
                  </div>
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                <AccountControl>
                  <div>
                    {account && (
                      <CopyHelper toCopy={account} iconPosition="left">
                        <span style={{ marginLeft: '4px' }}>Copy Address</span>
                      </CopyHelper>
                    )}
                    {chainId && account && (
                      <AddressLink href={getExplorerLink(chainId, account, ExplorerDataType.ADDRESS)}>
                        <LinkIcon size={16} />
                        <span style={{ marginLeft: '4px' }}>View on Explorer</span>
                      </AddressLink>
                    )}
                  </div>
                </AccountControl>
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
      {/* {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
            <ThemedText.DeprecatedBody>
              <Trans>Recent Transactions</Trans>
            </ThemedText.DeprecatedBody>
            <LinkStyledButton onClick={clearAllTransactionsCallback}>
              <Trans>(clear all)</Trans>
            </LinkStyledButton>
          </AutoRow>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </LowerSection>
      ) : (
        <LowerSection>
          <ThemedText.DeprecatedBody color={theme.deprecated_text1}>
            <Trans>Your transactions will appear here...</Trans>
          </ThemedText.DeprecatedBody>
        </LowerSection>
      )} */}
    </>
  )
}
