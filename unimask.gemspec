require_relative "lib/unimask/version"

Gem::Specification.new do |spec|
  spec.name        = "unimask"
  spec.version     = Unimask::VERSION
  spec.authors     = [ "Ayres Narita" ]
  spec.email       = [ "eu@ayresnarita.com" ]
  spec.homepage    = "https://github.com/adicione/unimask"
  spec.summary     = "Unified input masking and display formatting for Rails."
  spec.description = "Unimask provides unified input masking and display formatting for Rails applications, with Stimulus-powered frontend masks."

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = "https://github.com/adicione/unimask/blob/main/CHANGELOG.md"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{ app,config,db,lib }/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end
end
