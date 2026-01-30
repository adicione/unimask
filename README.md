# Unimask

Unimask provides unified input masking, display formatting and validation for Rails applications, with backend normalization and Stimulus powered frontend methods.

## Installation

Add this line to your application's Gemfile:

```ruby
gem "unimask", git: "https://github.com/adicione/unimask"
```

And run...

```bash
bundle install
```

## Usage

To use Unimask, simply attach it to your form container or any display element:

**Inputs inside a form:**

```html
<form data-controller="masking validation">
  <input data-mask="cpf">
</form>
```

```ruby
f.text_field :number, data: { mask: "cpf", validate: "cpf" }
```

**Ruby validation:**

The `Validator` class will be available with the following methods:

- name (Letters, apostrophes, hyphens, dots and 2-50 chars.)
- date_of_birth (Real date and age from 10 to 100.)
- cpf - (Brazilian CPF.)
- email - (Email regex.)
- br_phone - (Only numbers, amout of digits, valid area code, mobile and landline prefixes, frequent invalid sequences.)

```ruby
Validate.name(string)
```

> **Note:** Those methods will always return `true` or `false` based on the string passed.

In the model:

```ruby
validates :document, cpf: true, allow_blank: true
validates :date_of_birth, date_of_birth: true, on: :create, allow_blank: true
```

We also have a ruby validation feedback you can add to your form:

```ruby
render Application::ValidationFeedbackComponent.new @address
```

Or simply:

```ruby
validation_feedback @address
```


**Display-only elements:**

```ruby
"ayres narita".mask :name
```

```ruby
@user.contacts.first.content.mask :br_phone
```

> **Note:** In Ruby, mask names like `"br-phone"` must be written using underscores and symbols, like `:br_phone`.

## Available Masks

You can apply any of the following masks by adding the corresponding `data-mask="..."` to any input or display element.

| Mask           | Description |
|----------------|-------------|
| `date`         | Date in `DD/MM/YYYY` format. |
| `br-phone`     | Brazilian phones numbers. `(11) 98888-7777` or `(11) 5888-7777`. |
| `cpf`          | CPF numbers. `123.456.789-01`. |
| `only-numbers` | Number fields. `12345`. |
| `cep`          | Brazilian postal codes (CEP). `12345-678`. |

## Available Validations

You can apply any of the following masks by adding the corresponding `data-validate="..."` to any input element.

| Validation     | Description |
|----------------|-------------|
| `date`         | Date in `DD/MM/YYYY` format. |
| `br-phone`     | Brazilian phones numbers. `(11) 98888-7777` or `(11) 5888-7777`. |
| `cpf`          | CPF numbers. `123.456.789-01`. |
| `only-numbers` | Number fields. `12345`. |
| `cep`          | Brazilian postal codes (CEP). `12345-678`. |

## TODO

| Mask           | Description |
|----------------|-------------|
| `letters`      | Only letters (A–Z, a–z). |
| `cnpj`         | CNPJ numbers. `12.345.678/0001-99`. |
| `brl`          | Brazilian Real currency. `R$ 1.234,56`. |
| `usd`          | US Dollar currency. `$1,234.56`. |
| `br-plate`     | Brazilian vehicle license plates. `ABC-1234`. |
