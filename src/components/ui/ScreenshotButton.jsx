import { useState, useRef } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Download, X, Image } from 'lucide-react'

export default function ScreenshotButton() {
  const { isExplored } = usePortfolioStore()
  const [showPreview, setShowPreview] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const canvasRef = useRef(null)

  const captureScreenshot = async () => {
    setIsCapturing(true)
    
    try {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png')
        setScreenshot(dataUrl)
        setShowPreview(true)
      }
    } catch (error) {
      console.error('Screenshot failed:', error)
    }
    
    setIsCapturing(false)
  }

  const downloadScreenshot = () => {
    if (!screenshot) return
    
    const link = document.createElement('a')
    link.download = `cosmos-portfolio-${Date.now()}.png`
    link.href = screenshot
    link.click()
  }

  if (!isExplored) return null

  return (
    <>
      <div className="absolute top-16 right-4 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={captureScreenshot}
          disabled={isCapturing}
          className="glass-panel w-10 h-10 flex items-center justify-center hover:bg-cosmic-violet/30 transition-colors"
          title="Capture Screenshot"
        >
          {isCapturing ? (
            <div className="w-4 h-4 border-2 border-cosmic-violet border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera size={18} className="text-text-white" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showPreview && screenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-space-black/90 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="glass-panel p-4 max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Image size={20} className="text-cosmic-violet" />
                  <span className="text-text-white font-mono">COSMOS Capture</span>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded"
                >
                  <X size={18} className="text-muted-slate" />
                </button>
              </div>
              
              <div className="relative">
                <img
                  src={screenshot}
                  alt="Portfolio screenshot"
                  className="max-w-full max-h-[60vh] rounded-lg border border-cosmic-violet/30"
                />
              </div>
              
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={downloadScreenshot}
                  className="px-4 py-2 bg-cosmic-violet/20 border border-cosmic-violet rounded-lg text-text-white flex items-center gap-2 hover:bg-cosmic-violet/40 transition-colors"
                >
                  <Download size={16} />
                  Download PNG
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-muted-slate hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
