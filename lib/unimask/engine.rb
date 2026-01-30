module Unimask
  class Engine < ::Rails::Engine
    initializer "unimask.core" do
      require Engine.root.join("app/core/string.rb") # Makes the mask method a string method.
    end

    initializer "unimask.view_helpers" do
      ActiveSupport.on_load(:action_view) do
        include Unimask::Helper
      end
    end

    initializer "unimask.controllers" do |app|
      app.config.assets.paths << Engine.root.join("app/javascript")
    end

    initializer "unimask.importmap", before: "importmap" do |app|
      app.config.importmap.paths << Engine.root.join("config/importmap.rb")
      app.config.importmap.cache_sweepers << Engine.root.join("app/javascript")
    end
  end
end
