'use client'
import { useState, useContext, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Web3Context } from '../context/Web3Context'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import SpaceBackground from '../components/animations/SpaceBackground'

// ── Payment modal (unchanged style) ──
function PaymentModal({ show, onClose, onPaySOL, onPayUSDC }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-2">Unlock Advanced AI Generation</h3>
            <p className="text-gray-300 mb-4">One‑time $7.99 USD payment for unlimited planets forever.</p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={onPaySOL}
                style={{
                  padding: '14px 28px',
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg,#7b2cff,#ff61d8)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Pay with SOL
              </button>
              <button
                onClick={onPayUSDC}
                style={{
                  padding: '14px 28px',
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg,#3aa8ff,#4fd8ff)',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Pay with USDC
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Main create page ──
export default function CreatePlanet() {
  const { account, token, sendSolPayment, sendUsdcPayment, hasPremium } = useContext(Web3Context)
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)          // { image_url, style_signature, ... }
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [freeGenerations, setFreeGenerations] = useState(3)
  const [premium, setPremium] = useState(false)

  // Fetch user status on mount / account change
  useEffect(() => {
    if (account) {
      api.get('/auth/status', { headers: { 'X-User-Id': account } })
        .then(res => {
          setFreeGenerations(3 - res.data.free_generations_used)
          setPremium(res.data.has_premium_generation)
        })
        .catch(() => {})
    }
  }, [account, hasPremium])

  // ── Wallet connection check ──
  const requireConnection = () => {
    if (!connected) {
      setVisible(true)   // opens Solana wallet modal
      return false
    }
    return true
  }

  // ── Handle generation button click ──
  const handleGenerate = () => {
    if (!requireConnection()) return
    if (!prompt.trim()) {
      alert('Please describe your planet.')
      return
    }
    if (freeGenerations > 0 || premium) {
      generatePreview()
    } else {
      setShowPayment(true)
    }
  }

  const generatePreview = async () => {
    setLoading(true)
    try {
      const resp = await api.post('/planet/generate', { prompt }, {
        headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
      })
      setPreview({
        image_url: resp.data.image_url,
        style_signature: resp.data.style_signature,
        // optional fields you can expand later
        name: 'Generated Planet',
        type: 'Terrestrial',
        rarity: 'Common',
        habitability: 'N/A',
        energy: 'N/A',
      })
      if (resp.data.free_remaining !== undefined) setFreeGenerations(resp.data.free_remaining)
    } catch (err) {
      if (err.response?.data?.error === 'premium_required') {
        setShowPayment(true)
      } else {
        alert('Generation failed. Please try again.')
      }
    }
    setLoading(false)
  }

  // ── Save planet (with name/description) ──
  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please name your planet.')
      return
    }
    setLoading(true)
    try {
      await api.post('/planet/save', {
        image_url: preview.image_url,
        name,
        description,
        style_signature: preview.style_signature,
      }, { headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` } })
      alert('Planet saved to your Cosmic Compass!')
      // Reset for another generation
      setPreview(null)
      setName('')
      setDescription('')
      setPrompt('')
    } catch (err) {
      alert('Failed to save planet.')
    }
    setLoading(false)
  }

  // ── Discard preview ──
  const handleDiscard = () => {
    setPreview(null)
    setName('')
    setDescription('')
  }

  // ── Premium unlock ──
  const handleUnlockPremium = async (currency) => {
    setShowPayment(false)
    setLoading(true)
    try {
      let signature
      if (currency === 'SOL') {
        // fetch live SOL price
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await res.json()
        const solPrice = data.solana.usd
        const solAmount = 7.99 / solPrice
        signature = await sendSolPayment(solAmount)
      } else if (currency === 'USDC') {
        signature = await sendUsdcPayment(7.99)
      }
      if (!signature) throw new Error('Payment failed')
      await api.post('/payment/unlock-premium', { signature, currency }, {
        headers: { 'X-User-Id': account, 'Authorization': `Bearer ${token}` }
      })
      setPremium(true)
      generatePreview()  // immediately generate after premium
    } catch (err) {
      alert('Transaction failed: ' + (err.message || err))
      setLoading(false)
    }
  }

  // ── Static planet info for right panel when no preview ──
  const defaultPlanet = {
    image: '/planet-texture.jpg',
    name: 'Asteria Prime',
    type: 'Oceanic Planet',
    rarity: 'Epic',
    habitability: '78%',
    energy: 'High',
  }

  // The planet to display in center / right panel
  const displayPlanet = preview || defaultPlanet

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #4b1487 0%, #160022 45%, #050008 100%)',
        color: 'white',
        padding: '20px',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <SpaceBackground />
      <Navbar />

      {/* MAIN SECTION */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2.4fr 1fr',
          gap: '22px',
          alignItems: 'start',
          marginTop: '80px',   // offset for navbar
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '20px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 30px rgba(170,80,255,0.25)',
          }}
        >
          <h1
            style={{
              fontSize: '42px',
              lineHeight: '44px',
              fontWeight: '900',
              marginBottom: '12px',
              background: 'linear-gradient(to right,#bb6cff,#ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI-DRIVEN
            <br />
            PLANET
            <br />
            GENESIS
          </h1>

          <p style={{ color: '#bba6d8', marginBottom: '20px', fontSize: '14px' }}>
            Describe it. Generate it. Own it.
          </p>

          {/* Free generation indicator */}
          {connected ? (
            <p style={{ color: '#bba6d8', marginBottom: '12px', fontSize: '13px' }}>
              Free generations left: <span style={{ color: '#bb6cff' }}>{freeGenerations}</span>
              {premium && <span style={{ color: '#67ff9d', marginLeft: '8px' }}>(Premium ♾️)</span>}
            </p>
          ) : (
            <p style={{ color: '#bba6d8', marginBottom: '12px', fontSize: '13px' }}>
              Connect wallet to create planets.
            </p>
          )}

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="A planet with crystal oceans, floating islands, purple skies..."
            style={{
              width: '100%',
              height: '140px',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(0,0,0,0.25)',
              color: 'white',
              padding: '16px',
              resize: 'none',
              outline: 'none',
              fontSize: '14px',
              marginBottom: '18px',
            }}
          />

          {/* Style selectors (static for now) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {['Cosmic', 'Realistic', 'Fantasy', 'Sci-Fi', 'Abstract'].map((style, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 16px',
                  borderRadius: '999px',
                  background: index === 0
                    ? 'linear-gradient(90deg,#7b2cff,#ff61d8)'
                    : 'rgba(255,255,255,0.08)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {style}
              </div>
            ))}
          </div>

          {/* Attributes (populated after generation) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
            {[
              ['Name', preview ? preview.name : '—'],
              ['Type', preview ? preview.type : '—'],
              ['Rarity', preview ? preview.rarity : '—'],
              ['Habitability', preview ? preview.habitability : '—'],
              ['Energy', preview ? preview.energy : '—'],
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  padding: '14px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div style={{ color: '#bda7dd', fontSize: '11px', marginBottom: '4px' }}>{item[0]}</div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{item[1]}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              border: 'none',
              borderRadius: '18px',
              background: loading
                ? 'gray'
                : 'linear-gradient(90deg,#9b3dff,#3cc8ff)',
              color: 'white',
              fontWeight: '800',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 25px rgba(131,88,255,0.5)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Generating...' : 'Generate Planet'}
          </button>
        </div>

        {/* CENTER – Planet display */}
        <div>
          <div
            style={{
              position: 'relative',
              height: '760px',
              borderRadius: '32px',
              overflow: 'hidden',
              background: 'radial-gradient(circle at center,#6d1bb8 0%,#26003f 60%,#140021 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 50px rgba(174,82,255,0.3)',
            }}
          >
            {/* Stars */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.25,
              }}
            />

            {/* Planet image */}
            <img
              src={displayPlanet.image}
              alt="planet"
              style={{
                position: 'absolute',
                width: '520px',
                height: '520px',
                objectFit: 'cover',
                borderRadius: '50%',
                top: '48%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 90px rgba(173,73,255,0.9)',
              }}
            />

            {/* Rings */}
            <div
              style={{
                position: 'absolute',
                width: '720px',
                height: '220px',
                border: '8px solid rgba(255,220,255,0.8)',
                borderRadius: '50%',
                top: '49%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-10deg)',
                boxShadow: '0 0 30px rgba(255,255,255,0.3)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '760px',
                height: '240px',
                border: '3px solid rgba(255,255,255,0.35)',
                borderRadius: '50%',
                top: '49%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-10deg)',
              }}
            />

            {/* 360 button (non-functional, just visual) */}
            <div
              style={{
                position: 'absolute',
                bottom: '28px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.45)',
                padding: '12px 28px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                fontWeight: '700',
              }}
            >
              ◀ &nbsp; 360° &nbsp; ▶
            </div>
          </div>

          {/* Variations carousel */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '14px', color: '#d8c7ff', fontWeight: '700', fontSize: '15px' }}>
              AI Generation Results
            </div>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {preview ? (
                // Show multiple previews (same image for now)
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      minWidth: '150px',
                      height: '150px',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <img
                      src={preview.image_url}
                      alt="variation"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))
              ) : (
                // Default sample planets
                [
                  '/planet-cryonix.png',
                  '/planet-solvora.png',
                  '/planet-dunora.png',
                  '/planet-lumerion.png',
                  '/planet-verdana.png',
                ].map((img, i) => (
                  <div
                    key={i}
                    style={{
                      minWidth: '150px',
                      height: '150px',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <img src={img} alt={`variation ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '20px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 30px rgba(170,80,255,0.25)',
          }}
        >
          {/* TABS (static) */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['Overview', 'Attributes', 'History'].map((tab, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 14px',
                  borderRadius: '999px',
                  background: index === 0
                    ? 'linear-gradient(90deg,#7a39ff,#ff5ed6)'
                    : 'rgba(255,255,255,0.06)',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          <h3 style={{ marginBottom: '16px', fontSize: '22px' }}>
            {preview ? 'Your Generated Planet' : 'Preview'}
          </h3>

          <img
            src={displayPlanet.image}
            alt="planet"
            style={{
              width: '100%',
              borderRadius: '22px',
              marginBottom: '20px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            {[
              ['Name', preview ? preview.name : defaultPlanet.name],
              ['Type', preview ? preview.type : defaultPlanet.type],
              ['Rarity', preview ? preview.rarity : defaultPlanet.rarity],
              ['Habitability', preview ? preview.habitability : defaultPlanet.habitability],
              ['Energy', preview ? preview.energy : defaultPlanet.energy],
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '10px',
                }}
              >
                <span style={{ color: '#bca5dc' }}>{item[0]}</span>
                <span
                  style={{
                    fontWeight: '700',
                    color: item[0] === 'Rarity' ? '#ff74ff' : item[0] === 'Habitability' ? '#67ff9d' : 'white',
                  }}
                >
                  {item[1]}
                </span>
              </div>
            ))}
          </div>

          {/* TRAITS (static, can be made dynamic later) */}
          <div style={{ marginBottom: '26px' }}>
            <div style={{ marginBottom: '16px', fontWeight: '700' }}>Special Traits</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['Crystal Oceans', 'Floating Islands', 'Aurora Sky', 'Energy Ring', 'Star Core', 'Bio Glow'].map((trait, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    padding: '14px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}
                >
                  ✦<br />{trait}
                </div>
              ))}
            </div>
          </div>

          {/* Mint / Save button */}
          <button
            onClick={handleSave}
            disabled={!preview}
            style={{
              width: '100%',
              padding: '20px',
              border: 'none',
              borderRadius: '20px',
              background: preview
                ? 'linear-gradient(90deg,#3aa8ff,#ff4fd8)'
                : 'gray',
              color: 'white',
              fontWeight: '900',
              fontSize: '18px',
              cursor: preview ? 'pointer' : 'not-allowed',
              boxShadow: preview ? '0 0 30px rgba(125,87,255,0.45)' : 'none',
              opacity: preview ? 1 : 0.6,
            }}
          >
            {preview ? 'Mint Planet 🚀' : 'Generate a planet first'}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        show={showPayment}
        onClose={() => setShowPayment(false)}
        onPaySOL={() => handleUnlockPremium('SOL')}
        onPayUSDC={() => handleUnlockPremium('USDC')}
      />
    </div>
  )
}
