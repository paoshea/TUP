# Backend Implementation Guide - Part 3: Mobile Support, Security, and Performance

This guide covers the remaining backend features for the LiveStock Show Assistant, focusing on mobile support, security, and performance optimization.

## Mobile Support Setup

### 1. Create Offline Sync Tables

```bash
# Create offline sync migration
cat > supabase/migrations/offline_sync.sql << 'EOL'
/*
  # Offline Sync Schema

  1. New Tables
    - `sync_queue`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `table_name` (text)
      - `record_id` (uuid)
      - `operation` (text)
      - `data` (jsonb)
      - `status` (text)
      - `created_at` (timestamp)
      - `processed_at` (timestamp)
    
    - `sync_conflicts`
      - `id` (uuid, primary key)
      - `queue_id` (uuid, references sync_queue)
      - `table_name` (text)
      - `record_id` (uuid)
      - `client_data` (jsonb)
      - `server_data` (jsonb)
      - `resolution` (text)
      - `created_at` (timestamp)
      - `resolved_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Implement conflict resolution
*/

-- Create sync queue table
CREATE TABLE IF NOT EXISTS sync_queue (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  operation text NOT NULL CHECK (operation IN ('insert', 'update', 'delete')),
  data jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'conflict')),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  version integer NOT NULL DEFAULT 1
);

-- Create sync conflicts table
CREATE TABLE IF NOT EXISTS sync_conflicts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_id uuid REFERENCES sync_queue(id) NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  client_data jsonb,
  server_data jsonb,
  resolution text CHECK (resolution IN ('client_wins', 'server_wins', 'manual')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_conflicts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their sync queue"
  ON sync_queue FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can add to sync queue"
  ON sync_queue FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their sync conflicts"
  ON sync_conflicts FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM sync_queue WHERE id = queue_id
    )
  );

-- Create indexes
CREATE INDEX idx_sync_queue_status ON sync_queue(status);
CREATE INDEX idx_sync_queue_user ON sync_queue(user_id);
CREATE INDEX idx_sync_conflicts_queue ON sync_conflicts(queue_id);
EOL
```

### 2. Create Push Notification Tables

```bash
# Create push notification migration
cat > supabase/migrations/push_notifications.sql << 'EOL'
/*
  # Push Notification Schema

  1. New Tables
    - `push_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `token` (text)
      - `platform` (text)
      - `created_at` (timestamp)
      - `last_used` (timestamp)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `title` (text)
      - `body` (text)
      - `data` (jsonb)
      - `status` (text)
      - `created_at` (timestamp)
      - `sent_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Implement token management
*/

-- Create push tokens table
CREATE TABLE IF NOT EXISTS push_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  token text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  created_at timestamptz DEFAULT now(),
  last_used timestamptz DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their push tokens"
  ON push_tokens FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_push_tokens_user ON push_tokens(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
EOL
```

### 3. Create Sync Functions

```bash
# Create sync processor function
cat > supabase/functions/process-sync-queue/index.ts << 'EOL'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch pending sync items
    const { data: syncItems, error: fetchError } = await supabase
      .from('sync_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(100);

    if (fetchError) throw fetchError;

    const results = await Promise.all(
      syncItems.map(item => processSyncItem(supabase, item))
    );

    return new Response(
      JSON.stringify({ processed: results.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function processSyncItem(supabase: any, item: any): Promise<void> {
  try {
    // Start processing
    await updateSyncStatus(supabase, item.id, 'processing');

    // Check for conflicts
    const hasConflict = await checkForConflict(supabase, item);
    if (hasConflict) {
      await handleConflict(supabase, item);
      return;
    }

    // Apply changes
    await applyChanges(supabase, item);

    // Mark as completed
    await updateSyncStatus(supabase, item.id, 'completed');
  } catch (error) {
    await updateSyncStatus(supabase, item.id, 'failed');
    throw error;
  }
}

async function checkForConflict(supabase: any, item: any): Promise<boolean> {
  const { data: current } = await supabase
    .from(item.table_name)
    .select('version')
    .eq('id', item.record_id)
    .single();

  return current && current.version > item.version;
}

async function handleConflict(supabase: any, item: any): Promise<void> {
  const { data: current } = await supabase
    .from(item.table_name)
    .select('*')
    .eq('id', item.record_id)
    .single();

  await supabase
    .from('sync_conflicts')
    .insert({
      queue_id: item.id,
      table_name: item.table_name,
      record_id: item.record_id,
      client_data: item.data,
      server_data: current,
    });

  await updateSyncStatus(supabase, item.id, 'conflict');
}

async function applyChanges(supabase: any, item: any): Promise<void> {
  switch (item.operation) {
    case 'insert':
      await supabase
        .from(item.table_name)
        .insert(item.data);
      break;

    case 'update':
      await supabase
        .from(item.table_name)
        .update(item.data)
        .eq('id', item.record_id);
      break;

    case 'delete':
      await supabase
        .from(item.table_name)
        .delete()
        .eq('id', item.record_id);
      break;
  }
}

async function updateSyncStatus(
  supabase: any,
  id: string,
  status: string
): Promise<void> {
  await supabase
    .from('sync_queue')
    .update({
      status,
      processed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', id);
}
EOL

# Create push notification function
cat > supabase/functions/send-push-notification/index.ts << 'EOL'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch pending notifications
    const { data: notifications, error: fetchError } = await supabase
      .from('notifications')
      .select('*, push_tokens!inner(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(100);

    if (fetchError) throw fetchError;

    const results = await Promise.all(
      notifications.map(notification => sendNotification(supabase, notification))
    );

    return new Response(
      JSON.stringify({ sent: results.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function sendNotification(supabase: any, notification: any): Promise<void> {
  try {
    // Implementation would use FCM, APNS, or web push
    // This is a placeholder
    console.log('Sending notification:', notification);

    await supabase
      .from('notifications')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', notification.id);
  } catch (error) {
    await supabase
      .from('notifications')
      .update({
        status: 'failed',
      })
      .eq('id', notification.id);
    throw error;
  }
}
EOL
```

## Performance Optimization

### 1. Create Caching Tables

```bash
# Create caching migration
cat > supabase/migrations/caching.sql << 'EOL'
/*
  # Caching Schema

  1. New Tables
    - `cache_entries`
      - `id` (uuid, primary key)
      - `key` (text)
      - `value` (jsonb)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create cache entries table
CREATE TABLE IF NOT EXISTS cache_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cache_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read cache"
  ON cache_entries FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_cache_entries_key ON cache_entries(key);
CREATE INDEX idx_cache_entries_expires ON cache_entries(expires_at);

-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM cache_entries WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create cleanup trigger
CREATE OR REPLACE FUNCTION trigger_cleanup_expired_cache()
RETURNS trigger AS $$
BEGIN
  PERFORM cleanup_expired_cache();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_expired_cache_trigger
  AFTER INSERT ON cache_entries
  EXECUTE FUNCTION trigger_cleanup_expired_cache();
EOL
```

### 2. Create Monitoring Tables

```bash
# Create monitoring migration
cat > supabase/migrations/monitoring.sql << 'EOL'
/*
  # Monitoring Schema

  1. New Tables
    - `performance_metrics`
      - `id` (uuid, primary key)
      - `endpoint` (text)
      - `method` (text)
      - `duration` (integer)
      - `status_code` (integer)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)
    
    - `error_logs`
      - `id` (uuid, primary key)
      - `error_type` (text)
      - `message` (text)
      - `stack_trace` (text)
      - `context` (jsonb)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint text NOT NULL,
  method text NOT NULL,
  duration integer NOT NULL,
  status_code integer NOT NULL,
  user_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create error logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  error_type text NOT NULL,
  message text NOT NULL,
  stack_trace text,
  context jsonb DEFAULT '{}',
  user_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only admins can view performance metrics"
  ON performance_metrics FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM team_members
      WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can view error logs"
  ON error_logs FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM team_members
      WHERE role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX idx_performance_metrics_endpoint ON performance_metrics(endpoint);
CREATE INDEX idx_performance_metrics_created ON performance_metrics(created_at);
CREATE INDEX idx_error_logs_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_created ON error_logs(created_at);

-- Create cleanup function for old metrics
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
  -- Keep last 30 days of metrics
  DELETE FROM performance_metrics
  WHERE created_at < now() - interval '30 days';
  
  -- Keep last 90 days of error logs
  DELETE FROM error_logs
  WHERE created_at < now() - interval '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup to run daily
SELECT cron.schedule(
  'cleanup-metrics',
  '0 0 * * *',
  $$SELECT cleanup_old_metrics()$$
);
EOL
```

### 3. Create Monitoring Function

```bash
# Create monitoring function
cat > supabase/functions/collect-metrics/index.ts << 'EOL'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface MetricEvent {
  type: 'performance' | 'error';
  data: PerformanceMetric | ErrorLog;
}

interface PerformanceMetric {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  userId?: string;
}

interface ErrorLog {
  errorType: string;
  message: string;
  stackTrace?: string;
  context?: Record<string, unknown>;
  userId?: string;
}

serve(async (req) => {
  try {
    const { type, data } = await req.json() as MetricEvent;
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (type === 'performance') {
      await recordPerformanceMetric(supabase, data as PerformanceMetric);
    } else {
      await recordErrorLog(supabase, data as ErrorLog);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function recordPerformanceMetric(
  supabase: any,
  metric: PerformanceMetric
): Promise<void> {
  const { error } = await supabase
    .from('performance_metrics')
    .insert({
      endpoint: metric.endpoint,
      method: metric.method,
      duration: metric.duration,
      status_code: metric.statusCode,
      user_id: metric.userId,
    });

  if (error) throw error;
}

async function recordErrorLog(
  supabase: any,
  log: ErrorLog
): Promise<void> {
  const { error } = await supabase
    .from('error_logs')
    .insert({
      error_type: log.errorType,
      message: log.message,
      stack_trace: log.stackTrace,
      context: log.context,
      user_id: log.userId,
    });

  if (error) throw error;
}
EOL
```

## Notes

1. This implementation covers:
   - Offline sync system
   - Push notifications
   - Performance optimization
   - Monitoring and logging

2. Key features:
   - Conflict resolution
   - Real-time notifications
   - Caching system
   - Performance tracking
   - Error logging

3. Remember to:
   - Test sync system thoroughly
   - Configure push notification providers
   - Monitor cache usage
   - Set up alerts for errors
   - Review metrics regularly

4. Next steps:
   - Implement push notification providers
   - Add more monitoring metrics
   - Set up automated alerts
   - Configure backup system
   - Add performance dashboards