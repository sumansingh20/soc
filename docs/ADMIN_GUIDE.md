# SOC Academy - Admin Guide

## Admin Dashboard Overview

The Admin Dashboard is the command center for SOC Academy platform management. Only users with `admin` role can access these features.

---

## 👥 User Management

### View All Users
- **Path**: Admin > Users
- **Features**:
  - List of all registered users
  - Search by email, username, full name
  - Filter by role (student, instructor, admin)
  - Filter by status (active, suspended, banned)
  - Sort by registration date, last login, activity

### User Profile Management
- **Edit User Details**:
  - Email address
  - Full name
  - Username
  - Role assignment
  - Status (active/suspended/banned)
  - Profile picture

- **View User Activity**:
  - Courses enrolled
  - Labs completed
  - Certificates earned
  - Last login
  - Account creation date
  - Progress overview

- **User Actions**:
  - Suspend user account (user cannot login)
  - Ban user (complete removal from platform)
  - Reset user password
  - Send message to user
  - View audit trail

### Bulk User Operations
- [ ] Bulk export (CSV)
- [ ] Bulk suspend/ban
- [ ] Bulk role assignment
- [ ] Bulk email notification

---

## 📚 Course Management

### Create Course
1. Navigate to **Courses** > **Create New Course**
2. Fill in course details:
   - **Title**: Course name
   - **Slug**: URL-friendly name (auto-generated)
   - **Description**: Short description
   - **Full Description**: Detailed course content
   - **Difficulty**: beginner/intermediate/advanced/expert
   - **Category**: SIEM, Threat Hunting, DFIR, etc.
   - **Duration**: Hours required to complete
   - **Price**: Set as free or premium
   - **Prerequisites**: Select other courses as prerequisites
   - **Instructor**: Assign course instructor
   - **Cover Image**: Upload course thumbnail

3. Add Lessons:
   - Click **Add Lesson**
   - Set lesson title and order
   - Add lesson content (video link, notes, etc.)
   - Add related labs
   - Set estimated duration

4. Publish Course:
   - Click **Publish** to make visible to students
   - Unpublish to hide course

### Edit Course
- Change any course details
- Reorder lessons
- Update content
- Modify pricing
- Change instructor

### Course Analytics
- **Metrics Displayed**:
  - Total enrollments
  - Completion rate
  - Average rating
  - Student feedback
  - Time spent per lesson
  - Quiz performance

- **Actions**:
  - Identify struggling students
  - Export engagement report
  - View trending content

### Featured Courses
- Mark courses as "Featured" on homepage
- Featured courses appear in top banner
- Rotate featured courses monthly

---

## 🧪 Lab Management

### Create Lab
1. Navigate to **Labs** > **Create New Lab**
2. Fill in lab details:
   - **Title**: Lab name
   - **Slug**: URL-friendly name
   - **Description**: Lab overview
   - **Difficulty**: Skill level
   - **Category**: Type of lab
   - **Estimated Time**: Minutes to complete
   - **Tags**: Skills being taught

3. Add Scenarios:
   - Describe the investigation scenario
   - Provide data/logs for analysis
   - Set expected findings
   - Create hints (if applicable)

4. Set Evaluation:
   - Auto-grading rules (for detection labs)
   - Manual grading instructions (for investigation labs)
   - Passing score threshold

5. Publish Lab

### View Lab Submissions
- See all student submissions
- Review findings and reports
- Grade manual submissions
- Leave feedback
- Export submissions

### Lab Performance
- Success rate
- Average completion time
- Common mistakes
- Most helpful hints

---

## 📊 Analytics Dashboard

### Key Metrics
- **Total Users**: Current count + growth trend
- **Active Users**: Today, this week, this month
- **Total Enrollments**: Across all courses
- **Average Completion Rate**: Platform-wide metric
- **Revenue** (if applicable): Monthly/yearly trends

### User Analytics
- **New Users This Month**: Count and growth rate
- **User Retention**: Week-over-week retention
- **Engagement**: Active users vs. inactive
- **User Segments**: By role, by progress level

### Course Analytics
- **Most Popular Courses**: By enrollments
- **Highest Rated Courses**: By rating
- **Trending Courses**: Rising in popularity
- **Courses Needing Attention**: Low completion rate
- **Course Performance**: By difficulty level

### Lab Analytics
- **Lab Completion Rate**: By lab
- **Lab Difficulty Assessment**: Actual vs. intended
- **Lab Success Rate**: % of passing submissions
- **Time Spent per Lab**: Average and distribution

### Revenue Analytics (if applicable)
- **Monthly Revenue**: Trend chart
- **Revenue by Course**: Which courses generate most revenue
- **Refund Rate**: Customer satisfaction indicator
- **Subscription Metrics**: If applicable

### Custom Reports
- Generate custom date range reports
- Filter by course, category, user segment
- Export as PDF or CSV
- Schedule email reports

---

## 🔒 Security & Moderation

### Content Moderation
- **Review Forum Posts**:
  - Approve/reject user-created content
  - Flag inappropriate content
  - Remove spam
  - Manage user reports

- **User Reports**:
  - View reported content
  - View reported users
  - Take action (warn, suspend, ban)
  - Track moderation history

### Audit Logs
- View all admin actions:
  - User suspensions
  - Content deletions
  - Course modifications
  - Role changes
  - System configuration changes
- Filter by date, user, action type
- Export audit trail

### Security Settings
- **Admin Roles**:
  - Super Admin: Full system access
  - Content Admin: Manage courses/labs
  - User Admin: Manage users
  - Support Admin: Assist users

- **Two-Factor Authentication**:
  - Enable 2FA for admin accounts
  - Require 2FA for sensitive operations

- **API Keys**:
  - Generate API keys for integrations
  - Revoke compromised keys
  - Set rate limits per key

---

## 📧 Communication

### Send System-wide Announcement
1. Go to **Communications** > **Announcements**
2. Write announcement
3. Select target audience:
   - All users
   - By role
   - By enrollment status
   - By activity level
4. Schedule delivery
5. Send

### Email Templates
- Course enrollment confirmation
- Certificate completion
- Password reset
- System announcements
- Weekly digest
- Course update notifications

### Send Direct Message
- Message individual users
- Message user groups
- View message history
- Set auto-reply messages

---

## ⚙️ System Configuration

### Platform Settings
- **Branding**:
  - Site name
  - Logo
  - Color scheme
  - Favicon

- **Email Settings**:
  - SMTP configuration
  - From email address
  - Reply-to address
  - Email templates

- **Payment Settings** (if applicable):
  - Stripe API keys
  - Currency
  - Refund policy
  - Tax configuration

- **Feature Toggles**:
  - Enable/disable discussions
  - Enable/disable certificates
  - Enable/disable challenges
  - Enable/disable AI assistant

### Database Maintenance
- **Backup**:
  - Create manual backup
  - View backup history
  - Restore from backup

- **Optimization**:
  - Run database optimization
  - Check database health
  - View database size

- **Migration**:
  - Run pending migrations
  - View migration history

### API Management
- **API Keys**: Manage integration keys
- **Webhooks**: Configure webhook endpoints
- **Rate Limits**: Set API rate limits
- **Documentation**: Access API docs

---

## 📋 Content Management

### Bulk Course Actions
- **Import Courses**: Upload CSV file with course data
- **Export Courses**: Download all courses as CSV
- **Duplicate Course**: Clone existing course
- **Archive Courses**: Hide from public but keep data

### Media Management
- Upload course images
- Manage video uploads
- Organize media library
- Set image compression settings

### Content Approval Workflow
- [ ] Submission queue for new content
- [ ] Review pending courses/labs
- [ ] Approve/reject with feedback
- [ ] Track content approval stats

---

## 🎯 Admin Best Practices

### User Management
1. **Regular Audits**: Review user accounts monthly
2. **Security**: Require strong passwords, enable 2FA
3. **Compliance**: Document user actions
4. **Support**: Respond to user issues promptly

### Content Management
1. **Quality Control**: Review new courses before publishing
2. **Updates**: Keep content current with industry changes
3. **Feedback**: Incorporate student feedback into improvements
4. **Standards**: Maintain quality standards across courses

### System Health
1. **Monitoring**: Check system health daily
2. **Backups**: Verify backups are working
3. **Updates**: Keep software dependencies updated
4. **Performance**: Monitor and optimize database queries

### Communication
1. **Transparency**: Keep users informed of changes
2. **Support**: Provide timely support responses
3. **Community**: Foster positive community environment
4. **Feedback**: Regularly gather and act on feedback

---

## 🚨 Troubleshooting

### Common Admin Issues

**User Cannot Login**
- Check if account is suspended/banned
- Verify email is confirmed
- Reset password
- Check for security holds

**Course Not Appearing**
- Verify course is published
- Check course start date (future courses may be hidden)
- Verify user has course access
- Check user's role restrictions

**Lab Submissions Not Grading**
- Check grading rules are configured
- Verify auto-grading logic
- Check for system errors in logs
- Manually review submissions

**Payment Issues**
- Verify Stripe API keys are correct
- Check for webhook failures
- Review transaction logs
- Contact payment support if needed

---

## 📞 Support

For admin support:
- Email: admin-support@soc-academy.com
- Slack: #admin-help (if enabled)
- Docs: [Admin Guide](ADMIN_GUIDE.md)
- GitHub: [Issues](https://github.com/soc-academy/platform/issues)
