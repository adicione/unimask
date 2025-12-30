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
        elsif word.include?("'")
          word.split("'").map.with_index { |part, i| (i == 0 && part.length < 3) ? part : part.capitalize }.join("'") # Capitalize parts of words with apostrophes, except the first part if it's short.
        elsif word.length >= 3
          word.capitalize # Capitalize words with 3 or more characters.
        else
          word
        end
      end.join(" ")
    end

    def cpf(cpf)
      cpf&.gsub(/(\d{3})(\d{3})(\d{3})(\d{2})/, "\\1.\\2.\\3-\\4")
    end
  end
end
