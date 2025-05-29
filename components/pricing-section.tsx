"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const pricingPlans = [
  {
    title: "Basic Learner",
    priceUSD: "$0",
    priceIDR: "Rp 0",
    description: "Perfect for getting started with AI learning",
    features: [
      "Basic AI tutoring (3 subjects)",
      "5 video generations per month",
      "Standard quizzes",
      "Community support",
      "Basic study analytics"
    ]
  },
  {
    title: "Super Learner",
    priceUSD: "$19",
    priceIDR: "Rp 299K",
    description: "Unlock your full learning potential",
    features: [
      "Advanced AI tutoring (all subjects)",
      "Unlimited video generations",
      "Adaptive quizzes with insights",
      "Priority 24/7 support",
      "Custom learning paths",
      "Advanced progress analytics",
      "Study group collaboration",
      "API access for integrations"
    ]
  }
];

export function PricingSection() {
  const [currency, setCurrency] = useState<"USD" | "IDR">("USD");

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Promo Banner */}
        <div className="mb-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-center gap-2 text-lg font-medium text-gray-900">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>During finals week, ReLearn is free for university students!</span>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start for free, upgrade when you need more features.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-gray-100 p-1 rounded-full">
            <button 
              onClick={() => setCurrency("USD")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currency === "USD" 
                  ? "bg-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              USD
            </button>
            <button 
              onClick={() => setCurrency("IDR")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currency === "IDR" 
                  ? "bg-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              IDR
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-2xl bg-white shadow-sm border ${
                index === 1 ? 'border-black' : 'border-gray-100'
              } hover:shadow-md transition-shadow relative`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-medium mb-2">{plan.title}</h3>
              <div className="text-4xl font-bold mb-4">
                {currency === "USD" ? plan.priceUSD : plan.priceIDR}
                <span className="text-lg font-normal text-gray-600">/mo</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${
                  index === 1 
                    ? 'bg-black hover:bg-gray-800 text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                variant={index === 1 ? "default" : "outline"}
              >
                {index === 0 ? 'Start for free' : 'Get started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 