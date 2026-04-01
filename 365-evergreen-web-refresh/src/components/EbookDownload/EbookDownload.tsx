import { type FormEvent, useState } from 'react';
import { Input, Button, Checkbox } from '@fluentui/react-components';
import { ArrowDownload24Regular } from '@fluentui/react-icons';
import styles from './EbookDownload.module.css';

const POWER_AUTOMATE_ENDPOINT =
  'https://ee9ffbbcb17ae277b5341496799d04.c5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/650e3cd6af224681b04ed8bd53403a79/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IAXbOM9JLSbdrzveOgAc31SRxgC46vbe5fJsphhrBQM';

type FieldErrors = Partial<Record<'firstName' | 'lastName' | 'email' | 'company' | 'consent', string>>;

type EbookDownloadProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
};

const defaultTitle = 'Download the 365 Evergreen playbook';
const defaultSubtitle = 'Get actionable guidance on building and sustaining a thriving evergreen workplace.';
const defaultCtaLabel = 'Email me the eBook';

export function EbookDownload({ title = defaultTitle, subtitle = defaultSubtitle, ctaLabel = defaultCtaLabel }: EbookDownloadProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentNewsletter, setConsentNewsletter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const disabled = submitting;

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};
    if (!firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!company.trim()) nextErrors.company = 'Company name is required.';
    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(email.trim())) {
        nextErrors.email = 'Please enter a valid email address.';
      }
    }
    if (!consentTerms) nextErrors.consent = 'You must accept the terms to receive the eBook.';
    return nextErrors;
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setCompany('');
    setConsentTerms(false);
    setConsentNewsletter(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitted(false);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        company: company.trim(),
        consents: {
          termsAccepted: consentTerms,
          newsletterOptIn: consentNewsletter
        },
        source: 'ebook-download'
      };

      // TODO: Adjust payload keys once the Power Automate flow contract is finalised.
      const response = await fetch(POWER_AUTOMATE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Unable to submit your request. Please try again.');
      }

      setSubmitted(true);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.root} aria-live="polite">
      <h2 className={styles.heading}>{title}</h2>
      <p className={styles.subheading}>{subtitle}</p>
      {submitted && (
        <div className={styles.statusSuccess} role="status">
          Thanks for your interest. Check your inbox for the download link within a few minutes.
        </div>
      )}
      {submitError && (
        <div className={styles.statusError} role="alert">
          {submitError}
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.fieldRow} ${styles.fieldRowTwoColumn}`}>
          <div>
            <label className={styles.label} htmlFor="ebook-first-name">
              First name<span className={styles.required} aria-hidden="true">*</span>
            </label>
            <Input
              id="ebook-first-name"
              value={firstName}
              onChange={(_, data) => setFirstName(data.value)}
              required
              disabled={disabled}
              placeholder="Alex"
            />
            {errors.firstName && (
              <div className={styles.fieldError} role="alert">
                {errors.firstName}
              </div>
            )}
          </div>
          <div>
            <label className={styles.label} htmlFor="ebook-last-name">
              Last name<span className={styles.required} aria-hidden="true">*</span>
            </label>
            <Input
              id="ebook-last-name"
              value={lastName}
              onChange={(_, data) => setLastName(data.value)}
              required
              disabled={disabled}
              placeholder="Morgan"
            />
            {errors.lastName && (
              <div className={styles.fieldError} role="alert">
                {errors.lastName}
              </div>
            )}
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div>
            <label className={styles.label} htmlFor="ebook-email">
              Work email<span className={styles.required} aria-hidden="true">*</span>
            </label>
            <Input
              id="ebook-email"
              type="email"
              value={email}
              onChange={(_, data) => setEmail(data.value)}
              required
              disabled={disabled}
              placeholder="alex.morgan@company.com"
            />
            {errors.email && (
              <div className={styles.fieldError} role="alert">
                {errors.email}
              </div>
            )}
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div>
            <label className={styles.label} htmlFor="ebook-company">
              Company<span className={styles.required} aria-hidden="true">*</span>
            </label>
            <Input
              id="ebook-company"
              value={company}
              onChange={(_, data) => setCompany(data.value)}
              required
              disabled={disabled}
              placeholder="Contoso Ltd"
            />
            {errors.company && (
              <div className={styles.fieldError} role="alert">
                {errors.company}
              </div>
            )}
          </div>
        </div>
        <fieldset className={styles.checkboxGroup}>
          <legend className={styles.checkboxLegend}>Communication preferences</legend>
          <Checkbox
            checked={consentTerms}
            onChange={(_, data) => setConsentTerms(Boolean(data.checked))}
            required
            disabled={disabled}
            label="I agree to the generic terms and conditions."
          />
          <Checkbox
            checked={consentNewsletter}
            onChange={(_, data) => setConsentNewsletter(Boolean(data.checked))}
            disabled={disabled}
            label="I would like to receive Evergreen updates and newsletters."
          />
          {errors.consent && (
            <div className={styles.fieldError} role="alert">
              {errors.consent}
            </div>
          )}
        </fieldset>
        <div className={styles.actions}>
          <Button
            className={`${styles.submitButton} appButton`}
            type="submit"
            appearance="primary"
            disabled={disabled}
            icon={<ArrowDownload24Regular />}
          >
            {submitting ? 'Sending…' : ctaLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}
