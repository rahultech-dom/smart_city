import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import NewComplaintModal from './components/NewComplaintModal';
import OverviewPage from './pages/OverviewPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import AgentActivityPage from './pages/AgentActivityPage';
import { 
  checkApiHealth, 
  fetchDashboardSummary, 
  fetchComplaints 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, complaints, agents
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [summary, setSummary] = useState(null);
  
  // Connectivity & Telemetry states
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load telemetry data from API or Demo fallback
  const loadData = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    
    // 1. Check health
    const health = await checkApiHealth();
    setApiConnected(health.connected);
    
    // If backend is unreachable, automatically activate synthetic demo mode
    const demoModeActive = isDemoMode || !health.connected;
    if (!health.connected && !isDemoMode) {
      setIsDemoMode(true);
    }

    // 2. Load summary
    const sumRes = await fetchDashboardSummary(demoModeActive);
    if (sumRes.success) {
      setSummary(sumRes.data);
    }

    // 3. Load complaints
    const compRes = await fetchComplaints({}, demoModeActive);
    if (compRes.success) {
      setComplaints(compRes.data);
    }

    if (manual) {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  }, [isDemoMode]);

  // Initial fetch
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh interval (heartbeat every 20 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false);
    }, 20000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle Tab navigation
  const handleSelectTab = (tabId) => {
    setSelectedComplaint(null);
    setActiveTab(tabId);
  };

  // Handle Complaint selection
  const handleSelectComplaint = (complaint) => {
    setSelectedComplaint(complaint);
  };

  // Handle new complaint created
  const handleComplaintCreated = (newComplaintRecord) => {
    loadData(true);
    // Optionally focus the newly created complaint
    if (newComplaintRecord && newComplaintRecord.complaint_id) {
      setSelectedComplaint(newComplaintRecord);
    }
  };

  // Handle status transition update
  const handleStatusUpdated = (complaintId, newStatus) => {
    setComplaints(prev => prev.map(c => {
      if (c.complaint_id === complaintId) {
        return { ...c, status: newStatus, updated_at: new Date().toISOString() };
      }
      return c;
    }));
    if (selectedComplaint && selectedComplaint.complaint_id === complaintId) {
      setSelectedComplaint(prev => ({
        ...prev,
        status: newStatus,
        updated_at: new Date().toISOString()
      }));
    }
    // Refresh summary
    fetchDashboardSummary(isDemoMode).then(res => {
      if (res.success) setSummary(res.data);
    });
  };

  // Tab Title helper
  const getTabTitle = () => {
    if (selectedComplaint) {
      return `Complaint Detail #${selectedComplaint.complaint_id?.slice(0, 8)}`;
    }
    if (activeTab === 'overview') return 'Overview Operations Command';
    if (activeTab === 'complaints') return 'Complaint Triage & Management';
    if (activeTab === 'agents') return 'AI Agent Telemetry & Reasoning';
    return 'UrbanFlow AI';
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <div className="flex-1 flex">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={selectedComplaint ? 'complaints' : activeTab}
          onSelectTab={handleSelectTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Topbar Header */}
          <Topbar
            activeTabTitle={getTabTitle()}
            isDemoMode={isDemoMode}
            apiConnected={apiConnected}
            isRefreshing={isRefreshing}
            onRefresh={() => loadData(true)}
            onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
            onToggleDemoMode={() => {
              const nextMode = !isDemoMode;
              setIsDemoMode(nextMode);
              loadData(true);
            }}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          {/* Page Views Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* View C: Complaint Detail Page */}
            {selectedComplaint ? (
              <ComplaintDetailPage
                complaint={selectedComplaint}
                onBack={() => setSelectedComplaint(null)}
                onStatusUpdated={handleStatusUpdated}
              />
            ) : (
              <>
                {/* View A: Overview Dashboard */}
                {activeTab === 'overview' && (
                  <OverviewPage
                    summary={summary}
                    complaints={complaints}
                    onSelectComplaint={handleSelectComplaint}
                    onNavigateComplaints={() => handleSelectTab('complaints')}
                    onNavigateAgents={() => handleSelectTab('agents')}
                  />
                )}

                {/* View B: Complaints Management */}
                {activeTab === 'complaints' && (
                  <ComplaintsPage
                    complaints={complaints}
                    onSelectComplaint={handleSelectComplaint}
                    onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
                  />
                )}

                {/* View D: AI Agent Operations */}
                {activeTab === 'agents' && (
                  <AgentActivityPage
                    complaints={complaints}
                    onSelectComplaint={handleSelectComplaint}
                  />
                )}
              </>
            )}

          </main>

          {/* Municipal Operations Footer */}
          <footer className="border-t border-slate-900 bg-[#070C18]/95 py-4 text-xs font-mono text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>UrbanFlow AI • Municipal Operations & Intelligent Infrastructure</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-600">
                <span>FastAPI Base: <code className="text-slate-400">/api</code></span>
                <span>Supabase PG</span>
                <span>n8n Multi-Agent Workflow Engine</span>
              </div>
            </div>
          </footer>

        </div>

      </div>

      {/* New Complaint Modal */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSuccess={handleComplaintCreated}
        isDemoMode={isDemoMode}
      />

    </div>
  );
}
