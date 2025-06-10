"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (data: StudentData) => void
}

interface StudentData {
  country: string
  university: string
  course: string
  year: number
}

const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Other"]

const COURSES = ["Law", "Engineering", "Medicine", "Business", "Computer Science", "Other"]

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<StudentData>>({})

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(data as StudentData)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.country
      case 2:
        return data.university
      case 3:
        return data.course
      case 4:
        return data.year
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">Welcome to ExamGPT! 🎓</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">Let's personalize your experience</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mobile-Optimized Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-black scale-110" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">Where are you studying?</h3>
                <p className="text-sm text-gray-600">This helps us provide region-specific content</p>
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <Select value={data.country} onValueChange={(value) => setData({ ...data, country: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">Your Institution</h3>
                <p className="text-sm text-gray-600">We'll tailor content to your university's curriculum</p>
              </div>
              <div>
                <Label htmlFor="university" className="text-sm font-medium">
                  University/College
                </Label>
                <Input
                  id="university"
                  placeholder="e.g., Delhi University, IIT Bombay"
                  value={data.university || ""}
                  onChange={(e) => setData({ ...data, university: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">Your Field of Study</h3>
                <p className="text-sm text-gray-600">This helps us provide subject-specific guidance</p>
              </div>
              <div>
                <Label htmlFor="course" className="text-sm font-medium">
                  Course/Major
                </Label>
                <Select value={data.course} onValueChange={(value) => setData({ ...data, course: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSES.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">Academic Level</h3>
                <p className="text-sm text-gray-600">We'll adjust complexity based on your year</p>
              </div>
              <div>
                <Label htmlFor="year" className="text-sm font-medium">
                  Current Year
                </Label>
                <Select
                  value={data.year?.toString()}
                  onValueChange={(value) => setData({ ...data, year: Number.parseInt(value) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                    <SelectItem value="5">5th Year</SelectItem>
                    <SelectItem value="6">6th Year+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Mobile-Optimized Navigation */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={!isStepValid()} className="flex-1">
              {step === 4 ? "Get Started 🚀" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
