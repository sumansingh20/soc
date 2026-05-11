// Enterprise SOC training content packs (embedded JSON payloads)
// NOTE:
// - This file is designed to be self-contained (no external file dependencies) as requested.
// - Payload sizes are intentionally moderate but structured like real evidence packs.

export const datasets = [
  {
    slug: 'ds-day1-auth-evidence-ssh-bruteforce',
    title: 'Day 1 Evidence: SSH brute force (auth.log/btmp/wtmp traces)',
    description:
      'Synthetic-but-realistic log evidence for analyst practice: repeated SSH failures, a later accepted login, and session confirmation.',
    meta: {
      datasetType: 'auth_logs',
      sourceRegion: 'edge-gw',
      timeRange: '2026-05-11 09:00-10:00',
      hostCount: 1,
    },
    // auth.log + btmp + wtmp style evidence in one payload pack.
    payload: {
      files: {
        'auth.log': [
          {
            ts: '2026-05-11T09:14:21+05:30',
            host: 'web01',
            service: 'sshd',
            pid: 3181,
            level: 'authpriv',
            line:
              'May 11 09:14:21 web01 sshd[3181]: Failed password for invalid user admin from 203.0.113.45 port 51022 ssh2',
            fields: {
              result: 'failed',
              username: 'admin',
              src_ip: '203.0.113.45',
              port: 51022,
              proto: 'ssh2',
              message: 'Failed password for invalid user admin',
            },
            tags: ['ssh', 'failed', 'invalid-user'],
          },
          {
            ts: '2026-05-11T09:22:08+05:30',
            host: 'web01',
            service: 'sshd',
            pid: 3220,
            level: 'authpriv',
            line:
              'May 11 09:22:08 web01 sshd[3220]: Failed password for root from 203.0.113.45 port 51201 ssh2',
            fields: {
              result: 'failed',
              username: 'root',
              src_ip: '203.0.113.45',
              port: 51201,
              proto: 'ssh2',
              message: 'Failed password for root',
            },
            tags: ['ssh', 'failed', 'root'],
          },
          {
            ts: '2026-05-11T09:31:44+05:30',
            host: 'web01',
            service: 'sshd',
            pid: 3299,
            level: 'authpriv',
            line:
              'May 11 09:31:44 web01 sshd[3299]: Accepted password for backup from 203.0.113.45 port 51884 ssh2',
            fields: {
              result: 'accepted',
              username: 'backup',
              src_ip: '203.0.113.45',
              port: 51884,
              proto: 'ssh2',
              message: 'Accepted password for backup',
            },
            tags: ['ssh', 'accepted', 'success'],
          },
          {
            ts: '2026-05-11T09:33:01+05:30',
            host: 'web01',
            service: 'sshd',
            pid: 3351,
            level: 'authpriv',
            line:
              'May 11 09:33:01 web01 sshd[3351]: pam_unix(sshd:session): session opened for user backup by (uid=0)',
            fields: {
              result: 'session-open',
              username: 'backup',
              uid: 0,
            },
            tags: ['ssh', 'session', 'pam'],
          },
        ],
      },
      derived: {
        src_ip: '203.0.113.45',
        suspicious_usernames: ['admin', 'root'],
        success_user: 'backup',
        suspiciousWindow: {
          start: '2026-05-11T09:14:21+05:30',
          end: '2026-05-11T09:31:44+05:30',
        },
      },
    },
    indexes: [
      { name: 'auth_ts', path: 'files.auth.log.ts' },
      { name: 'auth_src_ip', path: 'derived.src_ip' },
    ],
    published: true,
  },
  {
    slug: 'ds-day2-apache-attack-trace-404-pathprobes',
    title: 'Day 2 Evidence: Apache 404 scanning + traversal probe',
    description:
      'Evidence pack with Apache access/error traces showing path probing, traversal patterns, and no successful 200 in sample window.',
    meta: {
      datasetType: 'apache_access',
      sourceRegion: 'public-web',
      timeRange: '2026-05-11 11:00-11:10',
      hostCount: 1,
    },
    payload: {
      files: {
        'access.log': [
          {
            ts: '2026-05-11T11:05:18+05:30',
            host: 'web02',
            client_ip: '203.0.113.77',
            method: 'GET',
            path: '/../../etc/passwd',
            http_version: 'HTTP/1.1',
            status: 404,
            bytes: 298,
            user_agent: 'curl/8.0',
            referrer: '-',
            line:
              '203.0.113.77 - - [11/May/2026:11:05:18 +0530] "GET /../../etc/passwd HTTP/1.1" 404 298 "-" "curl/8.0"',
            tags: ['apache', 'traversal', '404', 'scanner'],
          },
          {
            ts: '2026-05-11T11:05:21+05:30',
            host: 'web02',
            client_ip: '203.0.113.77',
            method: 'GET',
            path: '/wp-admin/',
            http_version: 'HTTP/1.1',
            status: 404,
            bytes: 312,
            user_agent: 'Mozilla/5.0',
            referrer: '-',
            line:
              '203.0.113.77 - - [11/May/2026:11:05:21 +0530] "GET /wp-admin/ HTTP/1.1" 404 312 "-" "Mozilla/5.0"',
            tags: ['apache', 'wp-admin', '404', 'probe'],
          },
        ],
        'error.log': [
          {
            ts: '2026-05-11T11:05:18+05:30',
            host: 'web02',
            client_ip: '203.0.113.77',
            level: 'error',
            message: 'File does not exist',
            detail: '/var/www/etc/passwd',
            line:
              '[Mon May 11 11:05:18.221] [error] [client 203.0.113.77] File does not exist: /var/www/etc/passwd',
            tags: ['apache', 'error', 'confirm-path'],
          },
        ],
      },
      derived: {
        scanner_ip: '203.0.113.77',
        attacked_paths: ['/../../etc/passwd', '/wp-admin/'],
        observed_statuses: [404],
        success_in_window: false,
      },
    },
    indexes: [{ name: 'apache_client_ip', path: 'payload.files.access.log.client_ip' }],
    published: true,
  },
];

export const evidencePacks = [
  {
    slug: 'ep-day1-ssh-bruteforce-evidence',
    title: 'Evidence Pack: SSH brute force + accepted login',
    description:
      'Evidence IDs map to specific log facts used by labs and case studies.',
    datasetSlug: 'ds-day1-auth-evidence-ssh-bruteforce',
    evidence: [
      {
        id: 'E1',
        label: 'Failed password for invalid user admin (src 203.0.113.45)',
        kind: 'log',
        source: 'auth.log',
        content:
          'May 11 09:14:21 web01 sshd[3181]: Failed password for invalid user admin from 203.0.113.45 port 51022 ssh2',
        tags: ['ssh', 'failed', 'admin'],
      },
      {
        id: 'E2',
        label: 'Failed password for root (same src)',
        kind: 'log',
        source: 'auth.log',
        content:
          'May 11 09:22:08 web01 sshd[3220]: Failed password for root from 203.0.113.45 port 51201 ssh2',
        tags: ['ssh', 'failed', 'root'],
      },
      {
        id: 'E3',
        label: 'Accepted password for backup (success after failures)',
        kind: 'log',
        source: 'auth.log',
        content:
          'May 11 09:31:44 web01 sshd[3299]: Accepted password for backup from 203.0.113.45 port 51884 ssh2',
        tags: ['ssh', 'accepted', 'success'],
      },
      {
        id: 'E4',
        label: 'Session opened for user backup (post-auth)',
        kind: 'log',
        source: 'auth.log',
        content:
          'May 11 09:33:01 web01 sshd[3351]: pam_unix(sshd:session): session opened for user backup by (uid=0)',
        tags: ['ssh', 'session', 'pam'],
      },
    ],
    published: true,
  },
  {
    slug: 'ep-day2-apache-404-pathprobes',
    title: 'Evidence Pack: Apache 404 scanning + traversal probe',
    description: 'Evidence IDs used to validate web probing reconnaissance.',
    datasetSlug: 'ds-day2-apache-attack-trace-404-pathprobes',
    evidence: [
      {
        id: 'W1',
        label: 'Traversal probe: /../../etc/passwd => 404',
        kind: 'log',
        source: 'access.log',
        content:
          '203.0.113.77 - - [11/May/2026:11:05:18 +0530] "GET /../../etc/passwd HTTP/1.1" 404 298 "-" "curl/8.0"',
        tags: ['apache', 'traversal', '404'],
      },
      {
        id: 'W2',
        label: 'Probe: /wp-admin/ => 404',
        kind: 'log',
        source: 'access.log',
        content:
          '203.0.113.77 - - [11/May/2026:11:05:21 +0530] "GET /wp-admin/ HTTP/1.1" 404 312 "-" "Mozilla/5.0"',
        tags: ['apache', 'wp-admin', '404'],
      },
      {
        id: 'W3',
        label: 'Error log confirms missing file target',
        kind: 'log',
        source: 'error.log',
        content:
          '[Mon May 11 11:05:18.221] [error] [client 203.0.113.77] File does not exist: /var/www/etc/passwd',
        tags: ['apache', 'error', 'confirm'],
      },
    ],
    published: true,
  },
];

export const caseStudies = [
  {
    slug: 'case-day1-ssh-bruteforce-to-intrusion',
    title: 'Case Study: From SSH brute force to accepted login',
    description:
      'A realistic analyst case: multiple failed SSH attempts followed by an accepted password and session creation. Students reconstruct a timeline and write a defensible finding.',
    difficulty: 'beginner',
    datasetSlugs: ['ds-day1-auth-evidence-ssh-bruteforce'],
    evidencePackSlugs: ['ep-day1-ssh-bruteforce-evidence'],
    stages: [
      {
        stageSlug: 'stg-triage-failed-logins',
        title: 'Triage: identify brute force pressure',
        objective:
          'Confirm failed SSH evidence and determine attacker source and targeted usernames.',
        evidenceIds: ['E1', 'E2'],
        guidance:
          'Look for repeated “Failed password” lines. Group by src_ip. Multiple usernames against a single source increases confidence.'
      },
      {
        stageSlug: 'stg-validate-success',
        title: 'Validate the success event',
        objective:
          'Confirm whether a login succeeded after failures and identify the account used.',
        evidenceIds: ['E3'],
        guidance:
          'Accepted events are decisive. Note username and src_ip and compare to the failure window.'
      },
      {
        stageSlug: 'stg-session-and-scope',
        title: 'Session creation & immediate scope',
        objective:
          'Confirm session establishment and prepare next-step endpoint checks.',
        evidenceIds: ['E4'],
        guidance:
          'Session opened indicates access was more than a failed attempt. Recommend follow-up: process review, persistence checks.'
      },
    ],
    timeline: [
      {
        at: '2026-05-11 09:14:21',
        type: 'event',
        title: 'Failed password (invalid user admin) from 203.0.113.45',
        evidenceIds: ['E1'],
        description: 'Start of brute-force pressure window.'
      },
      {
        at: '2026-05-11 09:22:08',
        type: 'event',
        title: 'Failed password (root) from same source',
        evidenceIds: ['E2'],
        description: 'Same attacker tries multiple usernames.'
      },
      {
        at: '2026-05-11 09:31:44',
        type: 'event',
        title: 'Accepted password (backup) from same source',
        evidenceIds: ['E3'],
        description: 'Success after failures; escalate to incident handling.'
      },
      {
        at: '2026-05-11 09:33:01',
        type: 'event',
        title: 'Session opened for backup',
        evidenceIds: ['E4'],
        description: 'Confirm access/session and start scoping.'
      },
    ],
    published: true,
  },
];

export const dashboardBoards = [
  {
    slug: 'board-soc-day1-ssh-bruteforce',
    title: 'SOC Board: SSH brute force activity',
    description:
      'Widget-based SOC dashboard for the Day 1 intrusion case: activity feed and evidence-backed timeline.',
    datasetSlugs: ['ds-day1-auth-evidence-ssh-bruteforce'],
    widgetOrder: [{ widgetSlug: 'w-alert-counter-ssh' }, { widgetSlug: 'w-severity-timeline-day1' }],
    published: true,
  },
];

export const dashboardWidgets = [
  {
    slug: 'w-alert-counter-ssh',
    title: 'Alert Counter (Auth Evidence)',
    description: 'Counts failed vs accepted SSH events for the selected dataset.',
    boardSlugs: ['board-soc-day1-ssh-bruteforce'],
    widgetKind: 'alert_counter',
    datasetSlugs: ['ds-day1-auth-evidence-ssh-bruteforce'],
    config: {
      sources: ['auth.log'],
      grouping: 'src_ip',
      fields: {
        failureTag: 'failed',
        successTag: 'success',
      },
    },
    evidenceIds: ['E1', 'E2', 'E3'],
    published: true,
  },
  {
    slug: 'w-severity-timeline-day1',
    title: 'Severity Timeline (Case-backed)',
    description: 'Shows timeline events anchored to evidence IDs.',
    boardSlugs: ['board-soc-day1-ssh-bruteforce'],
    widgetKind: 'severity_timeline',
    datasetSlugs: ['ds-day1-auth-evidence-ssh-bruteforce'],
    config: {
      caseSlug: 'case-day1-ssh-bruteforce-to-intrusion',
    },
    evidenceIds: ['E1', 'E2', 'E3', 'E4'],
    published: true,
  },
];

// Labs seed integration: minimal evidence-driven target for current lab UI.
// These will replace keyword-only grading for at least one lab while keeping other labs working.
export const enterpriseLabs = [
  {
    slug: 'ssh-brute-force-detection',
    title: 'SSH Brute Force Detection (Evidence-based)',
    description:
      'Use evidence packs to confirm brute force pressure, validate success, and prepare immediate scoping actions.',
    scenario:
      'A Linux server generated SSH login failures, followed by one accepted password. Determine whether this is brute force followed by valid credentials reuse.',
    objective: 'Identify attacker source, count/justify failures, confirm accepted login, and recommend next analyst actions.',
    difficulty: 'beginner',
    category: 'Authentication',
    tags: ['auth.log', 'btmp', 'wtmp', 'ssh', 'evidence-driven'],
    estimatedMinutes: 40,
    estimatedTimeMinutes: 40,
    datasets: [{ datasetSlug: 'ds-day1-auth-evidence-ssh-bruteforce' }],
    evidencePacks: [{ datasetSlug: 'ds-day1-auth-evidence-ssh-bruteforce', packSlug: 'ep-day1-ssh-bruteforce-evidence' }],
    // requiredEvidenceIds will be enforced in grading.
    requiredEvidenceIds: ['E1', 'E2', 'E3'],
    expectedFindings: ['203.0.113.45 generated repeated failures', 'backup account had an accepted password'],
    logs: ['auth.log', 'btmp', 'wtmp'],
    sampleLogs: [
      {
        source: 'auth.log',
        line:
          'May 11 09:31:44 web01 sshd[3299]: Accepted password for backup from 203.0.113.45 port 51884 ssh2',
        clue: 'Accepted password after failures',
      },
    ],
    commands: [
      'grep -i "Failed password" /var/log/auth.log',
      'grep "203.0.113.45" /var/log/auth.log',
      'sudo lastb | head',
      'grep -i "Accepted password" /var/log/auth.log',
    ],
    workflow: [
      'Filter failed SSH events',
      'Group by source IP and enumerate targeted usernames',
      'Confirm accepted password and username',
      'Write evidence-based finding with recommended next steps',
    ],
    solution:
      'Evidence supports SSH brute force pressure from 203.0.113.45 followed by a successful login to backup (accepted password).',
    rubrics: { overall: 'Brute-force confidence + accepted login validation + evidence-based write-up.', checklistWeight: 0.7, rationaleWeight: 0.3 },
    published: true,
  },
];

