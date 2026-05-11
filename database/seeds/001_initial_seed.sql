-- Database seeding script for SOC Academy
-- Populates initial courses, labs, quizzes, and user data

-- ============================================================
-- BEGINNER COURSES
-- ============================================================

INSERT INTO courses (id, title, slug, description, full_description, difficulty, category, duration_hours, price, instructor_id, status, rating, students_count, created_at)
VALUES 
  -- 1. Linux Fundamentals
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f', 
   'Linux Fundamentals for SOC Analysts',
   'linux-fundamentals',
   'Master Linux command line, file system, and user management',
   'Learn the essential Linux skills required for SOC operations. This course covers command line basics, file system navigation, user permissions, shell scripting introduction, and common security tools.',
   'beginner',
   'linux',
   12,
   0,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.8,
   156,
   NOW()),

  -- 2. Networking Basics
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9a',
   'Networking Fundamentals',
   'networking-fundamentals',
   'Understand OSI model, TCP/IP, DNS, and network protocols',
   'Master the networking concepts essential for security analysis. Covers OSI model layers, TCP/IP protocol suite, DNS resolution, HTTP/HTTPS, and practical networking tools like ping, traceroute, and netstat.',
   'beginner',
   'networking',
   10,
   0,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.7,
   142,
   NOW()),

  -- 3. Log Analysis Introduction
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9b',
   'Introduction to Log Analysis',
   'log-analysis-intro',
   'Learn to parse, analyze, and correlate security logs',
   'Discover the fundamentals of log analysis for security operations. Learn log types (Apache, Nginx, Windows Event, Syslog), log formats, parsing techniques, and basic correlation concepts.',
   'beginner',
   'log-analysis',
   8,
   0,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.6,
   128,
   NOW()),

  -- 4. SOC Operations Fundamentals
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9c',
   'SOC Operations Fundamentals',
   'soc-operations-fundamentals',
   'Understand SOC operations, incident response basics, and alert triage',
   'Get started with Security Operations Center (SOC) fundamentals. Learn about SOC structure, roles, responsibilities, incident response workflow, alert triage, and escalation procedures.',
   'beginner',
   'soc-operations',
   10,
   0,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.7,
   134,
   NOW()),

  -- 5. Security Monitoring Essentials
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9d',
   'Security Monitoring Essentials',
   'security-monitoring-essentials',
   'Learn event sources, monitoring strategies, and dashboard creation',
   'Master the essentials of security monitoring. Covers event sources, data collection, monitoring strategies, KPI definition, dashboard creation, and alert tuning.',
   'beginner',
   'monitoring',
   12,
   0,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.8,
   146,
   NOW());

-- ============================================================
-- INTERMEDIATE COURSES
-- ============================================================

INSERT INTO courses (id, title, slug, description, full_description, difficulty, category, duration_hours, price, instructor_id, status, rating, students_count, created_at)
VALUES
  -- 6. SIEM Fundamentals - Splunk
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9e',
   'Splunk SIEM Fundamentals',
   'splunk-siem-fundamentals',
   'Master Splunk Search Processing Language (SPL) and dashboard creation',
   'Learn Splunk SIEM platform essentials. Covers data ingestion, SPL (Search Processing Language), queries, dashboards, alerts, reports, and practical SOC scenarios.',
   'intermediate',
   'siem',
   20,
   49.99,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.9,
   89,
   NOW()),

  -- 7. Detection Engineering
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f',
   'Detection Rule Engineering',
   'detection-rule-engineering',
   'Write effective detection rules and reduce false positives',
   'Master the art of writing detection rules. Learn about SIGMA rules, detection logic, attack patterns (MITRE ATT&CK), tuning strategies, and false positive reduction techniques.',
   'intermediate',
   'detection',
   18,
   49.99,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.8,
   76,
   NOW()),

  -- 8. Web Attack Analysis
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7ea0',
   'Web Attack Analysis and Detection',
   'web-attack-analysis',
   'Analyze web attacks in logs and network traffic',
   'Understand common web attack vectors and how to detect them. Covers SQL injection, XSS, CSRF, command injection, XXE, and analysis techniques in Apache/Nginx logs and WAF logs.',
   'intermediate',
   'web-security',
   16,
   39.99,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.7,
   68,
   NOW()),

  -- 9. Threat Hunting Basics
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7ea1',
   'Threat Hunting Methodology',
   'threat-hunting-methodology',
   'Proactively hunt for threats using MITRE ATT&CK framework',
   'Learn threat hunting techniques and methodologies. Covers hunt hypothesis development, data sources, MITRE ATT&CK mapping, IOC analysis, and practical hunting queries.',
   'intermediate',
   'threat-hunting',
   18,
   49.99,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.8,
   82,
   NOW()),

  -- 10. Incident Response Fundamentals
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7ea2',
   'Incident Response Fundamentals',
   'incident-response-fundamentals',
   'Respond to security incidents effectively and efficiently',
   'Master incident response procedures and techniques. Covers IR phases, containment strategies, evidence preservation, communication, and post-incident analysis.',
   'intermediate',
   'incident-response',
   16,
   39.99,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.7,
   74,
   NOW());

-- ============================================================
-- ADVANCED COURSES
-- ============================================================

INSERT INTO courses (id, title, slug, description, full_description, difficulty, category, duration_hours, price, instructor_id, status, rating, students_count, created_at)
VALUES
  -- 11. Malware Analysis
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7ea3',
   'Malware Analysis Masterclass',
   'malware-analysis-masterclass',
   'Analyze malware through static, dynamic, and behavioral analysis',
   'Advanced malware analysis techniques. Covers static analysis (IDA, Ghidra), dynamic analysis (sandboxes), behavioral analysis, reverse engineering basics, and C2 communication patterns.',
   'advanced',
   'malware-analysis',
   24,
   79.99,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.9,
   42,
   NOW()),

  -- 12. Advanced DFIR
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7ea4',
   'Digital Forensics & Incident Response (DFIR)',
   'advanced-dfir',
   'Memory forensics, disk forensics, and timeline analysis',
   'Master advanced DFIR techniques. Covers memory analysis (Volatility), disk forensics (Autopsy), timeline analysis, artifact analysis, and complex incident reconstruction.',
   'advanced',
   'dfir',
   22,
   79.99,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.8,
   38,
   NOW()),

  -- 13. Threat Intelligence
  ('c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7ea5',
   'Advanced Threat Intelligence',
   'advanced-threat-intelligence',
   'IOC analysis, threat feeds, and ATT&CK framework mastery',
   'Advanced threat intelligence operations. Covers IOC intelligence gathering, threat feeds, STIX/TAXII, MITRE ATT&CK deep dive, and threat actor profiling.',
   'advanced',
   'threat-intelligence',
   18,
   69.99,
   '550e8400-e29b-41d4-a716-446655440000',
   'published',
   4.7,
   35,
   NOW());

-- ============================================================
-- BEGINNER LABS
-- ============================================================

INSERT INTO labs (id, title, slug, description, difficulty, category, estimated_time_minutes, tags, scenario, created_at)
VALUES
  -- Lab 1: SSH Brute Force
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f',
   'SSH Brute Force Investigation',
   'ssh-brute-force-investigation',
   'Investigate SSH login attempts and identify the attacker IP address',
   'beginner',
   'log-analysis',
   45,
   ARRAY['ssh', 'linux', 'log-analysis', 'security'],
   '{"scenario": "You have received alerts about multiple failed SSH login attempts on your Linux server. Your task is to analyze the auth.log file to identify the source IP, number of attempts, and timeline of the attack.", "hints": ["Check /var/log/auth.log for failed attempts", "Look for patterns in failed passwords", "Count attempts from each IP"], "expected_findings": ["Attacker IP: 192.168.1.100", "Failed attempts: 145", "Attack duration: 2 hours"]}',
   NOW()),

  -- Lab 2: Apache Web Attack
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9a',
   'Apache Web Server Attack Detection',
   'apache-web-attack-detection',
   'Detect and analyze SQL injection attempts in Apache access logs',
   'beginner',
   'log-analysis',
   50,
   ARRAY['apache', 'web-attack', 'sql-injection', 'log-analysis'],
   '{"scenario": "Your company website received suspicious requests. Analyze the Apache access.log to find SQL injection attempts, identify the attacker, and determine what data they were targeting.", "hints": ["Look for SQL keywords in query parameters", "Common SQL injection patterns: UNION, SELECT, --", "Check User-Agent headers for scanners"], "expected_findings": ["SQL injection attempt found", "Target: user database", "Attacker IP: 203.0.113.45"]}',
   NOW()),

  -- Lab 3: Windows Event Logs
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9b',
   'Windows Event Log Analysis',
   'windows-event-log-analysis',
   'Investigate Windows Event Logs for suspicious login activity',
   'beginner',
   'log-analysis',
   45,
   ARRAY['windows', 'event-logs', 'login-analysis'],
   '{"scenario": "Your Windows server security team flagged unusual login patterns. Analyze Event Viewer logs (Security channel) to find failed login attempts, successful logins from unusual times, and potential account compromise.", "hints": ["Event ID 4625: failed login", "Event ID 4624: successful login", "Look for Pattern: multiple failures then success"], "expected_findings": ["Account: admin", "Compromise time: 3:45 AM", "Source IP: 10.0.0.50"]}',
   NOW());

-- ============================================================
-- INTERMEDIATE LABS
-- ============================================================

INSERT INTO labs (id, title, slug, description, difficulty, category, estimated_time_minutes, tags, scenario, created_at)
VALUES
  -- Lab 4: Splunk Dashboard
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9c',
   'Splunk Security Dashboard Creation',
   'splunk-security-dashboard',
   'Create a real-time security monitoring dashboard in Splunk',
   'intermediate',
   'siem',
   90,
   ARRAY['splunk', 'dashboard', 'siem', 'visualization'],
   '{"scenario": "Your SOC needs a real-time security dashboard. Create a Splunk dashboard that displays: Top 10 countries by login attempts, Failed login count over time, Top 5 user accounts with failed logins, Failed vs successful login ratio.", "hints": ["Use SPL queries with timechart command", "Create panels for each metric", "Use eval for ratio calculations"], "expected_findings": ["Dashboard created with 4+ panels", "Real-time updates working"]}',
   NOW()),

  -- Lab 5: Threat Hunting
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9d',
   'Living off the Land Binaries (LOTL) Detection',
   'lotl-detection',
   'Hunt for suspicious use of legitimate Windows binaries',
   'intermediate',
   'threat-hunting',
   75,
   ARRAY['threat-hunting', 'windows', 'lotl', 'detection'],
   '{"scenario": "Advanced threat actors use legitimate system tools to avoid detection. Hunt for suspicious use of PowerShell, WMI, PsExec in your logs. Create detection queries to identify LOTL activity patterns.", "hints": ["PowerShell unusual execution patterns", "WMI event creation (Event ID 11)", "Uncommon PsExec usage"], "expected_findings": ["Found 3 LOTL instances", "Pattern: PowerShell with base64 encoding", "Timeline: indicates lateral movement"]}',
   NOW()),

  -- Lab 6: Incident Response
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9e',
   'Ransomware Incident Response',
   'ransomware-incident-response',
   'Respond to a ransomware incident: contain, investigate, and recover',
   'intermediate',
   'incident-response',
   120,
   ARRAY['incident-response', 'ransomware', 'containment', 'forensics'],
   '{"scenario": "A ransomware incident has been detected. Your tasks: 1) Identify patient zero (initial compromise), 2) Contain the spread, 3) Document timeline, 4) Preserve evidence. Analyze logs to determine attack vector, lateral movement, and encryption start time.", "hints": ["Look for unusual network connections", "Check for suspicious file extensions", "Timeline: when were files first encrypted?"], "expected_findings": ["Patient zero: workstation-05", "Attack vector: email phishing", "Lateral movement: 15 minutes"]}',
   NOW());

-- ============================================================
-- ADVANCED LABS
-- ============================================================

INSERT INTO labs (id, title, slug, description, difficulty, category, estimated_time_minutes, tags, scenario, created_at)
VALUES
  -- Lab 7: Malware Analysis
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f',
   'Advanced Executable Malware Analysis',
   'advanced-exe-malware-analysis',
   'Analyze a packed executable using static and dynamic techniques',
   'advanced',
   'malware-analysis',
   180,
   ARRAY['malware-analysis', 'reverse-engineering', 'static-analysis', 'dynamic-analysis'],
   '{"scenario": "A suspicious executable was found on an infected system. Perform: 1) Static analysis (headers, strings, PE analysis), 2) Dynamic analysis (sandbox execution), 3) Behavioral analysis, 4) IOC extraction. Identify malware family, capabilities, and C2 communication.", "hints": ["Use Ghidra for static analysis", "Run in sandbox for dynamic analysis", "Extract network IOCs", "Identify command and control server"], "expected_findings": ["Malware family: Emotet variant", "C2 server: 10.20.30.40:8080", "Capabilities: credential theft, lateral movement"]}',
   NOW()),

  -- Lab 8: DFIR
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7ea0',
   'Memory Forensics Investigation',
   'memory-forensics-investigation',
   'Analyze a memory dump to find malware and attacker artifacts',
   'advanced',
   'dfir',
   150,
   ARRAY['dfir', 'memory-forensics', 'volatility', 'forensics'],
   '{"scenario": "A memory dump from a compromised system has been collected. Use Volatility to: 1) Find hidden processes, 2) Extract malware artifacts, 3) Identify attacker tools, 4) Reconstruct attack sequence. Produce forensic report with findings and timeline.", "hints": ["Use pslist to find processes", "Look for suspicious process injection", "Check loaded DLLs for anomalies", "Extract network connections"], "expected_findings": ["Injected process: svchost.exe", "Malware PID: 2840", "Network connection to C2: 192.168.1.200:4444"]}',
   NOW()),

  -- Lab 9: Threat Intelligence
  ('l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7ea1',
   'Threat Intelligence Analysis and Reporting',
   'threat-intelligence-analysis',
   'Analyze threat actor campaign and create intelligence report',
   'advanced',
   'threat-intelligence',
   120,
   ARRAY['threat-intelligence', 'apt', 'intelligence-analysis', 'reporting'],
   '{"scenario": "Your organization detected activity from a known APT group. Correlate IOCs with threat intelligence feeds, map to MITRE ATT&CK techniques, identify the threat actor, and produce an intelligence report. Include: Attribution, TTP mapping, indicators, and recommendations.", "hints": ["Cross-reference IOCs with VirusTotal", "Map activity to MITRE ATT&CK framework", "Profile threat actor", "Create actionable recommendations"], "expected_findings": ["APT group: Lazarus", "TTP: T1566.002 - Phishing with Attachment", "IOCs: 45 new indicators"]}',
   NOW());

-- ============================================================
-- CREATE SAMPLE USERS
-- ============================================================

-- First, create default instructor user if not exists (adjust ID as needed)
INSERT INTO users (id, email, username, password_hash, full_name, role, bio, status)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000',
   'instructor@soc-academy.com',
   'instructor_primary',
   '$2b$10$ZIH2jJg.8DkBFTmYOHC8I.wR7/7DkY2ZZ2Z2ZZ2ZZ2Z2ZZ2ZZ2ZZ2', -- password: instructor123
   'Senior Security Analyst - SOC Academy',
   'instructor',
   'Passionate about cybersecurity education and building world-class training materials',
   'active')
ON CONFLICT (email) DO NOTHING;

-- Create sample student users
INSERT INTO users (id, email, username, password_hash, full_name, role, status, created_at)
VALUES
  ('650e8400-e29b-41d4-a716-446655440000',
   'alice@example.com',
   'alice_security',
   '$2b$10$ZIH2jJg.8DkBFTmYOHC8I.wR7/7DkY2ZZ2Z2ZZ2ZZ2ZZ2ZZ2ZZ2ZZ2', -- password: student123
   'Alice Chen',
   'student',
   'active',
   NOW()),
  
  ('750e8400-e29b-41d4-a716-446655440000',
   'bob@example.com',
   'bob_analyst',
   '$2b$10$ZIH2jJg.8DkBFTmYOHC8I.wR7/7DkY2ZZ2Z2ZZ2ZZ2ZZ2ZZ2ZZ2ZZ2',
   'Bob Williams',
   'student',
   'active',
   NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- CREATE SAMPLE PROGRESS DATA
-- ============================================================

INSERT INTO user_progress (id, user_id, course_id, progress_percentage, status, started_at, completed_at)
VALUES
  ('p1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f',
   '650e8400-e29b-41d4-a716-446655440000',
   'c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f',
   100,
   'completed',
   NOW() - INTERVAL '30 days',
   NOW() - INTERVAL '5 days'),

  ('p1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9a',
   '650e8400-e29b-41d4-a716-446655440000',
   'c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9a',
   65,
   'in_progress',
   NOW() - INTERVAL '7 days',
   NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CREATE SAMPLE CERTIFICATES
-- ============================================================

INSERT INTO certificates (id, user_id, course_id, certificate_code, issued_at, is_valid)
VALUES
  ('cert1-b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e',
   '650e8400-e29b-41d4-a716-446655440000',
   'c1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f',
   'SOC-LINUX-2026-001',
   NOW() - INTERVAL '5 days',
   true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CREATE SAMPLE LAB SUBMISSIONS
-- ============================================================

INSERT INTO lab_submissions (id, user_id, lab_id, findings, report, score, passed, submitted_at, evaluated_at)
VALUES
  ('sub1-d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f',
   '650e8400-e29b-41d4-a716-446655440000',
   'l1b2d3e4-f5a6-4c7b-9e2f-8d1a3b5c7e9f',
   '{"attacker_ip": "192.168.1.100", "failed_attempts": 145, "attack_duration": "2 hours"}',
   'Successfully identified the SSH brute force attack. The attacker used common passwords and attempted login as root user. Attack was detected and blocked by fail2ban.',
   95,
   true,
   NOW() - INTERVAL '3 days',
   NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- ============================================================
-- INDEX CREATION FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_labs_slug ON labs(slug);
CREATE INDEX IF NOT EXISTS idx_labs_difficulty ON labs(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lab_submissions_user_lab ON lab_submissions(user_id, lab_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);

-- ============================================================
-- CONFIRMATION MESSAGE
-- ============================================================

COMMIT;

-- Output summary
SELECT COUNT(*) as total_courses FROM courses;
SELECT COUNT(*) as total_labs FROM labs;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_certificates FROM certificates;
