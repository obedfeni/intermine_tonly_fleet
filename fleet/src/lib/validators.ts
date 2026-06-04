export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters' }
  return { valid: true, message: '' }
}

export function validateRequired(value: string, fieldName: string): { valid: boolean; message: string } {
  if (!value || !value.trim()) return { valid: false, message: `${fieldName} is required` }
  return { valid: true, message: '' }
}

export function validateBattery(value: number): boolean {
  return value >= 0 && value <= 100
}

export function validateRegisterForm(data: { name: string; email: string; password: string; confirmPassword: string }) {
  const errors: Record<string, string> = {}
  if (!data.name.trim()) errors.name = 'Name is required'
  if (!validateEmail(data.email)) errors.email = 'Valid email is required'
  const pwCheck = validatePassword(data.password)
  if (!pwCheck.valid) errors.password = pwCheck.message
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return { errors, isValid: Object.keys(errors).length === 0 }
}

export function validateChargingForm(data: { truckId: string; startTime: string; startBattery: string; stationId: string }) {
  const errors: Record<string, string> = {}
  if (!data.truckId) errors.truckId = 'Truck is required'
  if (!data.startTime) errors.startTime = 'Start time is required'
  if (!data.startBattery || isNaN(Number(data.startBattery))) errors.startBattery = 'Valid battery level required'
  if (!data.stationId) errors.stationId = 'Station ID is required'
  return { errors, isValid: Object.keys(errors).length === 0 }
}
