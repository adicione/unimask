class BrPhoneValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless Validator.br_phone value
      record.errors.add(attribute, :invalid)
    end
  end
end
