class TaxCalculatorController < ApplicationController

  FEDERAL_TAX_BRACKETS = {
    '10%' => [0, 11000],
    '12%' => [11001, 44725],
    '22%' => [44726, 95375],
    '24%' => [95376, 182100],
    '32%' => [182101, 231250],
    '35%' => [231251, 578125],
    '37%' => [578126, Float::INFINITY] 
  }



  def calculate_federal_tax(income)
    tax = 0
    standard_deduction = 13850
    income -= standard_deduction

    FEDERAL_TAX_BRACKETS.each do |rate, (lower_bound, upper_bound)|
      if income > lower_bound
        taxable_amount = [income - lower_bound, upper_bound - lower_bound].min
        tax += taxable_amount * (rate.to_f / 100)
      end
    end

    tax
  end

  def social_security_tax(income)
    income * 0.062
  end

  def medicare_tax(income)
    income * 0.0145
  end

  def total_federal_tax(income)
    calculate_federal_tax(income) + social_security_tax(income) + medicare_tax(income)
  end


  def tax
    @value = total_federal_tax(100000)
  end

end
