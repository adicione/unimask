module Unimask
  module Helper
    def mask(**args)
      return if args.empty?

      mask_type, value = args.first

      return unless value.present?

      case mask_type.to_sym
      when :name
        name(value)
      when :cpf
        cpf(value)
      when :br_phone
        br_phone(value)
      else
        value
      end
    end

    private

    def name(name)
      roman_numeral_regex = /\A(?=[MDCLXVI])M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\z/i

      name.split.map do |word|
        if word.match?(roman_numeral_regex)
          word.upcase
        elsif word.include?("'") # Capitalize parts of words with apostrophes, except the first part if it's short.
          # TODO : Tratar nomes como D'Costa que hoje estão deixando a letra D antes da ' minuscula
          # o problema se repete para menos de 3 letras antes do '.
          word.split("'").map.with_index { |part, i| (i == 0 && part.length < 3) ? part : part.capitalize }.join("'")
        elsif word.length >= 3 || word.in?([ "av", "ap" ]) # Capitalize words with 3 or more characters or Av (avenida) Ap (apartamento).
          word.capitalize
        else
          word
        end
      end.join(" ")
    end

    def cpf(cpf)
      cpf&.gsub(/(\d{3})(\d{3})(\d{3})(\d{2})/, "\\1.\\2.\\3-\\4")
    end

    def br_phone(phone)
      digits = phone.to_s.gsub(/\D/, "")

      return nil if digits.empty?

      digits = digits.sub(/\A55/, "") if digits.length >= 12 # Removes DDI 55

      case digits.length
      when 10
        digits.gsub(/(\d{2})(\d{4})(\d{4})/, "(\\1) \\2-\\3") # Landline: AA + NNNN + NNNN
      when 11
        digits.gsub(/(\d{2})(\d{5})(\d{4})/, "(\\1) \\2-\\3") # Mobile: AA + NNNNN + NNNN
      else
        phone # Fallback: do not format if no match
      end
    end
  end
end
