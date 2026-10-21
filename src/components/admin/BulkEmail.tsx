'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { adminRequest, text, type Row } from '@/lib/admin';
import { Table, LoadState } from '@/components/admin/AdminUI';

interface BulkEmailProps {
  eventId: string;
  superAdmin?: boolean;
}

interface Template {
  id: number;
  name: string;
  eventId: string | null;
  subject: string;
  bodyHtml: string;
  bodyText: string | null;
  createdAt: string;
  updatedAt: string;
  event?: { id: string; name: string };
  createdBy?: { firstName: string; lastName: string; email: string };
}

interface Campaign {
  id: string;
  eventId: string;
  title: string;
  subject: string;
  filterType: string;
  filterValue: string | null;
  status: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  attachments?: Array<{ filename: string; contentType?: string; size?: number }>;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  createdBy?: { firstName: string; lastName: string };
}

interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  content: string; // base64 string
}

interface RecipientLog {
  id: number;
  name: string;
  email: string;
  tfid: string | null;
  status: string;
  attempts: number;
  error: string | null;
  sentAt: string | null;
}

interface TargetRecipient {
  userId: string;
  email: string;
  name: string;
  firstName: string;
  tfid: string;
  collegeName: string;
  phoneNumber: string;
  registrationId: number;
  status: string;
  teamId?: number | null;
  teamName?: string;
  teamCode?: string;
}

const DEFAULT_SHORTLIST_HTML = `<p>Dear Participant,</p>
<p>Congratulations! You have been <strong>shortlisted</strong> for <strong>TantraFiesta 2026</strong>!</p>
<p>Please register and confirm your slot on our official website right away:</p>
<div style="margin: 24px 0; text-align: center;">
  <a href="https://www.tantrafiesta.in" target="_blank" style="display: inline-block; background-color: #E7137D; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(231, 19, 125, 0.4);">
    Register on TantraFiesta.in &rarr;
  </a>
</div>
<p style="font-size: 13px; color: #A49FBD;">
  Official Website Link: <a href="https://www.tantrafiesta.in" target="_blank" style="color: #FFFF1A;">https://www.tantrafiesta.in</a>
</p>
<p>If you have any questions or require assistance, please reply directly to this email or reach us at <a href="mailto:contact@tantrafiesta.in" style="color: #FFFF1A;">contact@tantrafiesta.in</a>.</p>
<p style="margin-top: 24px;">
  See you at TantraFiesta 2026!<br>
  Warm regards,<br>
  <strong>Team TantraFiesta 2026</strong><br>
  IIIT Nagpur
</p>`;

export function BulkEmail({ eventId, superAdmin }: BulkEmailProps) {
  const [activeTab, setActiveTab] = useState<'compose' | 'direct' | 'templates' | 'history'>('compose');
  const [eventData, setEventData] = useState<Row | null>(null);

  // Composer Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterValue, setFilterValue] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');

  // Attachments State (PDF / DOCX)
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [attachmentError, setAttachmentError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  // Live Recipient Count & Target List State
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [countingRecipients, setCountingRecipients] = useState(false);
  const [countError, setCountError] = useState('');
  const [targetRecipients, setTargetRecipients] = useState<TargetRecipient[]>([]);
  const [showRecipientsList, setShowRecipientsList] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');

  // Preview & Test State
  const [previewData, setPreviewData] = useState<{
    renderedSubject: string;
    renderedHtml: string;
    sampleRecipient: Row;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState('');

  // Templates Tab State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templateModal, setTemplateModal] = useState<{
    open: boolean;
    template?: Template | null;
    isGlobal?: boolean;
  }>({ open: false });
  const [templateForm, setTemplateForm] = useState({ name: '', subject: '', bodyHtml: '', bodyText: '', isGlobal: false });
  const [savingTemplate, setSavingTemplate] = useState(false);

  // History Tab State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [recipientLogs, setRecipientLogs] = useState<RecipientLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Direct email state — the one composer that writes to addresses typed by
  // hand rather than to anyone the database knows about.
  const [directEmailsInput, setDirectEmailsInput] = useState('');
  const [directSubject, setDirectSubject] = useState('');
  const [directBodyHtml, setDirectBodyHtml] = useState('');
  /** Only a send explicitly marked as a shortlist gets the shortlist footer. */
  const [directIsShortlist, setDirectIsShortlist] = useState(false);
  const [directTemplateId, setDirectTemplateId] = useState<number | ''>('');
  const [directAttachments, setDirectAttachments] = useState<EmailAttachment[]>([]);
  const [directAttachmentError, setDirectAttachmentError] = useState('');
  const [directSending, setDirectSending] = useState(false);
  const [directResult, setDirectResult] = useState<{
    success: boolean;
    message: string;
    total?: number;
    sentCount?: number;
    failedCount?: number;
    failed?: Array<{ email: string; error: string }>;
  } | null>(null);
  const [directPreviewOpen, setDirectPreviewOpen] = useState(false);

  /**
   * Mirrors `parseRecipientList` on the server, so the count shown here is the
   * count that will actually be written to. Accepts bare addresses and the
   * `Name <address>` form, separated by commas, semicolons or line breaks.
   */
  const parsedDirectEmails = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const entries: Array<{ email: string; name: string | null }> = [];

    for (const chunk of directEmailsInput.split(/[\r\n,;]+/)) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;
      const angled = trimmed.match(/^(.*)<([^<>]+)>$/);
      if (angled) {
        entries.push({ name: angled[1].trim().replace(/^["']|["']$/g, '').trim() || null, email: angled[2].trim() });
        continue;
      }
      for (const token of trimmed.split(/\s+/)) {
        if (token) entries.push({ name: null, email: token });
      }
    }

    const byEmail = new Map<string, { email: string; name: string | null }>();
    for (const entry of entries) {
      const email = entry.email.toLowerCase();
      if (!emailRegex.test(email)) continue;
      const seen = byEmail.get(email);
      if (!seen) byEmail.set(email, { email, name: entry.name });
      else if (!seen.name && entry.name) seen.name = entry.name;
    }
    return [...byEmail.values()];
  }, [directEmailsInput]);

  const handleSendDirectEmail = async () => {
    if (parsedDirectEmails.length === 0) return;
    const confirmSend = window.confirm(
      `Send this email to ${parsedDirectEmails.length} recipient(s) from contact@tantrafiesta.in?\n\nSubject: ${directSubject}\n\nTo: ${parsedDirectEmails
        .slice(0, 5)
        .map((r) => r.email)
        .join(', ')}${parsedDirectEmails.length > 5 ? ` and ${parsedDirectEmails.length - 5} more` : ''}${
        directAttachments.length
          ? `\n\nAttached: ${directAttachments.map((a) => a.filename).join(', ')}`
          : ''
      }`
    );
    if (!confirmSend) return;

    setDirectSending(true);
    setDirectResult(null);

    try {
      const res = (await adminRequest(`/api/admin/bulk-email/events/${eventId}/send-direct`, {
        // Sent in the `Name <address>` form so the server keeps the names.
        emails: parsedDirectEmails.map((r) => (r.name ? `${r.name} <${r.email}>` : r.email)),
        subject: directSubject,
        bodyHtml: directBodyHtml,
        kind: directIsShortlist ? 'shortlist' : 'general',
        attachments: directAttachments.map((a) => ({
          filename: a.filename,
          contentType: a.contentType,
          content: a.content,
          size: a.size,
        })),
      })) as {
        success: boolean;
        message: string;
        total: number;
        sentCount: number;
        failedCount: number;
        failed: Array<{ email: string; error: string }>;
      };

      setDirectResult({
        success: res.sentCount > 0,
        message: res.message || `Successfully sent to ${res.sentCount} recipient(s).`,
        total: res.total,
        sentCount: res.sentCount,
        failedCount: res.failedCount,
        failed: res.failed,
      });

      if (res.failedCount === 0) {
        setDirectEmailsInput('');
        setDirectAttachments([]);
        setDirectAttachmentError('');
      }
    } catch (err) {
      setDirectResult({
        success: false,
        message:
          (err instanceof Error && err.message) ||
          'Failed to send. Please verify SMTP settings and try again.',
      });
    } finally {
      setDirectSending(false);
    }
  };

  const loadTemplates = useCallback(async () => {
    if (!eventId) return;
    setLoadingTemplates(true);
    try {
      const res = (await adminRequest(`/api/admin/bulk-email/events/${eventId}/templates`)) as { templates: Template[] };
      setTemplates(res?.templates || []);
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  }, [eventId]);

  const loadHistory = useCallback(async () => {
    if (!eventId) return;
    setLoadingHistory(true);
    try {
      const res = (await adminRequest(`/api/admin/bulk-email/events/${eventId}/campaigns`)) as { campaigns: Campaign[] };
      setCampaigns(res?.campaigns || []);
    } catch (err) {
      console.error('Error loading campaigns:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [eventId]);

  // 1. Fetch Event Info & Templates on mount or eventId change
  useEffect(() => {
    if (!eventId) return;
    let active = true;

    adminRequest(`/api/admin/events/${eventId}`)
      .then((data) => {
        if (active) setEventData(data as Row);
      })
      .catch((err) => console.error('Error fetching event details:', err));

    adminRequest(`/api/admin/bulk-email/events/${eventId}/templates`)
      .then((res) => {
        if (active) setTemplates((res as { templates: Template[] })?.templates || []);
      })
      .catch((err) => console.error('Error loading templates:', err));

    return () => {
      active = false;
    };
  }, [eventId]);

  // Load history when user switches to history tab
  useEffect(() => {
    if (activeTab !== 'history' || !eventId) return;
    let active = true;

    adminRequest(`/api/admin/bulk-email/events/${eventId}/campaigns`)
      .then((res) => {
        if (active) setCampaigns((res as { campaigns: Campaign[] })?.campaigns || []);
      })
      .catch((err) => console.error('Error loading campaigns:', err));

    return () => {
      active = false;
    };
  }, [activeTab, eventId]);

  // 2. Fetch Live Recipient Count when filter changes (debounced to avoid cascading renders & excessive requests)
  useEffect(() => {
    if (!eventId) return;
    let active = true;

    const timer = setTimeout(async () => {
      if (filterType.startsWith('ROUND_') && !filterValue.trim()) {
        setRecipientCount(null);
        setCountError('Enter a round number to preview recipients');
        setCountingRecipients(false);
        return;
      }

      setCountingRecipients(true);
      setCountError('');
      try {
        const query = new URLSearchParams({ filterType });
        if (filterValue) query.set('filterValue', filterValue);

        const data = (await adminRequest(
          `/api/admin/bulk-email/events/${eventId}/recipients/preview?${query.toString()}`
        )) as { totalEligible: number; skippedCount: number; recipients?: TargetRecipient[] };
        if (active) {
          setRecipientCount(data.totalEligible);
          setTargetRecipients(data.recipients || []);
        }
      } catch (err) {
        if (active) {
          setCountError(err instanceof Error ? err.message : 'Error calculating recipients');
          setRecipientCount(null);
          setTargetRecipients([]);
        }
      } finally {
        if (active) {
          setCountingRecipients(false);
        }
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [eventId, filterType, filterValue]);

  // Handle template selection in composer
  const handleSelectTemplate = (id: number | '') => {
    setSelectedTemplateId(id);
    if (!id) return;
    const t = templates.find((tpl) => tpl.id === id);
    if (t) {
      setSubject(t.subject);
      setBodyHtml(t.bodyHtml);
      if (t.bodyText) setBodyText(t.bodyText);
    }
  };

  /**
   * Load a saved template into the direct composer.
   *
   * The same templates the broadcast composer offers, since a message worth
   * keeping is worth sending either way. The shortlist footer is deliberately
   * left alone: a template says what the mail is, not what it claims about
   * why the recipient is being written to.
   */
  const handleSelectDirectTemplate = (id: number | '') => {
    setDirectTemplateId(id);
    if (!id) return;
    const t = templates.find((tpl) => tpl.id === id);
    if (t) {
      setDirectSubject(t.subject);
      setDirectBodyHtml(t.bodyHtml);
    }
  };

  /** Keep what is in the direct composer as a reusable template. */
  const handleSaveDirectAsTemplate = () => {
    setTemplateForm({
      name: '',
      subject: directSubject,
      bodyHtml: directBodyHtml,
      bodyText: '',
      isGlobal: false,
    });
    setTemplateModal({ open: true, template: null });
  };

  // Quick-insert variable into textarea at cursor position
  const insertVariable = (varName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setBodyHtml((prev) => prev + varName);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = bodyHtml.substring(0, start);
    const after = bodyHtml.substring(end);
    setBodyHtml(before + varName + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + varName.length, start + varName.length);
    }, 50);
  };

  // Handle Email Preview
  const handleGeneratePreview = async () => {
    if (!subject || !bodyHtml) {
      setPreviewError('Subject and Email Body are required to generate preview.');
      return;
    }
    setPreviewLoading(true);
    setPreviewError('');
    try {
      const res = (await adminRequest(`/api/admin/bulk-email/events/${eventId}/preview`, {
        subject,
        bodyHtml,
        bodyText,
        filterType,
        filterValue,
      })) as { renderedSubject: string; renderedHtml: string; sampleRecipient: Row };
      setPreviewData(res);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Error generating preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Format bytes to human readable string
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  /**
   * Document attachment picker (.pdf / .docx), shared by both composers.
   *
   * The broadcast and the direct composer keep separate lists — a file picked
   * for one must never ride along on the other — but the limits are the
   * server's, so they are enforced in one place here rather than twice.
   */
  const makeFileSelectHandler = (
    current: EmailAttachment[],
    setList: React.Dispatch<React.SetStateAction<EmailAttachment[]>>,
    setError: (message: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (current.length + files.length > 3) {
      setError('Maximum 3 attachments allowed per email.');
      e.target.value = '';
      return;
    }

    let runningTotalSize = current.reduce((sum, a) => sum + a.size, 0);

    Array.from(files).forEach((file) => {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (ext !== '.pdf' && ext !== '.docx') {
        setError(`Unsupported file format "${ext}". Only .pdf and .docx are permitted.`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 5MB size limit.`);
        return;
      }

      runningTotalSize += file.size;
      if (runningTotalSize > 10 * 1024 * 1024) {
        setError('Total attachments size exceeds the 10MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setList((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            filename: file.name,
            contentType:
              file.type ||
              (ext === '.pdf'
                ? 'application/pdf'
                : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
            size: file.size,
            content: base64,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleFileSelect = makeFileSelectHandler(attachments, setAttachments, setAttachmentError);
  const handleDirectFileSelect = makeFileSelectHandler(
    directAttachments,
    setDirectAttachments,
    setDirectAttachmentError
  );

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleRemoveDirectAttachment = (id: string) => {
    setDirectAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Handle Test Email Send
  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setTestResult({ success: false, message: 'Please enter a valid test email address' });
      return;
    }
    if (!subject || !bodyHtml) {
      setTestResult({ success: false, message: 'Subject and Body are required before sending a test email' });
      return;
    }
    setTestSending(true);
    setTestResult(null);
    try {
      await adminRequest(`/api/admin/bulk-email/events/${eventId}/test`, {
        testEmail,
        subject,
        bodyHtml,
        bodyText,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          contentType: a.contentType,
          content: a.content,
          size: a.size,
        })),
      });
      setTestResult({
        success: true,
        message: `Test email successfully sent to ${testEmail}${
          attachments.length > 0 ? ` (with ${attachments.length} attachment${attachments.length > 1 ? 's' : ''})` : ''
        }`,
      });
    } catch (err) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Failed sending test email' });
    } finally {
      setTestSending(false);
    }
  };

  // Launch Campaign
  const handleLaunchCampaign = async () => {
    setLaunching(true);
    setLaunchError('');
    try {
      await adminRequest(`/api/admin/bulk-email/events/${eventId}/campaigns`, {
        title: title || `${subject} (${new Date().toLocaleDateString()})`,
        templateId: selectedTemplateId || null,
        subject,
        bodyHtml,
        bodyText,
        filterType,
        filterValue,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          contentType: a.contentType,
          content: a.content,
          size: a.size,
        })),
      });
      setShowConfirmModal(false);
      setActiveTab('history');
      loadHistory();
      // Reset composer
      setTitle('');
      setSubject('');
      setBodyHtml('');
      setAttachments([]);
      setPreviewData(null);
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : 'Failed to launch campaign');
    } finally {
      setLaunching(false);
    }
  };

  // Cancel in-flight Campaign
  const handleCancelCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to cancel this campaign? Pending recipients will not receive emails.')) return;
    try {
      await adminRequest(`/api/admin/bulk-email/campaigns/${campaignId}/cancel`, {}, 'POST');
      loadHistory();
      if (selectedCampaignId === campaignId) {
        loadRecipientLogs(campaignId);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error cancelling campaign');
    }
  };

  // View Recipient Logs
  const loadRecipientLogs = async (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setLoadingLogs(true);
    try {
      const res = (await adminRequest(`/api/admin/bulk-email/campaigns/${campaignId}?limit=100`)) as {
        recipients: RecipientLog[];
      };
      setRecipientLogs(res?.recipients || []);
    } catch (err) {
      console.error('Error fetching recipient logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Save or Create Template
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTemplate(true);
    try {
      if (templateModal.template) {
        // Edit
        await adminRequest(`/api/admin/bulk-email/templates/${templateModal.template.id}`, {
          name: templateForm.name,
          subject: templateForm.subject,
          bodyHtml: templateForm.bodyHtml,
          bodyText: templateForm.bodyText || null,
        }, 'PUT');
      } else {
        // Create
        await adminRequest(`/api/admin/bulk-email/events/${eventId}/templates`, {
          name: templateForm.name,
          eventId: templateForm.isGlobal ? null : eventId,
          subject: templateForm.subject,
          bodyHtml: templateForm.bodyHtml,
          bodyText: templateForm.bodyText || null,
        });
      }
      setTemplateModal({ open: false });
      loadTemplates();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setSavingTemplate(false);
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await adminRequest(`/api/admin/bulk-email/templates/${templateId}`, {}, 'DELETE');
      loadTemplates();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  const isTeam = Boolean(eventData?.isTeamEvent);
  const currentEventName = text(eventData?.name) || 'the event';

  const handleInsertQualificationTemplate = () => {
    if (isTeam) {
      setSubject(`TantraFiesta 2026: You and your team have qualified for ${currentEventName}!`);
      setBodyHtml(
        `<p>Dear {{name}},</p>\n` +
        `<p>Congratulations! We are pleased to announce that <strong>you and your team {{team_name}}</strong> have qualified for the event <strong>{{event_name}}</strong> at TantraFiesta 2026!</p>\n` +
        `<p>Your TFID is <code>{{tfid}}</code> and your Team Code is <code>{{team_code}}</code>.</p>\n` +
        `<p>Please ensure that all members of team <strong>{{team_name}}</strong> report to <strong>{{event_venue}}</strong> on time. Make sure everyone carries valid student ID cards and registration details.</p>\n` +
        `<p>We wish you and your team the very best for the upcoming round!</p>`
      );
      setBodyText(
        `Dear {{name}},\n\n` +
        `Congratulations! We are pleased to announce that you and your team {{team_name}} have qualified for the event {{event_name}} at TantraFiesta 2026!\n\n` +
        `Your TFID is {{tfid}} and your Team Code is {{team_code}}.\n\n` +
        `Please ensure that all members of team {{team_name}} report to {{event_venue}} on time. Make sure everyone carries valid student ID cards and registration details.\n\n` +
        `We wish you and your team the very best for the upcoming round!`
      );
    } else {
      setSubject(`TantraFiesta 2026: You have qualified for ${currentEventName}!`);
      setBodyHtml(
        `<p>Dear {{name}},</p>\n` +
        `<p>Congratulations! We are pleased to announce that you have qualified for the event <strong>{{event_name}}</strong> at TantraFiesta 2026!</p>\n` +
        `<p>Your TFID is <code>{{tfid}}</code>.</p>\n` +
        `<p>Please report to <strong>{{event_venue}}</strong> on time with your student ID card and registration details.</p>\n` +
        `<p>We wish you the very best for the upcoming round!</p>`
      );
      setBodyText(
        `Dear {{name}},\n\n` +
        `Congratulations! We are pleased to announce that you have qualified for the event {{event_name}} at TantraFiesta 2026!\n\n` +
        `Your TFID is {{tfid}}.\n\n` +
        `Please report to {{event_venue}} on time with your student ID card and registration details.\n\n` +
        `We wish you the very best for the upcoming round!`
      );
    }
  };

  const filteredTargetRecipients = targetRecipients.filter((r) => {
    if (!recipientSearch.trim()) return true;
    const q = recipientSearch.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.tfid?.toLowerCase().includes(q) ||
      r.teamName?.toLowerCase().includes(q) ||
      r.teamCode?.toLowerCase().includes(q) ||
      r.collegeName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-bulk-email">
      {/* Event Header Banner */}
      <div className="admin-card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="admin-eyebrow" style={{ color: '#FFFF1A' }}>BULK EMAIL &amp; NOTIFICATIONS</span>
          <h2 style={{ margin: '4px 0 2px' }}>{text(eventData?.name || 'Event')}</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#A49FBD' }}>
            {text(eventData?.club || '')} &bull; {isTeam ? '👥 Team Event (Emails Team Leaders)' : '👤 Solo Event (Emails Participants)'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={activeTab === 'compose' ? 'primary' : ''}
            onClick={() => setActiveTab('compose')}
          >
            ✉️ Compose Broadcast
          </button>
          <button
            className={activeTab === 'direct' ? 'primary' : ''}
            onClick={() => setActiveTab('direct')}
            title="Type any email addresses by hand and write to them"
          >
            📧 Direct Email
          </button>
          <button
            className={activeTab === 'templates' ? 'primary' : ''}
            onClick={() => { setActiveTab('templates'); loadTemplates(); }}
          >
            📋 Templates ({templates.length})
          </button>
          <button
            className={activeTab === 'history' ? 'primary' : ''}
            onClick={() => { setActiveTab('history'); loadHistory(); }}
          >
            📊 History &amp; Logs
          </button>
        </div>
      </div>

      {/* ── TAB 1: COMPOSE BROADCAST ── */}
      {activeTab === 'compose' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 24, alignItems: 'start' }}>
          
          {/* Left Column: Form & Variable Helpers */}
          <div className="admin-card">
            <h3>Compose Event Email</h3>
            <p style={{ color: '#A49FBD', fontSize: 13, marginBottom: 20 }}>
              Broadcast announcements, shortlists, or schedule updates to registered {isTeam ? 'team leaders' : 'participants'}.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setShowConfirmModal(true); }}>
              {/* Recipient Filter Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Recipient Filter
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setFilterValue(''); }}
                    style={{ width: '100%', padding: '10px 12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8 }}
                  >
                    <option value="ALL">All Active Registrations</option>
                    <option value="STATUS">Filter by Status</option>
                    <option value="ROUND_QUALIFIED">Round Qualified / Promoted</option>
                    <option value="ROUND_ELIMINATED">Round Eliminated</option>
                  </select>
                </div>

                {filterType === 'STATUS' && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Select Status
                    </label>
                    <select
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8 }}
                    >
                      <option value="">Select Status</option>
                      <option value="registered">registered</option>
                      <option value="in_round">in_round</option>
                      <option value="shortlisted">shortlisted</option>
                      <option value="confirmed">confirmed</option>
                      <option value="eliminated">eliminated</option>
                    </select>
                  </div>
                )}

                {(filterType === 'ROUND_QUALIFIED' || filterType === 'ROUND_ELIMINATED') && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Round Number
                    </label>
                    <select
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8 }}
                    >
                      <option value="">Select Round</option>
                      <option value="1">Round 1</option>
                      <option value="2">Round 2</option>
                      <option value="3">Round 3</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Live Recipient Count & Target Viewer */}
              <div style={{ padding: '12px 16px', background: 'rgba(255, 255, 26, 0.08)', border: '1px solid rgba(255, 255, 26, 0.3)', borderRadius: 8, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, color: '#e8e6f2' }}>
                      Target Recipients:
                    </span>
                    <strong style={{ fontSize: 14, color: recipientCount === 0 ? '#ff6b6b' : '#FFFF1A' }}>
                      {countingRecipients ? 'Calculating…' : countError ? countError : `${recipientCount ?? 0} Eligible ${isTeam ? 'Team Leaders' : 'Participants'}`}
                    </strong>
                  </div>

                  {targetRecipients.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowRecipientsList((prev) => !prev)}
                      style={{
                        background: showRecipientsList ? '#FFFF1A' : 'rgba(255, 255, 26, 0.15)',
                        color: showRecipientsList ? '#0d081f' : '#FFFF1A',
                        border: '1px solid rgba(255, 255, 26, 0.4)',
                        borderRadius: 6,
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{showRecipientsList ? '▲ Hide Recipients' : `👁 View Target Recipients (${targetRecipients.length})`}</span>
                    </button>
                  )}
                </div>

                {/* Expandable Recipient Details Drawer */}
                {showRecipientsList && targetRecipients.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 26, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                      <p style={{ margin: 0, fontSize: 12, color: '#bcb0dd' }}>
                        {isTeam
                          ? '⚡ Team Event: Only registered team leaders are emailed. Members do not receive duplicates.'
                          : '⚡ Solo Event: Individual registered participants are targeted.'}
                      </p>
                      <input
                        type="text"
                        placeholder="Search by name, email, TFID, team..."
                        value={recipientSearch}
                        onChange={(e) => setRecipientSearch(e.target.value)}
                        style={{
                          padding: '6px 10px',
                          fontSize: 12,
                          background: '#120c29',
                          border: '1px solid #3d2f6d',
                          color: '#fff',
                          borderRadius: 6,
                          minWidth: 240,
                        }}
                      />
                    </div>

                    <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #2e235a', borderRadius: 6, background: '#120c29' }}>
                      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#1c143a', color: '#A49FBD', borderBottom: '1px solid #2e235a' }}>
                            <th style={{ padding: '8px 10px', width: 36 }}>#</th>
                            <th style={{ padding: '8px 10px' }}>Recipient Name</th>
                            <th style={{ padding: '8px 10px' }}>Email Address</th>
                            <th style={{ padding: '8px 10px' }}>TFID</th>
                            {isTeam && <th style={{ padding: '8px 10px' }}>Team</th>}
                            <th style={{ padding: '8px 10px' }}>Status</th>
                            <th style={{ padding: '8px 10px' }}>College</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTargetRecipients.length === 0 ? (
                            <tr>
                              <td colSpan={isTeam ? 7 : 6} style={{ padding: 16, textAlign: 'center', color: '#888' }}>
                                No recipients match &ldquo;{recipientSearch}&rdquo;
                              </td>
                            </tr>
                          ) : (
                            filteredTargetRecipients.map((r, idx) => (
                              <tr key={r.userId + '_' + idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '8px 10px', color: '#6f6a8d' }}>{idx + 1}</td>
                                <td style={{ padding: '8px 10px', fontWeight: 600, color: '#fff' }}>{r.name}</td>
                                <td style={{ padding: '8px 10px', color: '#FFFF1A' }}>{r.email}</td>
                                <td style={{ padding: '8px 10px', color: '#bcb0dd' }}><code>{r.tfid}</code></td>
                                {isTeam && (
                                  <td style={{ padding: '8px 10px', color: '#e8e6f2' }}>
                                    <strong>{r.teamName || '—'}</strong>
                                    {r.teamCode && r.teamCode !== 'N/A' && (
                                      <span style={{ fontSize: 10, color: '#A49FBD', marginLeft: 4 }}>({r.teamCode})</span>
                                    )}
                                  </td>
                                )}
                                <td style={{ padding: '8px 10px' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    background: r.status === 'registered' ? 'rgba(40,167,69,0.2)' : 'rgba(231,19,125,0.2)',
                                    color: r.status === 'registered' ? '#51cf66' : '#ff8787',
                                  }}>
                                    {r.status}
                                  </span>
                                </td>
                                <td style={{ padding: '8px 10px', color: '#8c86ab', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {r.collegeName}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: 6, textAlign: 'right', fontSize: 11, color: '#8c86ab' }}>
                      Showing {filteredTargetRecipients.length} of {targetRecipients.length} eligible recipients
                    </div>
                  </div>
                )}
              </div>

              {/* Template Quick Select & Starter */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', margin: 0 }}>
                    Load Saved Template (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleInsertQualificationTemplate}
                    style={{
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 700,
                      background: 'rgba(255, 255, 26, 0.12)',
                      color: '#FFFF1A',
                      border: '1px solid rgba(255, 255, 26, 0.4)',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    ⚡ Use Qualification Template ({isTeam ? 'Team' : 'Solo'})
                  </button>
                </div>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleSelectTemplate(e.target.value ? Number(e.target.value) : '')}
                  style={{ width: '100%', padding: '10px 12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8 }}
                >
                  <option value="">-- Start from scratch --</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} {tpl.eventId ? '(Event Specific)' : '(Global Template)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campaign Internal Title */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Campaign Internal Reference Title (for admin tracking)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Round 2 Shortlist Notification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8 }}
                />
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  placeholder={
                    isTeam
                      ? `e.g. TantraFiesta 2026: You and your team have qualified for ${currentEventName}!`
                      : `e.g. TantraFiesta 2026: You have qualified for ${currentEventName}!`
                  }
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8 }}
                />
              </div>

              {/* Dynamic Variable Chips */}
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#A49FBD', display: 'block', marginBottom: 6 }}>
                  Click to insert personalized dynamic variables:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['{{name}}', '{{first_name}}', '{{tfid}}', '{{event_name}}', '{{event_venue}}', '{{team_name}}', '{{team_code}}'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      style={{ fontSize: 11, padding: '4px 8px', background: '#291e54', border: '1px solid #4a388a', color: '#FFFF1A', borderRadius: 6, cursor: 'pointer' }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body HTML Editor */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Email Body (HTML supported) *
                </label>
                <textarea
                  ref={textareaRef}
                  rows={10}
                  placeholder={
                    isTeam
                      ? "<p>Dear {{name}},</p><p>Congratulations! We are pleased to announce that you and your team <b>{{team_name}}</b> have qualified for the event {{event_name}}.</p>"
                      : "<p>Dear {{name}},</p><p>Congratulations! We are pleased to announce that you have qualified for the event {{event_name}}.</p>"
                  }
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8, fontFamily: 'monospace', fontSize: 13 }}
                />
              </div>

              {/* Optional Plain Text Alternative */}
              <details style={{ marginBottom: 20 }}>
                <summary style={{ fontSize: 13, color: '#A49FBD', cursor: 'pointer', marginBottom: 8 }}>
                  Plain-Text Alternative (Optional - auto-generated from HTML if empty)
                </summary>
                <textarea
                  rows={4}
                  placeholder="Plain-text version for email clients that do not render HTML"
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8, fontSize: 12 }}
                />
              </details>

              {/* Attachments Section (PDF / DOCX) */}
              <div style={{ marginBottom: 20, padding: '14px 16px', background: '#1c143a', border: '1px solid #3d2f6d', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: attachments.length > 0 ? 12 : 0, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', margin: 0, color: '#fff' }}>
                      📎 Document Attachments (.pdf / .docx)
                    </label>
                    <span style={{ fontSize: 11, color: '#A49FBD' }}>
                      Attach rulebooks, problem statements, or schedules (max 3 files, 5MB each)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={attachments.length >= 3}
                    style={{
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      background: attachments.length >= 3 ? '#291e54' : 'rgba(255, 255, 26, 0.12)',
                      color: attachments.length >= 3 ? '#6f6a8d' : '#FFFF1A',
                      border: '1px solid rgba(255, 255, 26, 0.3)',
                      borderRadius: 6,
                      cursor: attachments.length >= 3 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>+ Add Document</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                </div>

                {attachmentError && (
                  <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(255, 107, 107, 0.15)', border: '1px solid #ff6b6b', borderRadius: 6, color: '#ff8787', fontSize: 12 }}>
                    ⚠️ {attachmentError}
                  </div>
                )}

                {attachments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    {attachments.map((att) => {
                      const isPdf = att.filename.toLowerCase().endsWith('.pdf');
                      return (
                        <div
                          key={att.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            background: '#120c29',
                            border: '1px solid #2e235a',
                            borderRadius: 6,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <span
                              style={{
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 800,
                                background: isPdf ? 'rgba(231, 19, 125, 0.2)' : 'rgba(74, 144, 226, 0.2)',
                                color: isPdf ? '#ff7675' : '#74b9ff',
                                border: `1px solid ${isPdf ? 'rgba(231, 19, 125, 0.4)' : 'rgba(74, 144, 226, 0.4)'}`,
                              }}
                            >
                              {isPdf ? 'PDF' : 'DOCX'}
                            </span>
                            <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {att.filename}
                            </span>
                            <span style={{ fontSize: 11, color: '#8c86ab' }}>
                              ({formatFileSize(att.size)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            title="Remove attachment"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff6b6b',
                              fontSize: 14,
                              cursor: 'pointer',
                              padding: '2px 8px',
                              lineHeight: 1,
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleGeneratePreview}
                  disabled={previewLoading || !subject || !bodyHtml}
                  style={{ background: '#302360', color: '#fff', border: '1px solid #543e9e', padding: '10px 18px', borderRadius: 8 }}
                >
                  {previewLoading ? 'Generating…' : '👁️ Preview Email'}
                </button>

                <button
                  type="submit"
                  disabled={!recipientCount || recipientCount === 0 || !subject || !bodyHtml}
                  className="primary"
                  style={{ padding: '10px 24px', borderRadius: 8 }}
                >
                  🚀 Review &amp; Launch Campaign ({recipientCount ?? 0})
                </button>
              </div>

              {previewError && <p className="admin-error" style={{ marginTop: 12 }}>{previewError}</p>}
            </form>
          </div>

          {/* Right Column: Interactive Real Preview & Test Send */}
          <div>
            {/* Test Send Panel */}
            <div className="admin-card" style={{ marginBottom: 24 }}>
              <h4>🧪 Send Test Email</h4>
              <p style={{ fontSize: 12, color: '#A49FBD', marginBottom: 12 }}>
                Delivers an instant preview with test recipient data directly to your inbox so you can verify email client appearance before launching.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  placeholder="your-email@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8, fontSize: 13 }}
                />
                <button
                  type="button"
                  disabled={testSending || !testEmail || !subject || !bodyHtml}
                  onClick={handleSendTestEmail}
                  style={{ background: '#E7137D', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}
                >
                  {testSending ? 'Sending…' : 'Send Test'}
                </button>
              </div>
              {testResult && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: testResult.success ? '#55efc4' : '#ff7675' }}>
                  {testResult.message}
                </p>
              )}
            </div>

            {/* Email Live Preview Box */}
            <div className="admin-card">
              <h4>Real Participant Sample Preview</h4>
              {previewData ? (
                <div>
                  <div style={{ padding: '8px 12px', background: '#140e2b', border: '1px solid #3d2f6d', borderRadius: 6, marginBottom: 12, fontSize: 12 }}>
                    <div><strong>Subject:</strong> {previewData.renderedSubject}</div>
                    <div style={{ color: '#A49FBD', marginTop: 4 }}>
                      <strong>Sample Recipient:</strong> {String(previewData.sampleRecipient.name)} ({String(previewData.sampleRecipient.email)}) &bull; TFID: {String(previewData.sampleRecipient.tfid)}
                    </div>
                  </div>
                  <div
                    style={{
                      border: '1px solid #3d2f6d',
                      borderRadius: 8,
                      overflow: 'hidden',
                      maxHeight: 500,
                      overflowY: 'auto',
                      background: '#0d081f',
                    }}
                  >
                    <iframe
                      srcDoc={previewData.renderedHtml}
                      title="Email Preview"
                      style={{ width: '100%', height: 450, border: 'none' }}
                      sandbox="allow-popups"
                    />
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#A49FBD' }}>
                  <p style={{ margin: 0 }}>Click <strong>&ldquo;Preview Email&rdquo;</strong> to view the fully rendered HTML message with live participant tokens.</p>
                </div>
              )}
            </div>


          </div>

        </div>
      )}

      {/* ── TAB 2: DIRECT EMAIL TO ANY ADDRESS ── */}
      {activeTab === 'direct' && (
        <div style={{ maxWidth: 860 }}>
          {/* ── Direct email to any address ── */}
          <div className="admin-card" style={{ marginTop: 24, border: '1px solid #43327a', background: '#150f2e' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ margin: 0, color: '#FFFF1A', display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                <span>✉️</span> Write to any email address
              </h4>
              <span
                style={{
                  fontSize: 11,
                  background: '#241a4c',
                  color: '#55efc4',
                  padding: '3px 8px',
                  borderRadius: 4,
                  border: '1px solid #3d2f6d',
                  fontWeight: 600,
                }}
              >
                From: contact@tantrafiesta.in
              </span>
            </div>

            <p style={{ fontSize: 12, color: '#A49FBD', marginBottom: 16, lineHeight: 1.5 }}>
                Type the addresses yourself and write whatever you like — they do not have to be
                registered, or in the database at all. Everything goes out from contact@tantrafiesta.in,
                one message per recipient, so nobody sees who else was written to.
            </p>

            {/* Saved templates — the same ones the broadcast composer offers,
                so a message written once can be reused here. */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8, flexWrap: 'wrap' }}>
                <label htmlFor="direct-template" style={{ fontSize: 12, fontWeight: 600, color: '#e8e6f2' }}>
                  Start from a template
                </label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setDirectSubject('Congratulations! You are shortlisted for TantraFiesta 2026 🎉');
                      setDirectBodyHtml(DEFAULT_SHORTLIST_HTML);
                      setDirectIsShortlist(true);
                      setDirectTemplateId('');
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#FFFF1A', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Use the shortlist template
                  </button>
                  <button
                    type="button"
                    disabled={!directSubject.trim() && !directBodyHtml.trim()}
                    onClick={handleSaveDirectAsTemplate}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: directSubject.trim() || directBodyHtml.trim() ? '#55efc4' : '#4c4766',
                      fontSize: 11,
                      cursor: directSubject.trim() || directBodyHtml.trim() ? 'pointer' : 'not-allowed',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    Save this as a template
                  </button>
                </div>
              </div>
              <select
                id="direct-template"
                value={directTemplateId}
                onChange={(e) => handleSelectDirectTemplate(e.target.value ? Number(e.target.value) : '')}
                style={{ width: '100%', padding: '10px 12px', background: '#1c143a', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 8, fontSize: 13 }}
              >
                <option value="">-- Write from scratch --</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} {tpl.eventId ? '(Event Specific)' : '(Global Template)'}
                  </option>
                ))}
              </select>
              {templates.length === 0 && (
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#A49FBD' }}>
                  No saved templates yet — write a message below and use <strong>Save this as a template</strong>,
                  or create one under the Templates tab.
                </p>
              )}
            </div>

            {/* Recipient Emails Placeholder / Input */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#e8e6f2' }}>
                  To
                </label>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: parsedDirectEmails.length > 0 ? '#55efc4' : '#A49FBD',
                  }}
                >
                  {parsedDirectEmails.length > 0
                    ? `✓ ${parsedDirectEmails.length} recipient${parsedDirectEmails.length > 1 ? 's' : ''}`
                    : 'Separate with commas, spaces, or line breaks'}
                </span>
              </div>
              <textarea
                rows={4}
                value={directEmailsInput}
                onChange={(e) => setDirectEmailsInput(e.target.value)}
                placeholder="someone@gmail.com, another@college.edu&#10;Asha Rao &lt;asha@example.com&gt;&#10;&#10;One per line or separated by commas — paste as many as you like."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1c143a',
                  border: '1px solid #3d2f6d',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Subject Input */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#e8e6f2', display: 'block', marginBottom: 6 }}>
                Email Subject
              </label>
              <input
                type="text"
                value={directSubject}
                onChange={(e) => setDirectSubject(e.target.value)}
                placeholder="e.g. Congratulations! You are shortlisted for TantraFiesta 2026"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#1c143a',
                  border: '1px solid #3d2f6d',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Body HTML Textarea */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#e8e6f2', display: 'block', marginBottom: 6 }}>
                Email Body (HTML)
              </label>
              <textarea
                rows={6}
                value={directBodyHtml}
                onChange={(e) => setDirectBodyHtml(e.target.value)}
                placeholder="<p>Hi {{name}},</p>&#10;<p>Write your message here. Basic HTML works.</p>"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1c143a',
                  border: '1px solid #3d2f6d',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ margin: '6px 0 0', fontSize: 11, color: '#A49FBD', lineHeight: 1.5 }}>
                {'{{name}}'} becomes the name you typed in <code>Name &lt;address&gt;</code> form, or
                &ldquo;there&rdquo; when you gave only an address. {'{{event_name}}'}, {'{{event_venue}}'} and{' '}
                {'{{year}}'} also work.
              </p>
            </div>

            {/* Attachments — its own list, so a file picked for a broadcast
                never rides along on a direct send, or the other way round. */}
            <div style={{ marginBottom: 14, padding: '12px 14px', background: '#1c143a', border: '1px solid #3d2f6d', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', display: 'block' }}>
                    📎 Attachments (.pdf / .docx)
                  </span>
                  <span style={{ fontSize: 11, color: '#A49FBD' }}>
                    Up to 3 files, 5MB each, 10MB in total
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => directFileInputRef.current?.click()}
                  disabled={directAttachments.length >= 3}
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    background: directAttachments.length >= 3 ? '#291e54' : 'rgba(255, 255, 26, 0.12)',
                    color: directAttachments.length >= 3 ? '#6f6a8d' : '#FFFF1A',
                    border: '1px solid rgba(255, 255, 26, 0.3)',
                    borderRadius: 6,
                    cursor: directAttachments.length >= 3 ? 'not-allowed' : 'pointer',
                  }}
                >
                  + Attach File
                </button>
                <input
                  ref={directFileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: 'none' }}
                  onChange={handleDirectFileSelect}
                />
              </div>

              {directAttachmentError && (
                <div role="alert" style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(255, 107, 107, 0.15)', border: '1px solid #ff6b6b', borderRadius: 6, color: '#ff8787', fontSize: 12 }}>
                  ⚠️ {directAttachmentError}
                </div>
              )}

              {directAttachments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  {directAttachments.map((att) => {
                    const isPdf = att.filename.toLowerCase().endsWith('.pdf');
                    return (
                      <div
                        key={att.id}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#120c29', border: '1px solid #2e235a', borderRadius: 6 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 800,
                              background: isPdf ? 'rgba(231, 19, 125, 0.2)' : 'rgba(74, 144, 226, 0.2)',
                              color: isPdf ? '#ff7675' : '#74b9ff',
                              border: `1px solid ${isPdf ? 'rgba(231, 19, 125, 0.4)' : 'rgba(74, 144, 226, 0.4)'}`,
                            }}
                          >
                            {isPdf ? 'PDF' : 'DOCX'}
                          </span>
                          <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {att.filename}
                          </span>
                          <span style={{ fontSize: 11, color: '#8c86ab' }}>({formatFileSize(att.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDirectAttachment(att.id)}
                          title={`Remove ${att.filename}`}
                          aria-label={`Remove ${att.filename}`}
                          style={{ background: 'transparent', border: 'none', color: '#ff6b6b', fontSize: 14, cursor: 'pointer', padding: '2px 8px', lineHeight: 1 }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* The footer is the one thing this page says on the sender's behalf,
                so what it claims is an explicit choice rather than a default. */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                marginBottom: 14,
                fontSize: 12,
                color: '#e8e6f2',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={directIsShortlist}
                onChange={(e) => setDirectIsShortlist(e.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span>
                This is a shortlist notification
                <span style={{ display: 'block', color: '#A49FBD', fontSize: 11, marginTop: 2 }}>
                  {directIsShortlist
                    ? 'Footer will say the recipient was shortlisted and point them at tantrafiesta.in.'
                    : 'Footer will simply say the email is from the TantraFiesta organising team.'}
                </span>
              </span>
            </label>

            {/* Preview & Send Button Controls */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setDirectPreviewOpen(!directPreviewOpen)}
                style={{
                  background: '#241a4c',
                  color: '#fff',
                  border: '1px solid #3d2f6d',
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {directPreviewOpen ? 'Hide Preview' : '👁️ Preview'}
              </button>

              <button
                type="button"
                disabled={
                  directSending ||
                  parsedDirectEmails.length === 0 ||
                  !directSubject.trim() ||
                  !directBodyHtml.trim()
                }
                onClick={handleSendDirectEmail}
                style={{
                  flex: 1,
                  background: parsedDirectEmails.length > 0 && !directSending ? '#E7137D' : '#4d2042',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: parsedDirectEmails.length > 0 && !directSending ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {directSending ? (
                  'Sending…'
                ) : (
                  `🚀 Send Email${parsedDirectEmails.length > 0 ? ` to ${parsedDirectEmails.length} Recipient${parsedDirectEmails.length > 1 ? 's' : ''}` : ''}`
                )}
              </button>
            </div>

            {/* Accordion Preview */}
            {directPreviewOpen && (
              <div style={{ marginTop: 14, border: '1px solid #3d2f6d', borderRadius: 8, overflow: 'hidden' }}>
                <div
                  style={{
                    padding: '8px 12px',
                    background: '#1c143a',
                    fontSize: 12,
                    borderBottom: '1px solid #3d2f6d',
                    color: '#A49FBD',
                  }}
                >
                  <div><strong style={{ color: '#fff' }}>From:</strong> contact@tantrafiesta.in</div>
                  <div><strong style={{ color: '#fff' }}>Subject:</strong> {directSubject}</div>
                  <div><strong style={{ color: '#fff' }}>To:</strong> {parsedDirectEmails.length ? parsedDirectEmails.map((r) => (r.name ? `${r.name} <${r.email}>` : r.email)).join(', ') : '—'}</div>
                </div>
                <div
                  style={{
                    padding: 16,
                    background: '#0d081f',
                    color: '#e8e6f2',
                    fontSize: 13,
                    maxHeight: 280,
                    overflowY: 'auto',
                  }}
                  dangerouslySetInnerHTML={{ __html: directBodyHtml }}
                />
              </div>
            )}

            {/* Results & Delivery Feedback */}
            {directResult && (
              <div
                style={{
                  marginTop: 14,
                  padding: '12px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  background: directResult.success ? 'rgba(85, 239, 196, 0.08)' : 'rgba(255, 118, 117, 0.08)',
                  border: `1px solid ${directResult.success ? '#55efc4' : '#ff7675'}`,
                  color: directResult.success ? '#55efc4' : '#ff7675',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>{directResult.message}</div>
                {directResult.total !== undefined && (
                  <div style={{ marginTop: 4, color: '#A49FBD', fontSize: 11 }}>
                    Total: {directResult.total} &bull; Delivered: {directResult.sentCount} &bull; Failed: {directResult.failedCount}
                  </div>
                )}
                {directResult.failed && directResult.failed.length > 0 && (
                  <div style={{ marginTop: 8, color: '#ff7675', fontSize: 11 }}>
                    <strong>Failed addresses:</strong>
                    <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                      {directResult.failed.map((f, i) => (
                        <li key={i}>
                          <strong>{f.email}:</strong> {f.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: SAVED TEMPLATES ── */}
      {activeTab === 'templates' && (
        <div>
          <div className="admin-section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Saved Email Templates</h3>
            <button
              className="primary"
              onClick={() => {
                setTemplateForm({ name: '', subject: '', bodyHtml: '', bodyText: '', isGlobal: false });
                setTemplateModal({ open: true, template: null });
              }}
            >
              + Create New Template
            </button>
          </div>

          <LoadState loading={loadingTemplates} error="" />

          <Table headings={['Template Name', 'Scope', 'Subject', 'Last Updated', 'Actions']} empty={templates.length === 0}>
            {templates.map((tpl) => (
              <tr key={tpl.id}>
                <td>
                  <strong>{tpl.name}</strong>
                </td>
                <td>
                  <span className="admin-badge" style={{ background: tpl.eventId ? '#341f97' : '#222f3e' }}>
                    {tpl.eventId ? 'Event Specific' : 'Global (Festival)'}
                  </span>
                </td>
                <td>{tpl.subject}</td>
                <td>{new Date(tpl.updatedAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => {
                        handleSelectTemplate(tpl.id);
                        setActiveTab('compose');
                      }}
                      style={{ fontSize: 11, padding: '4px 8px' }}
                    >
                      Use
                    </button>
                    <button
                      onClick={() => {
                        setTemplateForm({
                          name: tpl.name,
                          subject: tpl.subject,
                          bodyHtml: tpl.bodyHtml,
                          bodyText: tpl.bodyText || '',
                          isGlobal: !tpl.eventId,
                        });
                        setTemplateModal({ open: true, template: tpl });
                      }}
                      style={{ fontSize: 11, padding: '4px 8px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      style={{ fontSize: 11, padding: '4px 8px', color: '#ff6b6b' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      {/* ── TAB 4: CAMPAIGN HISTORY & LOGS ── */}
      {activeTab === 'history' && (
        <div>
          <div className="admin-section-heading">
            <h3>Campaign Broadcast History</h3>
            <button onClick={loadHistory}>Refresh History</button>
          </div>

          <LoadState loading={loadingHistory} error="" />

          <Table headings={['Title / Subject', 'Filter Applied', 'Progress', 'Status', 'Date', 'Actions']} empty={campaigns.length === 0}>
            {campaigns.map((camp) => {
              const statusColor =
                camp.status === 'COMPLETED' ? '#2ed573' :
                camp.status === 'SENDING' ? '#ffa502' :
                camp.status === 'CANCELLED' ? '#747d8c' :
                camp.status === 'FAILED' ? '#ff4757' : '#70a1ff';

              return (
                <tr key={camp.id}>
                  <td>
                    <strong>{camp.title}</strong>
                    {Array.isArray(camp.attachments) && camp.attachments.length > 0 && (
                      <span
                        title={camp.attachments.map((a: { filename: string }) => a.filename).join(', ')}
                        style={{
                          marginLeft: 6,
                          fontSize: 10,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: 'rgba(255, 255, 26, 0.15)',
                          color: '#FFFF1A',
                          border: '1px solid rgba(255, 255, 26, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          fontWeight: 700,
                        }}
                      >
                        📎 {camp.attachments.length} file{camp.attachments.length > 1 ? 's' : ''}
                      </span>
                    )}
                    <div style={{ fontSize: 12, color: '#A49FBD' }}>{camp.subject}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12 }}>
                      {camp.filterType} {camp.filterValue ? `(${camp.filterValue})` : ''}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, width: 80, background: '#2e235a', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${camp.totalRecipients > 0 ? (camp.sentCount / camp.totalRecipients) * 100 : 0}%`,
                            background: '#2ed573',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12 }}>
                        {camp.sentCount} / {camp.totalRecipients}
                        {camp.failedCount > 0 && <span style={{ color: '#ff4757', marginLeft: 4 }}>({camp.failedCount} failed)</span>}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge" style={{ borderColor: statusColor, color: statusColor }}>
                      {camp.status}
                    </span>
                  </td>
                  <td>{new Date(camp.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => loadRecipientLogs(camp.id)}
                        style={{ fontSize: 11, padding: '4px 8px' }}
                      >
                        Recipient Logs
                      </button>
                      {['QUEUED', 'SENDING'].includes(camp.status) && (
                        <button
                          onClick={() => handleCancelCampaign(camp.id)}
                          style={{ fontSize: 11, padding: '4px 8px', color: '#ff4757' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>

          {/* Recipient Logs Drawer */}
          {selectedCampaignId && (
            <div className="admin-card" style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4>Per-Recipient Delivery Audit ({recipientLogs.length} Records)</h4>
                <button onClick={() => setSelectedCampaignId(null)} style={{ fontSize: 11 }}>Close Logs</button>
              </div>

              <LoadState loading={loadingLogs} error="" />

              <Table headings={['Recipient', 'Email', 'TFID', 'Status', 'Attempts', 'Sent At / Error']} empty={recipientLogs.length === 0}>
                {recipientLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.name}</td>
                    <td>{log.email}</td>
                    <td><code>{log.tfid || '—'}</code></td>
                    <td>
                      <span
                        className="admin-badge"
                        style={{
                          color: log.status === 'SENT' ? '#2ed573' : log.status === 'FAILED' ? '#ff4757' : '#70a1ff',
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td>{log.attempts}</td>
                    <td style={{ fontSize: 12 }}>
                      {log.status === 'SENT'
                        ? (log.sentAt ? new Date(log.sentAt).toLocaleTimeString() : 'Delivered')
                        : (log.error || 'Pending in queue')}
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}
        </div>
      )}

      {/* ── FINAL CONFIRMATION MODAL ── */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div className="admin-card" style={{ maxWidth: 520, width: '100%', background: '#1c143a', border: '1px solid #FFFF1A', boxShadow: '0 12px 48px rgba(0,0,0,0.8)' }}>
            <h3 style={{ color: '#FFFF1A', margin: '0 0 12px' }}>⚠️ Confirm Campaign Launch</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#e8e6f2' }}>
              You are about to launch a bulk email campaign for <strong>{text(eventData?.name)}</strong>:
            </p>
            <ul style={{ fontSize: 13, color: '#bcb0dd', margin: '12px 0 20px', paddingLeft: 20 }}>
              <li><strong>Target Recipients:</strong> {recipientCount} {isTeam ? 'team leaders' : 'participants'}</li>
              <li><strong>Filter:</strong> {filterType} {filterValue ? `(${filterValue})` : ''}</li>
              <li><strong>Subject:</strong> {subject}</li>
              <li>
                <strong>Attachments:</strong>{' '}
                {attachments.length > 0 ? (
                  <span style={{ color: '#FFFF1A' }}>
                    {attachments.length} file{attachments.length > 1 ? 's' : ''} ({attachments.map((a) => a.filename).join(', ')})
                  </span>
                ) : (
                  <span style={{ color: '#8c86ab' }}>None</span>
                )}
              </li>
              <li><strong>Delivery Rate:</strong> Paced background queue to protect server deliverability.</li>
            </ul>

            {launchError && <p className="admin-error" style={{ marginBottom: 16 }}>{launchError}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button disabled={launching} onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button
                disabled={launching}
                className="primary"
                onClick={handleLaunchCampaign}
                style={{ background: '#E7137D', borderColor: '#E7137D' }}
              >
                {launching ? 'Queuing…' : 'Yes, Launch Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT TEMPLATE MODAL ── */}
      {templateModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div className="admin-card" style={{ maxWidth: 640, width: '100%', background: '#1c143a', border: '1px solid #543e9e' }}>
            <h3>{templateModal.template ? 'Edit Template' : 'Create New Template'}</h3>
            <form onSubmit={handleSaveTemplate}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Template Name *</label>
                <input
                  type="text"
                  required
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#140e2b', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 6 }}
                />
              </div>

              {superAdmin && !templateModal.template && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={templateForm.isGlobal}
                      onChange={(e) => setTemplateForm({ ...templateForm, isGlobal: e.target.checked })}
                    />
                    Make this a Global Template (available across all 23 events)
                  </label>
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Subject *</label>
                <input
                  type="text"
                  required
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#140e2b', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 6 }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Body HTML *</label>
                <textarea
                  rows={8}
                  required
                  value={templateForm.bodyHtml}
                  onChange={(e) => setTemplateForm({ ...templateForm, bodyHtml: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#140e2b', border: '1px solid #3d2f6d', color: '#fff', borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" disabled={savingTemplate} onClick={() => setTemplateModal({ open: false })}>
                  Cancel
                </button>
                <button type="submit" disabled={savingTemplate} className="primary">
                  {savingTemplate ? 'Saving…' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

