"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Delete, Plus, Minus, Divide, Equal, Asterisk } from "lucide-react"

export default function Calculator() {
  const [input, setInput] = useState("0")
  const [result, setResult] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [animateEqual, setAnimateEqual] = useState(false)

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleNumber(e.key)
      else if (e.key === ".") handleDecimal()
      else if (e.key === "+") handleOperator("+")
      else if (e.key === "-") handleOperator("-")
      else if (e.key === "*") handleOperator("×")
      else if (e.key === "/") handleOperator("÷")
      else if (e.key === "Enter" || e.key === "=") handleCalculate()
      else if (e.key === "Backspace") handleBackspace()
      else if (e.key === "Escape") handleClear()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [input])

  const handleNumber = (num: string) => {
    setInput((prev) => {
      if (prev === "0") return num
      return prev + num
    })
  }

  const handleDecimal = () => {
    const lastNumber = input.split(/[+\-×÷]/).pop() || ""
    if (!lastNumber.includes(".")) {
      setInput((prev) => prev + ".")
    }
  }

  const handleOperator = (operator: string) => {
    // Replace the last operator if the last character is an operator
    if (["+", "-", "×", "÷"].includes(input.slice(-1))) {
      setInput((prev) => prev.slice(0, -1) + operator)
    } else {
      setInput((prev) => prev + operator)
    }
  }

  const handleClear = () => {
    setInput("0")
    setResult("")
  }

  const handleBackspace = () => {
    setInput((prev) => {
      if (prev.length === 1) return "0"
      return prev.slice(0, -1)
    })
  }

  const handleCalculate = () => {
    try {
      // Replace × and ÷ with * and / for evaluation
      const expression = input.replace(/×/g, "*").replace(/÷/g, "/")

      // Evaluate the expression
      const calculatedResult = eval(expression).toString()

      // Add to history
      setHistory((prev) => [...prev, `${input} = ${calculatedResult}`])

      // Set result and input
      setResult(calculatedResult)
      setInput(calculatedResult)

      // Trigger animation
      setAnimateEqual(true)
      setTimeout(() => setAnimateEqual(false), 300)
    } catch (error) {
      setResult("Error")
    }
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-xl overflow-hidden border border-white/20">
        {/* Display */}
        <div className="p-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-white/70 hover:text-white transition-colors text-sm">
                Clear History
              </button>
            )}
          </div>

          {showHistory && (
            <div className="mb-4 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {history.map((item, index) => (
                <div key={index} className="text-white/70 text-sm mb-1">
                  {item}
                </div>
              ))}
              {history.length === 0 && <div className="text-white/50 text-sm">No history yet</div>}
            </div>
          )}

          <div className="text-right">
            <div className="text-white/70 text-lg h-6 overflow-x-auto whitespace-nowrap">{result && `${input} =`}</div>
            <div className="text-white text-4xl font-light mt-1 overflow-x-auto whitespace-nowrap">{input}</div>
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900/90">
          <CalcButton onClick={handleClear} className="bg-red-500/80 hover:bg-red-500">
            C
          </CalcButton>
          <CalcButton onClick={handleBackspace}>
            <Delete size={18} />
          </CalcButton>
          <CalcButton onClick={() => handleOperator("÷")} className="text-cyan-400">
            <Divide size={18} />
          </CalcButton>
          <CalcButton onClick={() => handleOperator("×")} className="text-cyan-400">
            <Asterisk size={18} />
          </CalcButton>

          <CalcButton onClick={() => handleNumber("7")}>7</CalcButton>
          <CalcButton onClick={() => handleNumber("8")}>8</CalcButton>
          <CalcButton onClick={() => handleNumber("9")}>9</CalcButton>
          <CalcButton onClick={() => handleOperator("-")} className="text-cyan-400">
            <Minus size={18} />
          </CalcButton>

          <CalcButton onClick={() => handleNumber("4")}>4</CalcButton>
          <CalcButton onClick={() => handleNumber("5")}>5</CalcButton>
          <CalcButton onClick={() => handleNumber("6")}>6</CalcButton>
          <CalcButton onClick={() => handleOperator("+")} className="text-cyan-400">
            <Plus size={18} />
          </CalcButton>

          <CalcButton onClick={() => handleNumber("1")}>1</CalcButton>
          <CalcButton onClick={() => handleNumber("2")}>2</CalcButton>
          <CalcButton onClick={() => handleNumber("3")}>3</CalcButton>
          <CalcButton
            onClick={handleCalculate}
            className={cn(
              "row-span-2 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500",
              animateEqual && "animate-pulse",
            )}
          >
            <Equal size={18} />
          </CalcButton>

          <CalcButton onClick={() => handleNumber("0")} className="col-span-2">
            0
          </CalcButton>
          <CalcButton onClick={handleDecimal}>.</CalcButton>
        </div>
      </div>
    </div>
  )
}

interface CalcButtonProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
}

function CalcButton({ children, onClick, className }: CalcButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "aspect-square flex items-center justify-center rounded-xl text-xl font-medium text-white",
        "bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors",
        "border border-white/10",
        className,
      )}
    >
      {children}
    </motion.button>
  )
}

