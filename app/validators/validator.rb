class Validator
  def self.name(name)
    return false unless name.is_a?(String)

    regex = /\A[\p{L}\s'.-]{2,100}\z/u # Letters, apostrophes, hyphens, dots, 2-50 chars.

    name.match?(regex)
  end

  def self.date_of_birth(date)
    return false unless date.is_a?(Date)

    today = Date.today
    age = today.year - date.year
    age -= 1 if today < date.next_year(age)

    age >= 10 && age <= 100
  end

  def self.cpf(cpf)
    cpf = cpf.gsub(/\D/, "") # Remove non-numeric characters.

    return false if cpf.length != 11 # Must have exactly 11 digits.
    return false if cpf.chars.uniq.length == 1 # No repeated consecutive digits.

    # Extract the first 9 digits and the two check digits.
    numbers = cpf[0..8].chars.map(&:to_i)
    verification_digits = cpf[9..10].chars.map(&:to_i)

    # Calculates a CPF check digit.
    calculate_verification_digit = ->(nums, factor) do
      sum = nums.each_with_index.sum { |num, i| num * (factor - i) }
      remainder = sum % 11
      remainder < 2 ? 0 : 11 - remainder
    end

    # Compute the two verification digits.
    first_verification_digit = calculate_verification_digit.call(numbers, 10)
    second_verification_digit = calculate_verification_digit.call(numbers + [ first_verification_digit ], 11)

    # Check if the computed digits match the expected ones.
    verification_digits == [ first_verification_digit, second_verification_digit ]
  end

  def self.email(email)
    return false unless email.is_a?(String) && !email.empty? # Must be a non-empty string.
    return false if email.include?("..") # No consecutive dots.
    return false unless email.count("@") == 1 # Must have exactly one "@".

    local_part, domain_part = email.split("@") # Split into local and domain parts.
    valid_normal_chars = (("a".."z").to_a + ("0".."9").to_a)
    valid_special_chars = [ "-", "." ]
    valid_local_special_chars = (valid_special_chars + [ "_", "+" ])
    valid_local_chars = (valid_normal_chars + valid_special_chars + valid_local_special_chars) # Valid characters for the local part.

    return false if local_part.blank?
    return false unless local_part.chars.all? { |char| valid_local_chars.include?(char) }
    return false if valid_local_special_chars.include?(local_part[0]) || valid_local_special_chars.include?(local_part[-1])

    valid_domain_chars = (valid_normal_chars + valid_special_chars)

    # Domain part validation.
    return false if domain_part.blank?
    return false unless domain_part.chars.all? { |char| valid_domain_chars.include?(char) }
    return false unless domain_part.include?(".")
    return false if valid_special_chars.include?(domain_part[0]) || valid_special_chars.include?(domain_part[-1])

    tld = domain_part.split(".").last

    return false unless tld.length >= 2 # Must be at least 2 characters.
    return false unless tld.chars.all? { |char| ("a".."z").include?(char) } # Only letters.

    true
  end

  def self.br_phone(phone)
    phone = phone.gsub(/[^a-zA-Z0-9]/, "")

    return false if phone.match?(/[a-zA-Z]/) # Only numbers.
    return false if phone.length < 10 || phone.length > 11 # 10 or 11 digits.

    area_code = phone[0..1]
    prefix = phone[2]
    valid_area_codes = %w[
      11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33
      34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55
      61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82
      83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99
    ]

    return false unless valid_area_codes.include?(area_code) # Valid area code.
    return false unless phone.length == 11 ? prefix == "9" : prefix.match?(/[2-5]/) # Mobile or landline valid prefixes.

    remaining_numbers = phone[3..]
    invalid_sequences = (0..9).map { |n| n.to_s * 8 } # Generates [ "00000000", "11111111", ..., "99999999" ].

    return false if invalid_sequences.include?(remaining_numbers) # Check for invalid sequences.

    true
  end
end
