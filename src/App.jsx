import { useEffect, useState } from 'react'
import WaterGlass from './WaterGlass'
import './App.css'
import Sidebar from './Components/Sidebar'
import SmartAssistant from './SmartAssistant'
import CalendarHistory from './CalendarHistory'

const HEALTH_DEFAULTS = {
  calories: 0,
  protein: 0,
  steps: 0,
  water: 0,
}

function readHealthData() {
  try {
    return {
      calories: Number(localStorage.getItem('lifesync-calories')) || 0,
      protein: Number(localStorage.getItem('lifesync-protein')) || 0,
      steps: Number(localStorage.getItem('lifesync-steps')) || 0,
      water: Number(localStorage.getItem('lifesync-water')) || 0,
    }
  } catch {
    return HEALTH_DEFAULTS
  }
}

function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function getLocalDateKey(date = new Date()) {
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


function App() {
  
  const [currentPage, setCurrentPage] = useState(
    window.location.hash || "#dashboard"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash || "#dashboard");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);


  const [darkMode, setDarkMode] = useState(
    
  () => localStorage.getItem('lifesync-dark-mode') === 'true'
)
  const [health, setHealth] = useState(readHealthData)
  
const [history, setHistory] = useState(readHistory)

const [selectedDate, setSelectedDate] = useState(
  () => getLocalDateKey()
)

const [calendarMonth, setCalendarMonth] = useState(
  () => new Date()
)

const [weight, setWeight] = useState('')

  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState(() => readArray('lifesync-tasks'))

  const [foodName, setFoodName] = useState('')
  const [foodQuantity, setFoodQuantity] = useState('')
  const [foodCalories, setFoodCalories] = useState('')
  const [foodProtein, setFoodProtein] = useState('')
  const [foodEntries, setFoodEntries] = useState(() =>
    readArray('lifesync-foods')
  )

  const goals = {
    calories: 2000,
    protein: 120,
    steps: 8000,
    water: 8,
  }

  useEffect(() => {
    try {
      Object.entries(health).forEach(([key, value]) => {
        localStorage.setItem(`lifesync-${key}`, String(value))
      })
    } catch (error) {
      console.error('Unable to save health data:', error)
    }
  }, [health])

  useEffect(() => {
    try {
      localStorage.setItem('lifesync-tasks', JSON.stringify(tasks))
    } catch (error) {
      console.error('Unable to save tasks:', error)
    }
  }, [tasks])

  useEffect(() => {
    try {
      localStorage.setItem('lifesync-foods', JSON.stringify(foodEntries))
    } catch (error) {
      console.error('Unable to save food entries:', error)
    }
  }, [foodEntries])

  function updateHealth(field, value) {
    setHealth((previous) => ({
      ...previous,
      [field]: Math.max(0, Number(value) || 0),
    }))
  }

  function getProgress(value, goal) {
    return Math.min((value / goal) * 100, 100)
  }

  function addFood(event) {
    event.preventDefault()

    const name = foodName.trim()
    const quantity = foodQuantity.trim()
    const calories = Number(foodCalories)
    const protein = Number(foodProtein)

    if (
      !name ||
      !quantity ||
      foodCalories === '' ||
      foodProtein === '' ||
      !Number.isFinite(calories) ||
      !Number.isFinite(protein) ||
      calories < 0 ||
      protein < 0
    ) {
      return
    }

    setFoodEntries((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        name,
        quantity,
        calories,
        protein,
      },
    ])

    setFoodName('')
    setFoodQuantity('')
    setFoodCalories('')
    setFoodProtein('')
  }

  function addTask(event) {
    event.preventDefault()

    const title = task.trim()
    if (!title) return

    setTasks((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        title,
        completed: false,
      },
    ])

    setTask('')
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    )
  }

  function deleteTask(id) {
    setTasks((previous) => previous.filter((item) => item.id !== id))
  }

  function deleteFood(id) {
    setFoodEntries((previous) =>
      previous.filter((food) => food.id !== id)
    )
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const totalFoodCalories = foodEntries.reduce(
    (sum, food) => sum + Number(food.calories || 0),
    0
  )

  const totalFoodProtein = foodEntries.reduce(
    (sum, food) => sum + Number(food.protein || 0),
    0
  )
  useEffect(() => {
  setHealth((previous) => ({
    ...previous,
    calories: totalFoodCalories,
    protein: totalFoodProtein,
  }))
}, [totalFoodCalories, totalFoodProtein])

  const stats = [
    {
      key: 'calories',
      label: 'Calories',
      icon: '🔥',
      unit: 'kcal',
      goal: goals.calories,
      className: 'calorie-icon',
      fill: 'calorie-fill',
    },
    {
      key: 'protein',
      label: 'Protein',
      icon: '🥚',
      unit: 'g',
      goal: goals.protein,
      className: 'protein-icon',
      fill: 'protein-fill',
    },
    {
      key: 'steps',
      label: 'Steps',
      icon: '👟',
      unit: '',
      goal: goals.steps,
      className: 'steps-icon',
      fill: 'steps-fill',
    },
    {
      key: 'water',
      label: 'Water',
      icon: '💧',
      unit: 'glasses',
      goal: goals.water,
      className: 'water-icon',
      fill: 'water-fill',
    },
  ]

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Sidebar />

      
<main
  className="main"
  id="dashboard"
  style={{ display: currentPage === "#history" ? "none" : undefined }}
>

        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PERSONAL SPACE</p>
            <p className="topbar-date">{today}</p>
          </div>

          <div className="topbar-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={() => {
  setDarkMode((value) => {
    const newValue = !value
    localStorage.setItem('lifesync-dark-mode', String(newValue))
    return newValue
  })
}}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <div className="date-pill">✦ My daily overview</div>
          </div>
        </header>

        <section className="welcome-card">
          <div className="welcome-content">
            <span className="welcome-tag">✦ A FRESH START</span>
            <h1>Make today count.</h1>
            <p>
              Build healthy habits, stay organised, and make progress at
              your own pace.
            </p>
            <a className="primary-button" href="#health">
              Explore your progress →
            </a>
          </div>

          <div className="welcome-decoration" aria-hidden="true">
            <span>✦</span>
            <span>☀</span>
            <span>✧</span>
          </div>
        </section>

        <section className="section-block" id="health">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR WELLNESS</p>
              <h2>Today's health</h2>
            </div>
            <span className="section-note">Daily goals</span>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.key}>
                <div className="stat-top">
                  <span className={`stat-icon ${stat.className}`}>
                    {stat.icon}
                  </span>
                  <span className="stat-label">{stat.label}</span>
                </div>

                <div className="stat-number">
                  {Number(health[stat.key]).toLocaleString('en-IN')}{' '}
                  {stat.unit && <span>{stat.unit}</span>}
                </div>

                <div className="progress-track">
                  <div
                    className={`progress-fill ${stat.fill}`}
                    style={{
                      width: `${getProgress(
                        health[stat.key],
                        stat.goal
                      )}%`,
                    }}
                  />
                </div>

                <p className="stat-caption">
                  Goal: {stat.goal.toLocaleString('en-IN')} {stat.unit}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">UPDATE YOUR NUMBERS</p>
              <h2>Update today's health</h2>
            </div>
            <span className="section-note">Saved automatically</span>
          </div>

          <div className="panel health-form-panel">
            <div className="health-inputs">
              <label>
                Calories (kcal)
                <input
                  type="number"
                  min="0"
                  value={health.calories}
                  onChange={(event) =>
                    updateHealth('calories', event.target.value)
                  }
                />
              </label>

              <label>
                Protein (g)
                <input
                  type="number"
                  min="0"
                  value={health.protein}
                  onChange={(event) =>
                    updateHealth('protein', event.target.value)
                  }
                />
              </label>

              <label>
                Steps
                <input
                  type="number"
                  min="0"
                  value={health.steps}
                  onChange={(event) =>
                    updateHealth('steps', event.target.value)
                  }
                />
              </label>

              <label>
                Water (glasses)
                <input
                  type="number"
                  min="0"
                  value={health.water}
                  onChange={(event) =>
                    updateHealth('water', event.target.value)
                  }
                />
              </label>
              <WaterGlass glasses={health.water} goal={8} />
            </div>

            <p className="form-hint">
              Your latest values are stored in this browser automatically.
            </p>
          </div>
        </section>

        <section className="section-block" id="nutrition">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FUEL YOUR BODY</p>
              <h2>Nutrition Tracker</h2>
            </div>
            <span className="section-note">Today's food</span>
          </div>

          <div className="panel health-form-panel">
            <form onSubmit={addFood}>
              <div className="health-inputs">
                <label>
                  Food name
                  <input
                    type="text"
                    value={foodName}
                    onChange={(event) => setFoodName(event.target.value)}
                    placeholder="e.g. Paneer"
                    required
                  />
                </label>

                <label>
                  Quantity
                  <input
                    type="text"
                    value={foodQuantity}
                    onChange={(event) =>
                      setFoodQuantity(event.target.value)
                    }
                    placeholder="e.g. 150 g"
                    required
                  />
                </label>

                <label>
                  Calories (kcal)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={foodCalories}
                    onChange={(event) =>
                      setFoodCalories(event.target.value)
                    }
                    placeholder="e.g. 250"
                    required
                  />
                </label>

                <label>
                  Protein (g)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={foodProtein}
                    onChange={(event) =>
                      setFoodProtein(event.target.value)
                    }
                    placeholder="e.g. 20"
                    required
                  />
                </label>
              </div>

              <button type="submit" className="add-task-button">
                + Add Food
              </button>
            </form>

            <div className="nutrition-summary">
              <div className="report-row">
                <span>Total calories from food entries</span>
                <strong>
                  {totalFoodCalories.toLocaleString('en-IN')} kcal
                </strong>
              </div>

              <div className="report-row">
                <span>Total protein from food entries</span>
                <strong>
                  {totalFoodProtein.toLocaleString('en-IN')} g
                </strong>
              </div>
            </div>

            <div className="task-list">
              {foodEntries.length === 0 ? (
                <p className="empty-state">
                  No food added yet. Add your first meal 🍽️
                </p>
              ) : (
                foodEntries.map((food) => (
                  <div className="task-item" key={food.id}>
                    <div>
                      <strong>{food.name}</strong>
                      <p className="form-hint">{food.quantity}</p>
                      <p className="form-hint">
                        {food.calories} kcal · {food.protein} g protein
                      </p>
                    </div>

                    <button
                      className="delete-task"
                      type="button"
                      onClick={() => deleteFood(food.id)}
                      aria-label={`Delete ${food.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <div className="content-grid">
          <section className="panel planner-panel" id="planner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">STAY ON TRACK</p>
                <h2>Daily planner</h2>
              </div>
              <span className="task-count">
                {tasks.filter((item) => !item.completed).length} left
              </span>
            </div>

            <form className="task-form" onSubmit={addTask}>
              <input
                type="text"
                value={task}
                onChange={(event) => setTask(event.target.value)}
                placeholder="Add a task for today..."
                aria-label="New task"
              />
              <button type="submit" className="add-task-button">
                + Add
              </button>
            </form>

            <div className="task-list">
              {tasks.length === 0 ? (
                <p className="empty-state">
                  No tasks yet. Add one small goal to get started ✨
                </p>
              ) : (
                tasks.map((item) => (
                  <div className="task-item" key={item.id}>
                    <label className="task-label">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleTask(item.id)}
                      />
                      <span
                        className={item.completed ? 'task-done' : ''}
                      >
                        {item.title}
                      </span>
                    </label>

                    <button
                      className="delete-task"
                      type="button"
                      onClick={() => deleteTask(item.id)}
                      aria-label={`Delete ${item.title}`}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="panel reports-panel" id="reports">
            <p className="eyebrow">YOUR DAILY SNAPSHOT</p>
            <h2>Today's progress</h2>
            <p className="report-description">
              Keep showing up for yourself. Every small action contributes
              to a healthier routine.
            </p>

            <div className="report-row">
              <span>Health goals started</span>
              <strong>
                {Object.keys(goals).filter((key) => health[key] > 0).length}
                {' / 4'}
              </strong>
            </div>

            <div className="report-row">
              <span>Tasks completed</span>
              <strong>
                {tasks.filter((item) => item.completed).length} / {tasks.length}
              </strong>
            </div>

            <div className="report-row">
              <span>Food entries</span>
              <strong>{foodEntries.length}</strong>
            </div>

            <div className="report-row">
              <span>Theme</span>
              <strong>{darkMode ? 'Dark' : 'Light'}</strong>
            </div>
          </section>
        </div>

       
<SmartAssistant health={health} />



        <footer className="app-footer">
          <span>LifeSync © {new Date().getFullYear()}</span>
          <span>One day at a time. ♡</span>
        </footer>
      </main>
      
{currentPage === "#history" && (
  <main className="main">
    <CalendarHistory
      health={health}
      foodEntries={foodEntries}
      tasks={tasks}
    />
  </main>
)}

    </div>
  )
}

export default App