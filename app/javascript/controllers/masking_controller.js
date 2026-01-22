import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("Masking controller connected.")

    this.setup()
  }

  disconnect() {
    console.log("Masking controller disconnected.")

    this.masks = null

    if (this.fields_to_mask) {
      this.fields_to_mask.forEach(({ target, handler }) => { target.removeEventListener("input", handler) })
      this.fields_to_mask = null
    }
  }

  setup() {
    this.masks = {
      "only-letters": this.maskOnlyLetters,
      "only-numbers": this.maskOnlyNumbers,
      "date": this.maskDate,
      "br-phone": this.maskBrPhone,
      "cpf": this.maskCpf,
      "cnpj": this.maskCnpj,
      "brl": this.maskBrl,
      "usd": this.maskUsd,
      "cep": this.maskCep,
      "br-plate": this.maskBrPlate
    }

    // Determine if this controller's root element is a form to choose between interactive and static masking.
    if (this.element.tagName === "FORM") {
      this.fields_to_mask = Array.from(this.element.querySelectorAll("[data-mask]")).map(target => {
        const handler = event => { this.maskInput(target, event.inputType) }

        target.addEventListener("input", handler)

        this.maskInput(target)

        return { target, handler }
      })
    } else {
      const targets = this.element.hasAttribute("data-mask")
        ? [ this.element, ...this.element.querySelectorAll("[ data-mask ]") ]
        : Array.from(this.element.querySelectorAll("[ data-mask ]"))

      targets.forEach(target => { this.maskDisplay(target) })
    }
  }

  maskDisplay(target) {
    if (!target.textContent) return

    target.textContent = this.masks[target.dataset.mask].call(this, target.textContent).result
  }

  maskInput(target, inputType = "insertText") {
    if (!target.value) return

    let position = target.selectionEnd

    target.value = target.mask.result

    if (document.activeElement !== target) return // Adjusts position based on inputType and maskPosition if focused.

    const isInsertion = !["deleteContentBackward", "deleteContentForward"].includes(inputType)

    while (target.mask.maskPositions.includes(position)) { if (isInsertion) { position++ } else { position-- } }

    target.setSelectionRange(position, position)
  }

  // Masks.

  maskBrPhone(phone) {
    phone = phone.replace(/\D/g, "") // Non-numeric.
    phone = phone.replace(/^0+/, "") // Leading zeroes.
    if (phone.length >= 13 && phone.startsWith("55")) {
      phone = phone.slice(2) // Country code if present.
    }
    phone = phone.slice(0, 11) // 11 digits.

    const result = phone
      .replace(/^(?=\d{0,2}$)(\d{1,2})/, "($1")
      .replace(/^(?=\d{3,6}$)(\d{2})(\d{1,4})/, "($1) $2")
      .replace(/^(?=\d{7,10}$)(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3")
      .replace(/^(?=\d{11}$)(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    const maskPositions = [ 1, 4, 5, ((phone.length <= 10) ? 10 : 11) ]

    return { result, maskPositions }
  }

  maskCpf(cpf) {
    const result = cpf
      .replace(/\D/g, "").slice(0, 11)
      .replace(/^(?=\d{1,6}$)(\d{3})(\d)/, "$1.$2")
      .replace(/^(?=\d{7,9}$)(\d{3})(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(?=\d{10,11}$)(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4")
    const maskPositions = [ 4, 8, 12 ]

    return { result, maskPositions }
  }

  maskDate(date) {
    let result = date.replace(/\D/g, "").slice(0, 8)
    result = result
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})\/(\d{2})(\d{1,4})/, "$1/$2/$3")
    const maskPositions = [ 3, 6 ]

    return { result, maskPositions }
  }

  maskOnlyNumbers(string) {
    const result = string.replace(/[^0-9]/g, "")
    const maskPositions = []

    return { result, maskPositions }
  }

  maskCep(cep) {
    let result = cep.replace(/\D/g, "").slice(0, 8)
    result = result.replace(/^(\d{5})(\d{1,3})$/, "$1-$2")
    const maskPositions = [ 6 ]

    return { result, maskPositions }
  }

  // Not tested masks.

  maskOnlyLetters(string) {
    const result = string.replace(/[^A-Z]/gi, "")
    const maskPositions = []

    return { result, maskPositions }
  }

  maskCnpj(cnpj) {
    let result = cnpj.replace(/\D/g, "").slice(0, 14)
    result = result
      .replace(/^(?=\d{1,5}$)(\d{2})(\d)/, "$1.$2")
      .replace(/^(?=\d{6,8}$)(\d{2})(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(?=\d{9,12}$)(\d{2})(\d{3})(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/^(?=\d{13,14}$)(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5")
    const maskPositions = [ 2, 6, 10, 15 ]

    return { result, maskPositions }
  }

  maskBrl(cents) {
    const rawCents = cents.replace(/\D/g, "").replace(/^0+/, "")
    let result = rawCents // Set differently as it will determine mask positions.

    // Pads the cents with zeroes if any.
    if (rawCents.length >= 1) { result = rawCents.padStart(3, "0") }

    result = result.replace(/^(\d+)(\d{2})$/, "R$ $1,$2")

    // Start the mask positions as
    // the R$ plus a space will always be there.
    let maskPositions = [ 0, 1, 2 ]

    // The zeroes before the first number
    if (rawCents.length <= 2) { maskPositions.push(4) }
    if (rawCents.length == 1) { maskPositions.push(6) }

    // The comma.
    maskPositions.push(result.length - 2)

    // Retorna o resultado formatado e as posições da máscara
    return { result, maskPositions }
  }

  maskUsd(cents) {
    const rawCents = cents.replace(/\D/g, "").replace(/^0+/, "")
    let result = rawCents // Set differently as it will determine mask positions.

    // Pads the cents with zeroes if any.
    if (rawCents.length >= 1) { result = rawCents.padStart(3, "0") }

    result = result.replace(/^(\d+)(\d{2})$/, "$ $1.$2")

    // Start the mask positions as
    // the $ plus a space will always be there.
    let maskPositions = [ 0, 1 ]

    // The zeroes before the first cent.
    if (rawCents.length <= 2) { maskPositions.push(3) }
    if (rawCents.length == 1) { maskPositions.push(5) }

    // The comma.
    maskPositions.push(result.length - 2)

    // Retorna o resultado formatado e as posições da máscara
    return { result, maskPositions }
  }
  
  maskBrPlate(plate) {
    // Uppercase, removes non-alphanumeric and keeps under 7 characters.
    let result = plate.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 7)

    const letterPositions = [ 1, 2, 3 ]
    letterPositions.forEach(position => {
      if (result.length >= position && !/[A-Z]/.test(result[position - 1])) {
        result = result.slice(0, position - 1)
      }
    })

    const digitPositions = [ 4, 6, 7 ]
    digitPositions.forEach(position => {
      if (result.length >= position && !/\d/.test(result[position - 1])) {
        result = result.slice(0, position - 1)
      }
    })

    if (result.length >= 5 && !/[A-J0-9]/.test(result[4])) {
      result = result.slice(0, 4) // Accepts only 0-9 or A-J...
    }

    result = result.replace(/^([A-Z]{3})(.)/, "$1-$2")

    const maskPositions = [ 2 ]

    return { result, maskPositions }
  }
}
