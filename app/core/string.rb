class String
  def mask(type)
    Class.new.extend(Unimask::Helper).mask(type => self)
  end
end
