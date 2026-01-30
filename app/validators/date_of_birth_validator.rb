class DateOfBirthValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless Validator.date_of_birth value
      record.errors.add(attribute, :invalid)
    end
  end
end
