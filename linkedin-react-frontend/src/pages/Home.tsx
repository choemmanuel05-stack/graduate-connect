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

        {/* Left */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 sidebar-widget left-sidebar">
          <ProfileWidget />
        </div>

        {/* Feed */}
        <div className="lg:col-span-6">
          <Feed />
        </div>

        {/* Right */}
        <div className="hidden lg:block lg:col-span-3">
          <TrendingWidget />
        </div>
      </div>
    </div>
  );
};

export default Home;
