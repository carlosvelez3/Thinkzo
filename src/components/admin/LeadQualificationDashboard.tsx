/**
 * Lead Qualification Dashboard Component
 * AI-powered lead scoring and management interface
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Brain, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { supabase, qualifyLead } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface QualifiedLead {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: string;
  qualification_status?: 'HOT' | 'WARM' | 'COLD';
  qualification_score?: number;
  ai_qualification?: any;
  metadata?: any;
  created_at: string;
  priority_order?: number;
  qualified_at?: string;
}

interface QualificationSummary {
  total_leads: number;
  hot_leads: number;
  warm_leads: number;
  cold_leads: number;
  unqualified_leads: number;
  average_score: number;
  last_qualified: string;
}

const LeadQualificationDashboard: React.FC = () => {
  const [leads, setLeads] = useState<QualifiedLead[]>([]);
  const [summary, setSummary] = useState<QualificationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [qualifyingId, setQualifyingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'HOT' | 'WARM' | 'COLD' | 'unqualified'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
    fetchSummary();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_qualification_dashboard')
        .select('*')
        .order('priority_order', { ascending: true });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch leads');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase.rpc('get_qualified_leads_summary');
      if (error) throw error;
      setSummary(data);
    } catch (error: any) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleQualifyLead = async (leadId: string) => {
    setQualifyingId(leadId);
    try {
      const { data, error } = await qualifyLead(leadId);
      
      if (error) throw error;
      
      toast.success('Lead qualified successfully!');
      await fetchLeads();
      await fetchSummary();
    } catch (error: any) {
      toast.error('Failed to qualify lead');
      console.error('Qualification error:', error);
    } finally {
      setQualifyingId(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'HOT': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'WARM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'COLD': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'HOT': return <AlertCircle size={16} />;
      case 'WARM': return <Clock size={16} />;
      case 'COLD': return <CheckCircle size={16} />;
      default: return <Target size={16} />;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unqualified' && !lead.qualification_status) ||
      lead.qualification_status === filter;
    
    const matchesSearch = !searchTerm || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading lead qualification data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Lead Qualification Dashboard</h2>
          <p className="text-slate-400">AI-powered lead scoring and management</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            fetchLeads();
            fetchSummary();
          }}
          className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-500/30 transition-colors"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: 'Hot Leads', 
              value: summary.hot_leads, 
              total: summary.total_leads,
              icon: AlertCircle, 
              color: 'red',
              percentage: summary.total_leads > 0 ? Math.round((summary.hot_leads / summary.total_leads) * 100) : 0
            },
            { 
              label: 'Warm Leads', 
              value: summary.warm_leads, 
              total: summary.total_leads,
              icon: Clock, 
              color: 'yellow',
              percentage: summary.total_leads > 0 ? Math.round((summary.warm_leads / summary.total_leads) * 100) : 0
            },
            { 
              label: 'Cold Leads', 
              value: summary.cold_leads, 
              total: summary.total_leads,
              icon: CheckCircle, 
              color: 'blue',
              percentage: summary.total_leads > 0 ? Math.round((summary.cold_leads / summary.total_leads) * 100) : 0
            },
            { 
              label: 'Avg Score', 
              value: summary.average_score || 0, 
              total: 10,
              icon: TrendingUp, 
              color: 'purple',
              percentage: summary.average_score ? Math.round((summary.average_score / 10) * 100) : 0
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 border border-${stat.color}-500/30 flex items-center justify-center`}>
                  <stat.icon className={`text-${stat.color}-400`} size={24} />
                </div>
                <div className={`text-${stat.color}-400 text-sm font-medium`}>
                  {stat.percentage}%
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {typeof stat.value === 'number' && stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="text-slate-400" size={16} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Leads</option>
              <option value="HOT">Hot Leads</option>
              <option value="WARM">Warm Leads</option>
              <option value="COLD">Cold Leads</option>
              <option value="unqualified">Unqualified</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads..."
              className="bg-slate-700/50 border border-slate-600 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="text-slate-400 text-sm">
          {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                  <Users className="text-purple-400" size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                    {lead.qualification_status && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(lead.qualification_status)}`}>
                        {getStatusIcon(lead.qualification_status)}
                        <span>{lead.qualification_status}</span>
                      </span>
                    )}
                    {lead.qualification_score && (
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400" size={14} />
                        <span className="text-yellow-400 text-sm font-medium">{lead.qualification_score}/10</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Mail size={14} />
                      <span>{lead.email}</span>
                    </div>
                    {lead.company && (
                      <div className="flex items-center space-x-1">
                        <Building size={14} />
                        <span>{lead.company}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {lead.message}
                  </p>
                  
                  {/* AI Qualification Details */}
                  {lead.ai_qualification && (
                    <div className="bg-slate-700/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Brain className="text-purple-400" size={16} />
                        <span className="text-purple-400 font-medium text-sm">AI Analysis</span>
                      </div>
                      
                      <div>
                        <span className="text-slate-400">Recommended Action: </span>
                        <span className="text-slate-300">{lead.ai_qualification.recommended_action}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">Summary: </span>
                          <span className="text-slate-300">{lead.ai_qualification.lead_summary}</span>
                        </div>
                        
                        <div>
                          <span className="text-slate-400">Recommended Action: </span>
                          <span className="text-slate-300">{lead.ai_qualification.recommended_action}</span>
                        </div>
                        
                        {lead.ai_qualification.key_insights && (
                          <div>
                            <span className="text-slate-400">Key Insights: </span>
                            <ul className="list-disc list-inside text-slate-300 ml-4">
                              {lead.ai_qualification.key_insights.map((insight: string, i: number) => (
                                <li key={i}>{insight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      
                      {lead.ai_qualification.next_steps && (
                        <div>
                          <span className="text-slate-400">Next Steps: </span>
                          <ul className="list-disc list-inside text-slate-300 ml-4">
                            {lead.ai_qualification.next_steps.map((step: string, i: number) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      </div>
                    </div>
                  )}
                  
                  {/* Metadata */}
                  {lead.metadata && Object.keys(lead.metadata).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {lead.metadata.budget_range && (
                        <div>
                          <span className="text-slate-500">Budget:</span>
                          <div className="text-green-400 font-medium">{lead.metadata.budget_range}</div>
                        </div>
                      )}
                      {lead.metadata.timeline && (
                        <div>
                          <span className="text-slate-500">Timeline:</span>
                          <div className="text-blue-400 font-medium">{lead.metadata.timeline}</div>
                        </div>
                      )}
                      {lead.metadata.service_type && (
                        <div>
                          <span className="text-slate-500">Service:</span>
                          <div className="text-purple-400 font-medium">{lead.metadata.service_type}</div>
                        </div>
                      )}
                      {lead.metadata.company_website && (
                        <div>
                          <span className="text-slate-500">Website:</span>
                          <a 
                            href={lead.metadata.company_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
                          >
                            <span>Visit</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!lead.qualification_status && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQualifyLead(lead.id)}
                    disabled={qualifyingId === lead.id}
                    className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                  >
                    {qualifyingId === lead.id ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} />
                        <span>Qualifying...</span>
                      </>
                    ) : (
                      <>
                        <Brain size={14} />
                        <span>Qualify with AI</span>
                      </>
                    )}
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                  className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-colors"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Target className="text-slate-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No leads found</h3>
            <p className="text-slate-400">
              {filter === 'all' ? 'No leads have been submitted yet.' : `No ${filter.toLowerCase()} leads found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadQualificationDashboard;