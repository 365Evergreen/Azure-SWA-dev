import React, { useState } from 'react';
import styles from '../FloatingDrawer/FloatingDrawer.module.css';
import surveyStyles from './JourneySurvey.module.css';
import { Radio, RadioGroup, Checkbox } from '../../lib/localFluent';
import { ArrowLeft24Regular } from '../Icons';
import choicesData from '../../../docs/CTAJourneyChoices.json';

type ChoiceRecord = {
  Question?: string;
  Choice?: string | null;
};

// Inline styles moved to JourneySurvey.module.css (surveyStyles)

interface Question {
  id: string;
  type: 'radio' | 'checkbox' | 'text';
  question: string;
  options?: string[];
}

interface JourneySurveyProps {
  questions: Question[];
  onComplete: (answers: Record<string, any>) => void;
}

export const JourneySurvey: React.FC<JourneySurveyProps> = ({ questions, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const current = questions[step];
  const isFirst = step === 0;
  const isLast = step === questions.length - 1;

  const handleChange = (value: any) => {
    setAnswers(a => ({ ...a, [current.id]: value }));
  };

  const handleNext = async () => {
    if (!isLast) {
      setStep(s => s + 1);
    } else {
      setSubmitting(true);
      try {
        await fetch('https://ee9ffbbcb17ae277b5341496799d04.c5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/c7552ccbe28e465db77ea1332e034e14/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=npLT9YLSsYCKi-DpiHletPFmCnQOVGJ81nkFtICg2eo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(answers)
        });
      } catch (e) {
        // Optionally handle error
      }
      setTimeout(() => {
        setSubmitting(false);
        setShowResult(true);
        onComplete(answers);
      }, 500);
    }
  };

  const handleBack = () => setStep(s => (s > 0 ? s - 1 : 0));

  if (submitting) return <div className={surveyStyles.submitting}><div className="spinner" />Crafting your Evergreen pathway…</div>;
  if (showResult) return (
    <div className={surveyStyles.submitting}>
      <h2 className={styles.drawerTitle}>Your Evergreen Pathway</h2>
      <p className={styles.drawerSubtitle}>Based on what you shared, here's where you'll see the biggest impact.</p>
      <div className={surveyStyles.resultCard}>Recommendation placeholder</div>
    </div>
  );

  // Get real options for this question from choicesData
  const realOptions = (choicesData as ChoiceRecord[])
    .filter(c => c.Question === current.question && c.Choice != null)
    .map(c => String(c.Choice));

  return (
    <div>
      <div className={styles.drawerTitle + ' ' + surveyStyles.zeroMarginTop}>Let's shape the team you want to lead</div>
      <div className={styles.drawerSubtitle}>A few quick questions to understand your culture and collaboration goals.</div>
      <div className={surveyStyles.spacerSmall} />
      <div className={surveyStyles.questionBlock}>
        <div className={surveyStyles.questionText}>{current.question}</div>
        {current.type === 'radio' && realOptions.length > 0 && (
          <RadioGroup
            value={answers[current.id] ?? ''}
            onChange={(_, data) => handleChange(data.value)}
            className={styles.surveyOptionsGroup}
          >
            {realOptions.map(opt => (
              <div key={opt} className={styles.surveyOption + (answers[current.id] === opt ? ' ' + styles.surveyOptionSelected : '') + ' ' + styles.surveyOptionFullWidth}>
                <Radio value={opt} className={answers[current.id] === opt ? surveyStyles.radioChecked : ''} />
                <span className={surveyStyles.optionText}>{opt}</span>
              </div>
            ))}
          </RadioGroup>
        )}
        {current.type === 'checkbox' && realOptions.length > 0 && (
          <div className={styles.surveyOptionsGroup}>
            {realOptions.map(opt => (
              <div key={opt} className={styles.surveyOption + (Array.isArray(answers[current.id]) && answers[current.id].includes(opt) ? ' ' + styles.surveyOptionSelected : '') + ' ' + styles.surveyOptionFullWidth}>
                <Checkbox
                  checked={Array.isArray(answers[current.id]) && answers[current.id].includes(opt)}
                  onChange={(_, data) => {
                    const arr = Array.isArray(answers[current.id]) ? answers[current.id] : [];
                    handleChange(
                      data.checked
                        ? [...arr, opt]
                        : arr.filter((v: string) => v !== opt)
                    );
                  }}
                />
                <span className={surveyStyles.optionText}>{opt}</span>
              </div>
            ))}
          </div>
        )}
        {current.type === 'text' && (
          <div className={styles.surveyTextAreaWrapper}>
            <textarea 
              className={styles.surveyTextArea}
              value={answers[current.id] || ''}
              onChange={e => handleChange(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className={surveyStyles.largeSpacer} />
      <div className={styles.surveyActions + (!isFirst ? ' ' + styles.surveyActionsRow : '')}>
        {!isFirst && (
          <button
            type="button"
            className={styles.surveyBackBtn}
            onClick={handleBack}
          >
            <span className={surveyStyles.iconSpacing}><ArrowLeft24Regular /></span>
            <span className={surveyStyles.middleAlign}>Back</span>
          </button>
        )}
        <button
          type="button"
          className={
            styles.surveyNextBtn +
            ' ' + styles.surveyOptionFullWidth +
            (!isFirst ? ' ' + styles.surveyNextBtnRow : '')
          }
          onClick={handleNext}
          disabled={
            (current.type === 'radio' && !answers[current.id]) ||
            (current.type === 'checkbox' && (!answers[current.id] || answers[current.id].length === 0)) ||
            (current.type === 'text' && !answers[current.id])
          }
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};
