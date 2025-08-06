# Unimask

Use it to display formatted data and apply input masks seamlessly.

## Usage

To use Unimask, simply attach it to your form container or any display element:

**For inputs inside a form:**

```html
<form data-controller="masking">
  <input type="text" class="mask-cpf">
</form>
```

**Validation:**

```html
<form data-controller="masking">
  <input type="text" class="validate-cpf">
</form>
```

**For display-only elements:**

```html
<span data-controller="masking" data-mask="cpf">30117647861</span>
```

Unimask automatically detects if it's working with an input or a display element and applies the correct behavior.

## Installation

Add this line to your application's Gemfile:

```ruby
gem "unimask", path: "lib/unimask"
```

## Dependencies

Unimask ships its own controllers in `app/javascript/controllers/` inside the engine, and they are automatically registered if you use Importmap or a bundler.