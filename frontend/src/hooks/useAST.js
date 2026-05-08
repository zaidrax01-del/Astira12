import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
export const useAST = () => {
  const { balance } = useContext(Web3Context)
  return balance
}
