class World
  def initialize
    r = Random.new
    temperatures = [-3,-2,-1,0,1,2,3]
    gravities = [-3,-2,-1,0,1,2,3]
    suns = [0] + [1]*18 + [2]
    day_lengths = (1..1440).to_a # minutes of gameplay
    breathabilities = ["Normal"]*4 + ["Low"]*2 + ["None"] 
    @temperature = temperatures[r.rand(temperatures.length)]
    @gravity = gravities[r.rand(gravities.length)]
    @suns = suns[r.rand(suns.length)]
    @day_length = day_lengths[r.rand(day_lengths.length)]
    @breathability = breathabilities[r.rand(breathabilities.length)]
  end

  def get_temperature 
    return @temperature 
  end

  def get_gravity
    return @gravity
  end

  def get_suns
    return @suns
  end

  def get_day_length
    return @day_length
  end

  def get_breathability
    return @breathability
  end

end

class Substance
  def initialize
    @name = "Gocomium"
    @opacity = "None"
    @texture = "Grainy"
    @fertile = "Yes"
    @toughneess = "Soft"
    @bounciness = "None"
    @slipperiness = "Slight"
    @color = "light green"
    @toxicity = "None"
    @mass = "heavy"
    @heat_effect = "texture changes to crystal, loses reactivity"
    @glow = "slight"
    @reactivity = "explodes in contact with air"
  end
end

w = World.new
puts "*** New World ***"
puts "Temperature: " + w.get_gravity.to_s
puts "Gravity: " + w.get_temperature.to_s
puts "Suns: " + w.get_suns.to_s
puts "Day Length: " + w.get_day_length.to_s + " minutes"
puts "Air Breathability: " + w.get_breathability.to_s
