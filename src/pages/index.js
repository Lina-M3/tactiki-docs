import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="Tactiki Development Documentation"
      description="Living technical documentation for the Tactiki CPIT499 graduation project">
      <main>
        <section className={styles.hero}>
          <div className="container">
            <span className={styles.badge}>CPIT499 · Graduation Project</span>
            <Heading as="h1" className={styles.title}>
              Tactiki
            </Heading>
            <p className={styles.subtitle}>
              A living development hub for understanding, documenting, testing,
              and defending every step of the Tactiki backend implementation.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/intro">
                Open Documentation
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/progress-log">
                View Progress
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.gridSection}>
          <div className="container">
            <div className={styles.grid}>
              <article className={styles.card}>
                <span>01</span>
                <h2>Understand</h2>
                <p>What we built, why we chose it, and how each backend piece works.</p>
              </article>
              <article className={styles.card}>
                <span>02</span>
                <h2>Test</h2>
                <p>Swagger checks, expected responses, real errors, and verified fixes.</p>
              </article>
              <article className={styles.card}>
                <span>03</span>
                <h2>Defend</h2>
                <p>Study notes designed to help explain the implementation during discussion.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
