import { useEffect, useRef, useState } from 'react'

export default function ScrollProgress({ target }) {
  const barRef = useRef(null)

  useEffect(() => {
    const el = target ? document.querySelector(target) : null
    if (!el) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const pct = scrollHeight <= clientHeight ? 0 : scrollTop / (scrollHeight - clientHeight)
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [target])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  )
}
