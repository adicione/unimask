# frozen_string_literal: true

class Application::ValidationFeedbackComponent < ViewComponent::Base
  def initialize(record)
    @record = record
  end

  def render?
    @record.errors.any?
  end

  def messages
    messages = @record.errors.map do |error|
      raw_attribute = error.attribute.to_s

      attribute = @record.class.human_attribute_name(raw_attribute)

      # Assumes it's nested when it has a dot
      # separating the attribute in two.
      if raw_attribute.include?(".")
        model, attribute = raw_attribute.split(".", 2)
        model = model.singularize.classify.constantize
        attribute = model.human_attribute_name(attribute).downcase

        attribute = "#{ model.model_name.human } #{ attribute }"
      end

      message = []
      message << "-"
      message << attribute unless error.attribute == :base # Will not print the attribute when the error is attached to base.
      message << error.message

      message.join(" ")
    end

    messages.join("<br>").html_safe
  end
end
