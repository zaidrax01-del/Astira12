import { createContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import api from '../services/api'

export const Web3Context = createContext()

export const Web3ContextProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      setAccount(address)

      const nonceResp = await api.post('/auth/nonce', { wallet_address: address })
      const message = `Sign this message to login to Astira: ${nonceResp.data.nonce}`
      const signature = await signer.signMessage(message)
      const verifyResp = await api.post('/auth/verify', { wallet_address: address, signature })
      setToken(verifyResp.data.token)
      localStorage.setItem('token', verifyResp.data.token)
      fetchBalance(address)
    }
  }

  const fetchBalance = async (address) => {
    const resp = await api.get('/wallet/balance', { headers: { 'X-User-Id': address } })
    setBalance(resp.data.balance || 0)
  }

  return (
    <Web3Context.Provider value={{ account, connectWallet, balance, token }}>
      {children}
    </Web3Context.Provider>
  )
}
