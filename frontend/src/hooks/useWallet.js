import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
export const useWallet = () => useContext(Web3Context)
