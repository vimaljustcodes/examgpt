"use client"

import { useState, useEffect } from "react"

const phrases = [
  "How to study 30 days syllabus in 3 hours?",
  "How to make my crush fall for me before final sem?",
  "How to not zone out during lectures?",
  "How to tell prof I didn't plagiarize (but I did)?",
  "How to get internship without LinkedIn cringe?",
  "Can I become rich without doing MBA?",
  "WTF is depreciation and why is it ruining my CGPA?",
  "How to focus when your ex is in the same class?",
  "How to become top intern at Apple or Tesla?",
  "Is crush on professor normal or illegal?",
  "What to say when prof asks 'Any questions?'",
  "How to stop overthinking before results?",
  "How to survive college with 0 motivation and 1 braincell?",
  "Can I pass using only ExamGPT?",
]

export function TypewriterText() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]

    const timeout = setTimeout(
      () => {
        if (isPaused) {
          setIsPaused(false)
          setIsDeleting(true)
          return
        }

        if (isDeleting) {
          if (currentText === "") {
            setIsDeleting(false)
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
          } else {
            setCurrentText(currentText.slice(0, -1))
          }
        } else {
          if (currentText === currentPhrase) {
            setIsPaused(true)
          } else {
            setCurrentText(currentPhrase.slice(0, currentText.length + 1))
          }
        }
      },
      isPaused ? 1500 : isDeleting ? 30 : 60, // Faster typing and deleting
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, isPaused, currentPhraseIndex])

  return (
    <span className="inline-block">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
