class NameValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless Validator.name value
      record.errors.add(attribute, :invalid)
    end
  end
end
