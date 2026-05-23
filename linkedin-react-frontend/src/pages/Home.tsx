import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProfileWidget } from '../components/widgets/ProfileWidget';
import { Feed } from '../components/feed/Feed';
import { TrendingWidget } from '../components/widgets/TrendingWidget';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left — Profile widget */}
        <div className="hidden lg:flex lg:col-span-2 flex-col gap-4 sidebar-widget left-sidebar">
          <ProfileWidget />
        </div>

        {/* Center — Trending Jobs (larger, prominent) */}
        <div className="lg:col-span-7">
          <TrendingWidget />
        </div>

        {/* Right — Feed / posts (smaller) */}
        <div className="lg:col-span-3">
          <Feed />
        </div>

      </div>
    </div>
  );
};

export default Home;
