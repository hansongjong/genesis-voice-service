import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, auth } from '../lib/api';
import { Check, Crown } from 'lucide-react';

export default function Pricing() {
  const [plans, setPlans] = useState(null);
  const isLoggedIn = auth.isLoggedIn();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await api.getPlans();
      if (res.success) {
        setPlans(res.plans);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
    }
  };

  const planCards = [
    {
      key: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for trying out',
      features: [
        '10,000 characters/month',
        '50 generations/month',
        'Basic voices',
        'Standard quality'
      ],
      highlight: false
    },
    {
      key: 'starter',
      name: 'Starter',
      price: 9900,
      description: 'For content creators',
      features: [
        '100,000 characters/month',
        '500 generations/month',
        'Premium voices',
        'High quality audio',
        'Priority support'
      ],
      highlight: false
    },
    {
      key: 'pro',
      name: 'Pro',
      price: 29900,
      description: 'For professionals',
      features: [
        '500,000 characters/month',
        '2,000 generations/month',
        'All premium voices',
        'Custom voice cloning',
        'API access',
        '24/7 support'
      ],
      highlight: true
    },
    {
      key: 'enterprise',
      name: 'Enterprise',
      price: 99900,
      description: 'For large teams',
      features: [
        'Unlimited characters',
        'Unlimited generations',
        'All voices + custom',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations'
      ],
      highlight: false
    }
  ];

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planCards.map((plan) => (
            <div
              key={plan.key}
              className={`bg-white rounded-2xl border-2 p-6 relative ${
                plan.highlight
                  ? 'border-blue-500 shadow-xl'
                  : 'border-gray-100 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? 'Free' : `${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-sm ml-1">KRW/mo</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={isLoggedIn ? '/dashboard' : '/register'}
                className={`block w-full py-3 text-center font-medium rounded-xl transition-colors ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.price === 0 ? 'Get Started' : 'Subscribe'}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">What counts as a character?</h3>
              <p className="text-gray-600 text-sm">Every letter, number, space, and punctuation mark counts as one character.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
