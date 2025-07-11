/**
 * AI Proposal Generator Component
 * Generates professional project proposals using client data
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Copy, 
  Send, 
  User, 
  Building, 
  Target, 
  DollarSign,
  Calendar,
  Mail,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ClientData {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  metadata?: {
    project_goals?: string;
    budget_range?: string;
    timeline?: string;
    service_type?: string;
  };
  created_at: string;
}

interface ProposalData {
  client_name: string;
  company_name: string;
  project_goals: string;
  budget: string;
  timeline: string;
  your_agency_name: string;
  your_name: string;
  your_email: string;
}

const ProposalGenerator: React.FC = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData>({
    client_name: '',
    company_name: '',
    project_goals: '',
    budget: '',
    timeline: '',
    your_agency_name: 'Thinkzo',
    your_name: 'Thinkzo Team',
    your_email: 'team@thinkzo.ai'
  });
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch clients');
    }
  };

  const handleClientSelect = (client: ClientData) => {
    setSelectedClient(client);
    setProposalData({
      ...proposalData,
      client_name: client.name,
      company_name: client.company || 'Your Company',
      project_goals: client.metadata?.project_goals || client.message,
      budget: client.metadata?.budget_range || 'To be discussed',
      timeline: client.metadata?.timeline || 'To be determined'
    });
  };

  const proposalTemplate = `Subject: Project Proposal for {{company_name}} - AI-Powered Digital Solution

Dear {{client_name}},

Thank you for reaching out to {{your_agency_name}}! We are excited about the opportunity to collaborate with you on your upcoming project. We appreciate you considering our AI-powered web design services to help achieve your business objectives.

## Project Goals and Needs Summary

Based on our understanding, your primary goals for this project are:
**Project Goals:** {{project_goals}}

We understand that you are working with a budget of **{{budget}}** and aim to complete this project within a **{{timeline}}** timeframe. Our approach is designed to align with these parameters while delivering a high-quality, intelligent solution.

## Services We Will Provide

At {{your_agency_name}}, we specialize in leveraging artificial intelligence to create dynamic, adaptive, and highly effective digital presences. To address your specific goals, we propose the following services:

• **AI-Powered Strategy & Discovery:** We will begin with an in-depth analysis using our neural networks to understand your market, target audience, and specific requirements related to {{project_goals}}. This ensures our solution is precisely tailored to your needs.

• **Neural Website Design & Development:** We will design and develop a cutting-edge website that is not only visually appealing but also intelligent. This includes:
  - **Adaptive UI/UX:** The website will learn from user behavior and adapt its interface to provide a personalized experience, optimizing for conversions and engagement.
  - **Smart A/B Testing:** Our AI will continuously test different elements of your site, automatically implementing the most effective variations to improve performance.
  - **Dynamic Content Integration:** Content will be managed efficiently, allowing for easy updates and ensuring your message is always fresh and relevant.

• **Performance AI Optimization:** We will implement neural networks to continuously optimize your website's performance, ensuring fast load times, seamless user experience, and high search engine rankings.

• **Ongoing Support & Evolution:** Our commitment extends beyond launch. We will provide support to ensure your website continues to evolve and adapt to new trends and user behaviors.

## Proposed Timeline and Deliverables

We propose the following timeline and key deliverables to achieve your project goals:

**Timeline:** {{timeline}}

**Key Deliverables:**

**Phase 1: Discovery & Strategy (Initial 1-2 weeks)**
• Detailed Project Plan & Scope Document
• AI-driven Market & Competitor Analysis Report
• Initial Wireframes & User Flow Diagrams

**Phase 2: Design & Development (Mid-project)**
• Interactive Website Prototypes
• Fully Developed, Responsive Website (Staging Environment)
• Integration of AI features (e.g., adaptive content, smart analytics)

**Phase 3: Testing & Optimization (Final 1-2 weeks)**
• Comprehensive QA Testing & Bug Fixing
• Performance Optimization Report
• Client Review & Feedback Rounds

**Phase 4: Launch & Handover (Project Completion)**
• Website Deployment to Live Server
• Basic Training on CMS Usage
• Post-Launch Support Plan

## Pricing

The proposed budget for this project is **{{budget}}**. This investment will cover the comprehensive services outlined above, ensuring a state-of-the-art, AI-powered digital solution tailored to your needs. A detailed breakdown of costs will be provided upon further discussion.

## Next Steps

We are excited to move forward with you. To proceed, we recommend the following next steps:

1. **Schedule a Discovery Call:** Let's set up a brief call to discuss this proposal in more detail, answer any questions you may have, and refine the project scope if necessary.

2. **Proposal Review & Agreement:** Once all details are clear, we will provide a formal agreement for your review and signature.

3. **Initial Payment:** An initial payment (typically 50% of the total project cost) will be required to commence work.

We are confident that our expertise in AI-powered web design will provide {{company_name}} with a powerful and effective online presence that drives results.

Thank you again for your time and consideration. We look forward to the possibility of working with you.

Sincerely,

{{your_name}}
{{your_agency_name}}
{{your_email}}

---

Ready to get started? Reply to this email or call us at (844) 844-6596 to schedule your discovery call today!`;

  const generateProposal = () => {
    setLoading(true);
    
    let proposal = proposalTemplate;
    
    // Replace all placeholders with actual data
    Object.entries(proposalData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      proposal = proposal.replace(new RegExp(placeholder, 'g'), value);
    });
    
    setGeneratedProposal(proposal);
    setLoading(false);
    toast.success('Proposal generated successfully!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedProposal);
    toast.success('Proposal copied to clipboard!');
  };

  const downloadProposal = () => {
    const blob = new Blob([generatedProposal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposal-${proposalData.company_name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Proposal downloaded!');
  };

  const sendProposal = () => {
    const subject = encodeURIComponent(`Project Proposal for ${proposalData.company_name} - AI-Powered Digital Solution`);
    const body = encodeURIComponent(generatedProposal);
    const mailtoLink = `mailto:${selectedClient?.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">AI Proposal Generator</h2>
        <p className="text-slate-400">Generate professional project proposals for your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Selection & Data Input */}
        <div className="space-y-6">
          {/* Client Selection */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <User className="text-purple-400" size={20} />
              <span>Select Client</span>
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {clients.map((client) => (
                <motion.div
                  key={client.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleClientSelect(client)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedClient?.id === client.id
                      ? 'bg-purple-500/20 border border-purple-500/30'
                      : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{client.name}</h4>
                    <span className="text-slate-400 text-xs">
                      {new Date(client.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm">{client.email}</div>
                  {client.company && (
                    <div className="text-slate-400 text-sm">{client.company}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Proposal Data Form */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <FileText className="text-blue-400" size={20} />
              <span>Proposal Details</span>
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Client Name</label>
                  <input
                    type="text"
                    value={proposalData.client_name}
                    onChange={(e) => setProposalData({ ...proposalData, client_name: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={proposalData.company_name}
                    onChange={(e) => setProposalData({ ...proposalData, company_name: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Project Goals</label>
                <textarea
                  value={proposalData.project_goals}
                  onChange={(e) => setProposalData({ ...proposalData, project_goals: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Budget</label>
                  <input
                    type="text"
                    value={proposalData.budget}
                    onChange={(e) => setProposalData({ ...proposalData, budget: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Timeline</label>
                  <input
                    type="text"
                    value={proposalData.timeline}
                    onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    value={proposalData.your_name}
                    onChange={(e) => setProposalData({ ...proposalData, your_name: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Agency Name</label>
                  <input
                    type="text"
                    value={proposalData.your_agency_name}
                    onChange={(e) => setProposalData({ ...proposalData, your_agency_name: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    value={proposalData.your_email}
                    onChange={(e) => setProposalData({ ...proposalData, your_email: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateProposal}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 border border-purple-500/20 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Proposal'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Generated Proposal */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <FileText className="text-green-400" size={20} />
              <span>Generated Proposal</span>
            </h3>
            
            {generatedProposal && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="p-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadProposal}
                  className="p-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  title="Download proposal"
                >
                  <Download size={16} />
                </motion.button>
                
                {selectedClient && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendProposal}
                    className="p-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                    title="Send via email"
                  >
                    <Send size={16} />
                  </motion.button>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 min-h-96 max-h-96 overflow-y-auto">
            {generatedProposal ? (
              <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {generatedProposal}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a client and generate a proposal to see it here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;