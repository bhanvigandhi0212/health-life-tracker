
import { useEffect, useState } from 'react'

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function readHistory() {
  try {
    const data = JSON.parse(
      localStorage.getItem('lifesync-history') || '{}'
    )
    return data && typeof data === 'object' && !Array.isArray(data)
      ? data
      : {}
  } catch {
    return {}
  }
}

export default function CalendarHistory({
  health = {},
  foodEntries = [],
  tasks = [],
}) {
  const [selectedDate, setSelectedDate] = useState(
    getDateKey(new Date())
  )

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const [history, setHistory] = useState(readHistory)

  // Automatically save today's progress.
  useEffect(() => {
    const todayKey = getDateKey(new Date())

    const snapshot = {
      health: { ...health },
      foods: Array.isArray(foodEntries) ? foodEntries : [],
      tasks: Array.isArray(tasks) ? tasks : [],
      updatedAt: new Date().toISOString(),
    }

    setHistory(previous => {
      const next = { ...previous, [todayKey]: snapshot }

      try {
        localStorage.setItem(
          'lifesync-history',
          JSON.stringify(next)
        )
      } catch (error) {
        console.error('Could not save history:', error)
      }

      return next
    })
  }, [health, foodEntries, tasks])

  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const todayKey = getDateKey(new Date())

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, index) => index + 1),
  ]

  const selected = history[selectedDate]

  function changeMonth(offset) {
    setVisibleMonth(current =>
      new Date(
        current.getFullYear(),
        current.getMonth() + offset,
        1
      )
    )
  }

  function selectDay(day) {
    if (!day) return

    const date = new Date(year, month, day)
    if (getDateKey(date) > todayKey) return

    setSelectedDate(getDateKey(date))
  }

  const panelStyle = {
    background: 'var(--card-bg, #ffffff)',
    border: '1px solid var(--border-color, #dedbea)',
    borderRadius: '18px',
    padding: '22px',
    minWidth: 0,
    color: 'var(--text-color, #25213b)',
    boxShadow: '0 4px 18px rgba(40, 30, 80, 0.06)',
  }

  const buttonStyle = {
    border: '1px solid #ded7f7',
    borderRadius: '9px',
    padding: '9px 13px',
    cursor: 'pointer',
    background: 'var(--card-bg, #ffffff)',
    color: 'inherit',
    fontSize: '15px',
  }

  return (
    <section
      id="history"
      style={{
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        padding: '28px',
        color: 'var(--text-color, #25213b)',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          color: '#8864ed',
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '2px',
          marginBottom: '8px',
        }}>
          YOUR PERSONAL TIMELINE
        </p>

        <h1 style={{ fontSize: '28px', margin: '0 0 8px' }}>
          Calendar &amp; History 📅
        </h1>

        <p style={{ opacity: 0.75, margin: 0 }}>
          Select a date to view your saved daily progress.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '22px',
          alignItems: 'start',
        }}
      >
        {/* Calendar */}
        <div style={panelStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              ←
            </button>

            <h2 style={{
              fontSize: '18px',
              textAlign: 'center',
              margin: 0,
            }}>
              {visibleMonth.toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>

            <button
              type="button"
              style={{
                ...buttonStyle,
                opacity:
                  year === new Date().getFullYear() &&
                  month === new Date().getMonth()
                    ? 0.4
                    : 1,
              }}
              onClick={() => changeMonth(1)}
              disabled={
                year === new Date().getFullYear() &&
                month === new Date().getMonth()
              }
              aria-label="Next month"
            >
              →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '5px',
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '8px 0',
                  opacity: 0.7,
                }}
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} />
              }

              const dateKey = getDateKey(
                new Date(year, month, day)
              )
              const isFuture = dateKey > todayKey
              const isSelected = selectedDate === dateKey
              const isToday = dateKey === todayKey
              const hasData = Boolean(history[dateKey])

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={isFuture}
                  onClick={() => selectDay(day)}
                  title={
                    hasData
                      ? 'Saved progress available'
                      : 'No saved history'
                  }
                  style={{
                    minWidth: 0,
                    minHeight: '42px',
                    padding: '5px 0',
                    borderRadius: '10px',
                    border: isToday
                      ? '2px solid #9675ff'
                      : '1px solid transparent',
                    background: isSelected
                      ? '#9675ff'
                      : 'transparent',
                    color: isSelected
                      ? '#ffffff'
                      : 'inherit',
                    opacity: isFuture ? 0.3 : 1,
                    cursor: isFuture ? 'not-allowed' : 'pointer',
                    fontWeight: isSelected || isToday ? 700 : 400,
                    fontSize: '14px',
                  }}
                >
                  {day}
                  {hasData && (
                    <span style={{
                      display: 'block',
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: isSelected ? '#ffffff' : '#9675ff',
                      margin: '2px auto 0',
                    }} />
                  )}
                </button>
              )
            })}
          </div>

          <p style={{
            fontSize: '12px',
            opacity: 0.7,
            marginTop: '18px',
          }}>
            🟣 Dates with saved progress have a dot.
          </p>
        </div>

        {/* Selected date details */}
        <div style={panelStyle}>
          <p style={{
            color: '#8864ed',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1.5px',
          }}>
            DAILY RECORD
          </p>

          <h2 style={{ fontSize: '21px', marginBottom: '20px' }}>
            {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
              'en-IN',
              {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }
            )}
          </h2>

          {!selected ? (
            <p style={{ lineHeight: 1.7, opacity: 0.75 }}>
              No saved record for this date yet. Your current day's
              progress will be saved automatically.
            </p>
          ) : (
            <>
              {[
                ['🔥 Calories', `${selected.health?.calories ?? 0} kcal`],
                ['💪 Protein', `${selected.health?.protein ?? 0} g`],
                [
                  '👟 Steps',
                  Number(selected.health?.steps ?? 0).toLocaleString('en-IN'),
                ],
                ['💧 Water', `${selected.health?.water ?? 0} glasses`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '13px 0',
                    borderBottom: '1px solid var(--border-color, #e5e1ef)',
                  }}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}

              <h3 style={{ marginTop: '24px' }}>
                Meals ({(selected.foods || []).length})
              </h3>

              {(selected.foods || []).length === 0 ? (
                <p style={{ opacity: 0.7 }}>No meals saved.</p>
              ) : (
                selected.foods.map((food, index) => (
                  <div
                    key={food.id || index}
                    style={{
                      padding: '12px 0',
                      borderBottom: '1px solid var(--border-color, #e5e1ef)',
                    }}
                  >
                    <strong>{food.name}</strong>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>
                      {food.quantity} · {food.calories} kcal · {food.protein} g protein
                    </p>
                  </div>
                ))
              )}

              <h3 style={{ marginTop: '24px' }}>
                Tasks ({(selected.tasks || []).length})
              </h3>

              {(selected.tasks || []).length === 0 ? (
                <p style={{ opacity: 0.7 }}>No tasks saved.</p>
              ) : (
                selected.tasks.map((task, index) => (
                  <div
                    key={task.id || index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '10px 0',
                    }}
                  >
                    <span>
                      {task.completed ? '✅' : '○'} {task.title}
                    </span>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
