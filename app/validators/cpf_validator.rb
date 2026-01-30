class CpfValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless Validator.cpf value
      record.errors.add(attribute, :invalid)
    end
  end
end
