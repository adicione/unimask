# Unimask

Unimask provides unified input masking and display formatting for Rails applications, with backend normalization and Stimulus powered frontend masks.

## Installation

Add this line to your application's Gemfile:

```ruby
gem "unimask", git: "https://github.com/adicione/unimask"
```

And run...

```bash
bundle install
```

> **Note:** Unimask requires Stimulus to be installed and configured to scan `app/javascript/controllers/` for controllers.

## Usage

To use Unimask, simply attach it to your form container or any display element:

**Inputs inside a form:**

```html
<form data-controller="masking">
  <input data-mask="cpf">
</form>
```

**Display-only elements:**

```html
<span data-controller="masking" data-mask="cpf">30117647862</span>
```

```html
<span data-controller="masking">
  <span data-mask="cpf">30117647862</span>
  <span data-mask="br-phone">11982811112</span>
</span>
```

## Available Masks

You can apply any of the following masks by adding the corresponding `data-mask="..."` to any input or display element.

| Mask key            | Description |
|---------------------|-------------|
| `only-letters` | Only letters (A–Z, a–z). |
| `name`         | Proper person name. |
| `date`         | Date in `DD/MM/YYYY` format. |
| `br-phone`     | Brazilian phones numbers. `(11) 98888-7777` or `(11) 5888-7777`. |
| `cpf`          | CPF numbers. `123.456.789-01`. |
| `cnpj`         | CNPJ numbers. `12.345.678/0001-99`. |
| `brl`          | Brazilian Real currency. `R$ 1.234,56`. |
| `usd`          | US Dollar currency. `$1,234.56`. |
| `cep`          | Brazilian postal codes (CEP). `12345-678`. |
| `br-plate`     | Brazilian vehicle license plates. `ABC-1234`. |
