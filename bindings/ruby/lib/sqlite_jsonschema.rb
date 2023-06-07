require "version"

module SqliteJsonschema
  class Error < StandardError; end
  def self.jsonschema_loadable_path
    File.expand_path('../jsonschema0', __FILE__)
  end
  def self.load(db)
    db.load_extension(self.jsonschema_loadable_path)
  end
end
