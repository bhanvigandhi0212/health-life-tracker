
export default function WaterGlass({ glasses = 0, goal = 8 }) {
  const level = Math.min(100, Math.max(0, (glasses / goal) * 100))

  return (
    <div className="water-glass-widget">
      <div className="water-glass">
        <div
          className="water-fill"
          style={{ height: `${level}%` }}
        >
          <div className="water-wave" />
          <div className="water-wave water-wave-two" />
        </div>
        <div className="glass-shine" />
        <div className="glass-rim" />
      </div>

      <p className="water-glass-count">
        {glasses} / {goal} glasses
      </p>

      <p className="water-glass-caption">
        {glasses >= goal
          ? 'Daily goal completed! 🎉'
          : 'Keep hydrating 💧'}
      </p>
    </div>
  )
}
