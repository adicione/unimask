# Unimask.

Unimask provides unified input masking and display formatting for Rails applications, with backend normalization and Stimulus-powered frontend masks.

## Installation.

Add this line to your application's Gemfile:

```ruby
gem "unimask", path: "lib/unimask"
```

And run...

```bash
bundle install
```

> **Note:** Stimulus must be configured to scan `app/javascript/controllers/` for controllers. This is the default when running `bin/rails stimulus:install` in a Rails app.

## Usage.

To use Unimask, simply attach it to your form container or any display element:

**Inputs inside a form:**

```html
<form data-controller="masking">
  <input type="text" class="mask-cpf">
</form>
```

**Display-only elements:**

```html
<span data-controller="masking" class="mask-cpf">30117647861</span>
```

## Available Masks

You can apply any of the following masks by adding the corresponding CSS class to your input field,  
or by using `data-mask="..."` for display elements.

| Mask key            | Description |
|---------------------|-------------|
| `mask-only-letters` | Allows only letters (A–Z, a–z). Removes numbers, punctuation, and special characters. |
| `mask-name`         | Formats a name: capitalizes first letters and removes invalid characters. |
| `mask-date`         | Formats as a date in `DD/MM/YYYY` format. |
| `mask-br-phone`     | Formats Brazilian phone numbers (mobile and landline), e.g. `(11) 98888-7777`. |
| `mask-cpf`          | Formats Brazilian CPF numbers, e.g. `123.456.789-01`. |
| `mask-cnpj`         | Formats Brazilian CNPJ numbers, e.g. `12.345.678/0001-99`. |
| `mask-brl`          | Formats as Brazilian Real currency, e.g. `R$ 1.234,56`. |
| `mask-usd`          | Formats as US Dollar currency, e.g. `$1,234.56`. |
| `mask-cep`          | Formats Brazilian postal codes (CEP), e.g. `12345-678`. |
| `mask-br-plate`     | Formats Brazilian vehicle license plates, e.g. `ABC-1234`. |

**Example usage in a form:**
```html
<input type="text" class="mask-cpf">
<input type="text" class="mask-br-phone">
```

**Example usage in display mode:**
```html
<span data-controller="masking" class="mask-cpf">30117647861</span>
```
