import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import { Modal } from '../Modal/Modal';
import { JourneySurvey } from '../JourneySurvey/JourneySurvey';
import questionsData from '../../../docs/CTAJourneyQuestions.json';
import styles from './Hero.module.css';

type SourceQuestion = {
  title: string;
  type: string;
};

export function Hero({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <section className={styles.heroRoot}>
      <div className={styles.heroGradient} />
      <div className={styles.heroContent}>
        <h1 className={`${styles.heroTitle} fluent-display`}>Microsoft 365 and Power Platform specialists</h1>
        <p className={styles.heroDesc}>
         We help businesses create collaborative and secure workspaces to increase productivity, streamline processes, and drive sustainable innovation. — without the tech headaches.
        </p>
        <div className={styles.heroActions}>
          <Button
            appearance="primary"
            className={`${styles.heroBtn} ${styles.hiddenPrimaryCta}`}
            onClick={() => setModalOpen(true)}
          >
            Let's see how we can help
          </Button>
          <Button
            appearance="secondary"
            className={styles.heroBtn}
            onClick={onOpenDrawer}
          >
            Start your journey
          </Button>
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <JourneySurvey
          questions={(questionsData as SourceQuestion[]).map((q, i) => {
            const type = q.type === 'text-area' ? 'text' : q.type;
            let options: string[] | undefined = undefined;
            if (type === 'radio' && i === 0) options = ['Collaborative', 'Innovative', 'Supportive', 'Results-driven'];
            if (type === 'checkbox' && i === 1) options = ['Email', 'Chat', 'Video Calls', 'In-person'];
            if (type === 'radio' && i === 2) options = ['Lack of clarity', 'Poor tools', 'Low engagement', 'Siloed work'];
            return {
              id: `q${i+1}`,
              type: type as 'radio' | 'checkbox' | 'text',
              question: q.title,
              ...(options ? { options } : {})
            };
          })}
          onComplete={() => {}}
        />
      </Modal>
    </section>
  );
}


