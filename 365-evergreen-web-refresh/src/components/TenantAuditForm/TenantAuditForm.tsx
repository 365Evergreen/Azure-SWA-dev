import React, { useState } from 'react';
import styles from './TenantAuditForm.module.css';
import { Button } from '@fluentui/react-components';



export interface TenantAuditFormData {
  firstName: string;
  surname: string;
  email: string;
  organisation: string;
  message: string;
}

export const TenantAuditForm: React.FC = () => {
  const [form, setForm] = useState<TenantAuditFormData>({
    firstName: '',
    surname: '',
    email: '',
    organisation: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      firstName: form.firstName,
      surname: form.surname,
      email: form.email,
      organisation: form.organisation,
      message: form.message,
    };

    try {
      const response = await fetch(
        "https://ee9ffbbcb17ae277b5341496799d04.c5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/ab3332679c374cdcb8563bef31db25a6/triggers/manual/paths/invoke?api-version=1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        console.error("Failed to trigger workflow:", response.statusText);
        return;
      }

      console.log("Workflow triggered successfully!");
    } catch (error) {
      console.error("Error triggering workflow:", error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        First Name
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </label>
      <label className={styles.label}>
        Surname
        <input
          type="text"
          name="surname"
          value={form.surname}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </label>
      <label className={styles.label}>
        Email Address
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </label>
      <label className={styles.label}>
        Organisation
        <input
          type="text"
          name="organisation"
          value={form.organisation}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </label>
      <label className={styles.label}>
        Message
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className={styles.textarea}
          required
        />
      </label>
      <Button type="submit" appearance="primary">Submit</Button>
    </form>
  );
};
