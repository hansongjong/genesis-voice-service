import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, auth } from '../lib/api';
import { BarChart3, Mic, CreditCard, ArrowUpRight, Crown } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.getUser();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigate('/login');
      return;
    }
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const token = auth.getToken();
      const res = await api.getSubscription(token);
      if (res.success) {
        setSubscription(res);
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const usage = subscription?.usage || { characters_used: 0, characters_limit: 10000, generations_used: 0, generations_limit: 50 };
  const plan = subscription?.subscription?.plan || 'free';
  const charPercent = usage.characters_limit > 0 ? (usage.characters_used / usage.characters_limit) * 100 : 0;
  const genPercent = usage.generations_limit > 0 ? (usage.generations_used / usage.generations_limit) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Plan Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <Crown className="w-8 h-8 text-yellow-500" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                plan === 'free' ? 'bg-gray-100 text-gray-700' :
                plan === 'starter' ? 'bg-blue-100 text-blue-700' :
                plan === 'pro' ? 'bg-purple-100 text-purple-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">Current Plan</p>
            {plan === 'free' && (
              <Link
                to="/pricing"
                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
              >
                Upgrade <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Characters Usage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-600 text-sm mb-2">Characters Used</p>
            <p className="text-2xl font-bold text-gray-900">
              {usage.characters_used.toLocaleString()} / {usage.characters_limit === -1 ? 'Unlimited' : usage.characters_limit.toLocaleString()}
            </p>
            {usage.characters_limit > 0 && (
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${charPercent > 90 ? 'bg-red-500' : charPercent > 70 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(charPercent, 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Generations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mic className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm mb-2">Generations</p>
            <p className="text-2xl font-bold text-gray-900">
              {usage.generations_used} / {usage.generations_limit === -1 ? 'Unlimited' : usage.generations_limit}
            </p>
            {usage.generations_limit > 0 && (
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${genPercent > 90 ? 'bg-red-500' : genPercent > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(genPercent, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Mic className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Generate Voice</p>
                <p className="text-sm text-gray-600">Create new audio</p>
              </div>
            </Link>

            <Link
              to="/pricing"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <CreditCard className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Upgrade Plan</p>
                <p className="text-sm text-gray-600">Get more features</p>
              </div>
            </Link>

            <Link
              to="/api-docs"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <BarChart3 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">API Docs</p>
                <p className="text-sm text-gray-600">Integrate with your app</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
