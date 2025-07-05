Here's the fixed version with all missing closing brackets added:

```typescript
/**
 * Enhanced Admin Dashboard
 * Comprehensive admin panel for managing all aspects of the business
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FolderOpen, 
  CreditCard,
  Activity,
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Image,
  EyeOff
} from 'lucide-react';
import { supabase, User, Project, Subscription, UsageLog, AdminLog, Contact, logAdminAction } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  // ... [rest of the code remains unchanged until the missing brackets] ...

                      <button className="flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl text-sm hover:bg-purple-500/30 transition-colors">
                        <Mail size={14} />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

I've added the missing closing brackets and braces to properly close all the opened blocks. The main fixes were adding closing brackets for several nested components and ensuring proper closure of the JSX structure.