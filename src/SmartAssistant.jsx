
import { useState } from 'react'

export default function SmartAssistant({ health = {} }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hey! 👋 I'm your LifeSync assistant. Ask me about your daily health progress.",
    },
  ])

  const [input, setInput] = useState('')

  function getReply(question) {
    const q = question.toLowerCase()

    const calories = Number(health.calories) || 0
    const protein = Number(health.protein) || 0
    const steps = Number(health.steps) || 0
    const water = Number(health.water) || 0

    if (q.includes('calorie')) {
      return `🔥 You've logged ${calories} calories today. Your daily target is 2,000 calories.`
    }

    if (q.includes('protein')) {
      return `💪 You've consumed ${protein}g of protein today. Your daily target is 120g.`
    }

    if (q.includes('step')) {
      const remaining = Math.max(0, 8000 - steps)
      return `👟 You've walked ${steps.toLocaleString()} steps today. ${
        remaining > 0
          ? `${remaining.toLocaleString()} more steps to reach your 8,000-step goal.`
          : 'Amazing! You reached your daily step goal!'
      }`
    }

    if (q.includes('water') || q.includes('drink') || q.includes('glass')) {
      const remaining = Math.max(0, 8 - water)
      return `💧 You've logged ${water} glasses of water today. ${
        remaining > 0
          ? `${remaining} more glasses to reach your 8-glass goal.`
          : 'You reached your 8-glass goal!'
      }`
    }

    if (
      q.includes('progress') ||
      q.includes('summary') ||
      q.includes('how am i') ||
      q.includes('daily report')
    ) {
      return `✨ Your daily summary:\n🔥 Calories: ${calories} / 2000\n💪 Protein: ${protein}g / 120g\n👟 Steps: ${steps.toLocaleString()} / 8000\n💧 Water: ${water} / 8 glasses`
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return "Hey there! 💜 I'm here to help you track your daily progress."
    }

    if (q.includes('help')) {
      return '😊 Try asking about your calories, protein, steps, water intake, or daily progress.'
    }

    return "😊 I can help you check your calories, protein, steps, water intake, and daily summary. Try clicking one of the suggestion buttons!"
  }

  function sendQuestion(question) {
    const cleanQuestion = question.trim()

    if (!cleanQuestion) return

    const reply = getReply(cleanQuestion)

    setMessages((previous) => [
      ...previous,
      { role: 'user', text: cleanQuestion },
      { role: 'assistant', text: reply },
    ])

    setInput('')
  }

  function sendMessage(event) {
    event.preventDefault()
    sendQuestion(input)
  }

  const suggestions = [
    'Show my progress',
    'Protein today?',
    'My steps',
    'Water intake',
  ]

  return (
    <section className="section-block smart-assistant" id="assistant">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR PERSONAL COMPANION</p>
          <h2>LifeSync Assistant ✨</h2>
        </div>
        <span>Always ready to help</span>
      </div>

      <div className="assistant-card">
        <div className="assistant-header">
          <div className="assistant-avatar">✦</div>

          <div>
            <h3>LifeSync AI</h3>
            <p>Health &amp; daily progress assistant</p>
          </div>

          <span className="assistant-status">● Online</span>
        </div>

        <div className="assistant-messages" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={`${index}-${message.role}`}
              className={`assistant-message ${
                message.role === 'user'
                  ? 'user-message'
                  : 'bot-message'
              }`}
            >
              {message.text.split('\n').map((line, lineIndex) => (
                <span key={lineIndex}>
                  {line}
                  {lineIndex < message.text.split('\n').length - 1 && (
                    <br />
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="assistant-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="assistant-suggestion"
              onClick={() => sendQuestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form className="assistant-input-row" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your daily progress..."
            aria-label="Message the LifeSync assistant"
          />

          <button type="submit" disabled={!input.trim()}>
            Send ↗
          </button>
        </form>
      </div>
    </section>
  )
}
