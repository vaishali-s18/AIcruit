import { Outlet } from 'react-router-dom';
import ExecutiveSidebar from '../executive/ExecutiveSidebar';
import ExecutiveHeader from '../executive/ExecutiveHeader';
import { ExecutiveProvider } from '../../context/ExecutiveContext';

const ExecutiveLayout = () => {
  return (
    <ExecutiveProvider>
      <div className="flex min-h-screen bg-black font-inter selection:bg-blue-500/30 overflow-x-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-[1001] w-64 hidden md:block">
        <ExecutiveSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-500 md:pl-64 relative">
        
        {/* Fixed Navbar / Header */}
        <div className="fixed top-0 right-0 left-0 md:left-64 z-[999]">
          <ExecutiveHeader />
        </div>

        {/* Scrollable Content Wrapper */}
        <main className="flex-1 flex flex-col pt-32 pb-20 px-6 md:px-10 max-w-[1700px] mx-auto w-full relative z-10 overflow-y-auto">
          <Outlet />
        </main>

        {/* Global Atmospheric Effects */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
          <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
    </ExecutiveProvider>
  );
};

export default ExecutiveLayout;
