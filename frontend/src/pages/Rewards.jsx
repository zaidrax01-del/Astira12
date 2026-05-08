import { useEffect, useState, useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
import api from '../services/api'
import GlassPanel from '../components/ui/GlassPanel'
import GlowButton from '../components/ui/GlowButton'

export default function Rewards() {
  const { account } = useContext(Web3Context)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (account) api.get('/rewards/dashboard', { headers: { 'X-User-Id': account } }).then(r => setData(r.data))
  }, [account])

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-3xl text-center mb-8 text-purple-300">Rewards</h2>
      {data && (
        <GlassPanel className="max-w-md mx-auto p-6">
          <p>Total earned: {data.total_earned} AST</p>
          <p>Claimed: {data.total_claimed} AST</p>
          {data.allocations.filter(a => !a.claimed).map(a => (
            <div key={a.id} className="flex justify-between items-center mt-2">
              <span>{a.amount} AST</span>
              <GlowButton onClick={() => api.post(`/rewards/claim/${a.id}`, {}, { headers: { 'X-User-Id': account } })}>Claim</GlowButton>
            </div>
          ))}
        </GlassPanel>
      )}
    </div>
  )
}
