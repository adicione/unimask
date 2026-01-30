import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("Validation controller connected.")
  }

  disconnect() {
    console.log("Validation controller disconnected.")

    this.fields.forEach(field => { field.removeEventListener("input", () => this.validateFields(field)) })

    this.fields = null
    this.submitButton = null
  }

  initialize() {
    this.validations = {
      "letters": this.validateOnlyLetters.bind(this),
      "email": this.validateEmail.bind(this),
      "br-phone": this.validateBrPhone.bind(this),
      "cpf": this.validateCpf.bind(this),
      "date": this.validateDate.bind(this)
    }
    this.modalController = this.getModalController()
    this.fields = Array.from(this.element.querySelectorAll("input, textarea, select")).filter(field => this.matchValidationKey(field) || field.required)
    this.submitButton = this.element.querySelector("button[type='submit'], input[type='submit']")

    this.fields.forEach(field => {
      field.addEventListener("input", event => {
        field.inputType = event.inputType
        field.validation = this.getValidation(field)

        this.validateField(field)
      })
    })
    this.submitButton.addEventListener("click", event => this.handleSubmit(event))
  }

  // Engine.

  matchValidationKey(field) {
    return field.dataset.validate
  }

  getValidation(field) {
    const key = this.matchValidationKey(field)

    return key ? this.validations[key] : null
  }

  getModalController() {
    let current = this.submitButton

    // Loops through parents until it finds a modal.
    while (current) {
      const controllers = current.getAttribute("data-controller")?.split(/\s+/) || [] // Controllers from current element.
  
      if (controllers.includes("modal")) {
        const modalController = this.application.getControllerForElementAndIdentifier(current, "modal")

        return modalController
      }
  
      current = current.parentElement
    }
  
    return false
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.validateFields()) {
      if (this.modalController) {
        this.modalController.hideModal() // Hides modal if controller found.
      }

      this.element.requestSubmit()
    }
  }

  validateField(field) {
    const hasValue = field.value.trim().length > 0
    const validateRequired = field.required ? hasValue : true
    const validateField = field.validation ? field.validation(field) : true
    const isValid = hasValue ? validateField : validateRequired

    field.classList.toggle("is-invalid", !isValid)

    this.submitButton.disabled = !isValid

    return isValid
  }

  validateFields() {
    const results = this.fields.map(field => {
      return this.validateField(field)
    })
    const allValid = !results.includes(false) // Check for invalid inputs.

    this.submitButton.disabled = !allValid

    return allValid
  }

  // Validations.

  validateBrPhone(field) {
    const cleanPhone = field.value.replace(/\D/g, "")
    const phoneRegex = /^((1[1-9]|2[1-9]|3[1-9]|4[1-9]|5[1-9]|6[1-9]|7[1-9]|8[1-9]|9[1-9])(9[1-9][0-9]{7}|[2-5][0-9]{7})|(4004[0-9]{4}))$/

    return phoneRegex.test(cleanPhone) || cleanPhone.length == 0
  }

  validateCpf(field) {
    const cleanCpf = field.value.replace(/\D/g, "")
    const digits = cleanCpf.split("").map(Number)

    if (cleanCpf.length !== 11) return false // Needs 11 digits.
    if (digits.every(digit => digit === digits[0])) return false // Can't be all the same.

    // First verification digit.
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit > 9) digit = 0
    if (digit !== digits[9]) return false

    // Second verification digit.
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit > 9) digit = 0
    return digit === digits[10]
  }

  validateDate(field) {
    const date = field.value.replace(/[^0-9/]/g, "").slice(0, 10)
    const dateParts = date.split("/")

    if (dateParts.length !== 3) return false // Needs 3 parts.

    const [ day, month, year ] = dateParts

    if (day < 1 || day > 31 || day.length !== 2) return false // Valid day.
    if (month < 1 || month > 12 || month.length !== 2) return false // Valid month.
    if (year.length !== 4) return false // Valid year.

    const formattedDate = `${ year }-${ month }-${ day }`
    const dateObject = new Date(formattedDate)

    return !isNaN(dateObject.getTime()) // Check if it's a valid date.
  }

  // Not tested.

  validateEmail(field) {
    const emailRegex = /^(?:[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i
    const email = field.value

    return emailRegex.test(email) || email.length == 0
  }

  validateOnlyLetters(field) {
    return /^[A-Za-z]+$/.test(field.value)
  }
}
