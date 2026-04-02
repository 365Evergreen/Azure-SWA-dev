import { useState, lazy, Suspense, useEffect, type ComponentProps, type ComponentType } from 'react';
const Header = lazy(() => import('./components/Header/Header').then(m => ({ default: m.Header })));
import { BreadcrumbProvider } from './components/BreadcrumbContext';
import { Hero } from './components/Hero/Hero';
// Defer heavy/secondary components until needed
const Features = lazy(() => import('./components/Features/Features').then(m => ({ default: m.Features })));
const LatestPosts = lazy(() => import('./components/LatestPosts/LatestPosts').then(m => ({ default: (m as any).default || m })) as Promise<{ default: ComponentType<any> }>);
const ContactForm = lazy(() => import('./components/ContactForm/ContactForm').then(m => ({ default: m.ContactForm })));
const Pillars = lazy(() => import('./components/Pillars/Pillars').then(m => ({ default: (m as any).default || m })) as Promise<{ default: ComponentType<any> }>);
const Footer = lazy(() => import('./components/Footer/Footer').then(m => ({ default: (m as any).Footer || (m as any).default })) as Promise<{ default: ComponentType<any> }>);
const CookieConsent = lazy(() => import('./components/CookieConsent/CookieConsent').then(m => ({ default: (m as any).CookieConsent || (m as any).default })) as Promise<{ default: ComponentType<any> }>);
const CopilotChat = lazy(() => import('./components/CopilotChat/CopilotChat').then(m => ({ default: (m as any).CopilotChat || (m as any).default })) as Promise<{ default: ComponentType<any> }>);
const ChatBubble = lazy(() => import('./components/ChatBubble/ChatBubble').then(m => ({ default: (m as any).ChatBubble || (m as any).default })) as Promise<{ default: ComponentType<any> }>);
const FloatingDrawer = lazy(() => import('./components/FloatingDrawer/FloatingDrawer').then(m => ({ default: (m as any).FloatingDrawer || (m as any).default })) as Promise<{ default: ComponentType<any> }>);
const JourneySurvey = lazy(() => import('./components/JourneySurvey/JourneySurvey').then(m => ({ default: (m as any).JourneySurvey || (m as any).default })) as Promise<{ default: ComponentType<any> }>);
import { getConsent, subscribe } from './lib/cookieConsent';
import { initAnalytics, teardownAnalytics } from './lib/analytics';
import questionsData from '../docs/CTAJourneyQuestions.json';
// import Carousel from './components/Carousel';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeVariants } from './components/motionPresets';
import { Routes, Route } from 'react-router-dom';
import './HomeSectionLayout.css';
import RouteLoader from './components/RouteLoader/RouteLoader';
const HowWeDoItStatic = lazy(() => import('./components/HowWeDoIt/HowWeDoItStatic').then(m => ({ default: (m as any).default || m })) as Promise<{ default: ComponentType<any> }>);
const ScrollToTop = lazy(() => import('./components/ScrollToTop/ScrollToTop').then(m => ({ default: (m as any).default || m })) as Promise<{ default: ComponentType<any> }>);

const CtaPage = lazy(() => import('./components/CtaPage/CtaPage'));
const FeatureView = lazy(() => import('./components/FeatureView/FeatureView'));
const AllAccordions = lazy(() => import('./components/AllAccordions/AllAccordions'));
const AllFeatures = lazy(() => import('./components/AllFeatures/AllFeatures'));
const LatestPostsArchive = lazy(() => import('./components/LatestPostsArchive/LatestPostsArchive'));

const WhatWeDoStatic = lazy(() => import('./components/WhatWeDoStatic/WhatWeDoStatic'));
const ResourceArchive = lazy(() => import('./components/ResourceArchive/ResourceArchive'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy/PrivacyPolicy'));
const TestCtaQuery = lazy(() => import('./components/TestCtaQuery/TestCtaQuery'));
const VanillaAccordionDemoPage = lazy(() => import('./components/VanillaAccordionDemoPage/VanillaAccordionDemoPage'));
const FeatureButtonsTest = lazy(() => import('./components/FeatureButtonsTest/FeatureButtonsTest'));
const FeatureButtonsLogic = lazy(() => import('./components/FeatureButtonsLogic/FeatureButtonsLogic'));
const PageView = lazy(() => import('./components/PageView/PageView').then(module => ({ default: module.PageView })));
const TestPageQuery = lazy(() => import('./components/TestPageQuery/TestPageQuery'));
const SinglePost = lazy(() => import('./components/SinglePost/SinglePost'));

// Wrapper to allow passing optional props to PageView without changing its
// original typings. We cast props through any when forwarding.



type PageViewProps = ComponentProps<typeof PageView>;

type PageViewOptionalProps = Partial<PageViewProps> & { whatWeDoPageId?: string };

const PageViewOptional: ComponentType<PageViewOptionalProps> = (props) => (
  <PageView {...(props as PageViewProps)} />
);

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Initialize analytics when consent is present and enabled
  useEffect(() => {
    const current = getConsent();
    if (current && current.prefs.analytics) {
      initAnalytics();
    }
    const unsub = subscribe(rec => {
      if (rec && rec.prefs.analytics) initAnalytics();
      else teardownAnalytics();
    });
    // Defer heavy data prefetch until first user interaction to reduce cold load.
    const onFirstInteraction = () => {
      // dynamically import prefetch helpers so they don't run on initial load
      void import('./lib/usePillars').then(m => m.prefetchPillars?.(4)).catch(() => {});
      void import('./lib/useLatestPosts').then(m => m.prefetchLatestPosts?.(6)).catch(() => {});
      // Warm some lazy component modules
      void import('./components/LatestPosts/LatestPosts').catch(() => {});
      void import('./components/Pillars/Pillars').catch(() => {});
      void import('./components/Features/Features').catch(() => {});
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
    window.addEventListener('pointerdown', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });
    return () => unsub();
  }, []);
  return (
    <>
      <Suspense fallback={<RouteLoader />}>
        <Header />
      </Suspense>
      <main>
        <BreadcrumbProvider>

          <Suspense fallback={<RouteLoader />}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={
                <AnimatePresence mode="wait">
                  <motion.div
                    key="hero"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Hero onOpenDrawer={() => setDrawerOpen(true)} />
                  </motion.div>
                  <motion.div
                    key="pillars"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Suspense fallback={<div />}> 
                      <Pillars />
                    </Suspense>
                  </motion.div>
                  <div key="bg-default-1" className="bg-default">
                    <motion.div
                      key="features"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="features-outer">
                        <Suspense fallback={<div />}>
                          <Features />
                        </Suspense>
                      </div>
                    </motion.div>
                  </div>
                  <div key="bg-alt" className="bg-alt">
                      <motion.div
                      key="latestposts"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Suspense fallback={<div />}>
                        <LatestPosts />
                      </Suspense>
                    </motion.div>
                  </div>
                  <div key="bg-default-2" className="bg-default">
                      <motion.div
                      key="contactform"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Suspense fallback={<div />}>
                        <ContactForm />
                      </Suspense>
                    </motion.div>
                  </div>
                </AnimatePresence>
              } />
              <Route path="/CTA/:slug" element={<CtaPage />} />
              <Route path="/feature/:slug" element={<FeatureView />} />
              <Route path="/all-accordions" element={<AllAccordions />} />
              <Route path="/all-features" element={<AllFeatures />} />
              <Route path="/test/cta-query" element={<TestCtaQuery />} />
              <Route path="/test/page-query" element={<TestPageQuery />} />
              <Route path="/latest-posts" element={<LatestPostsArchive />} />
              <Route path="/category/:category" element={<LatestPostsArchive />} />
              <Route path="/post/:slug" element={<SinglePost />} />
              <Route path="/latest-posts/:category/:slug" element={<SinglePost />} />
              <Route path="/category/:category/:slug" element={<PageView />} />
              <Route path="/what-we-do" element={<PageViewOptional whatWeDoPageId="cG9zdDo0OTM=" />} />

              <Route path="/e365-page/what-we-do/" element={<WhatWeDoStatic />} />
              <Route path="/e365-page/how-we-do-it" element={<HowWeDoItStatic />} />
              <Route path="/e365-page/resources/" element={<ResourceArchive />} />
              <Route path="/e365-page/privacy-policy/" element={<PrivacyPolicy />} />
              <Route path="/:slug" element={<PageView />} />
              <Route path="/:parent/:slug" element={<PageView />} />
              <Route path="/vanilla-accordion-demo" element={<VanillaAccordionDemoPage />} />
              <Route path="/feature-buttons-test" element={<FeatureButtonsTest />} />
              {/* Simulate homepage selection: pass featureId for Modern workplace */}
              <Route path="/feature-buttons-logic" element={<FeatureButtonsLogic featureId="cG9zdDozMzg=" />} />
            </Routes>
          </Suspense>
          <Suspense fallback={<div />}>
            <CopilotChat open={chatOpen} onClose={() => setChatOpen(false)} />
          </Suspense>

        </BreadcrumbProvider> </main>
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
      {/* Initialize analytics based on saved consent */}
      <script>
        {`/* consent-init placeholder - handled in React lifecycle */`}
      </script>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      {!chatOpen && (
        <Suspense fallback={null}>
          <ChatBubble onClick={() => setChatOpen(true)} />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <FloatingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <JourneySurvey
          questions={questionsData.map((q, i) => {
            const type = q.type === 'text-area' ? 'text' : q.type;
            let options: string[] | undefined = undefined;
            if (type === 'radio' && i === 0) options = ['Collaborative', 'Innovative', 'Supportive', 'Results-driven'];
            if (type === 'checkbox' && i === 1) options = ['Email', 'Chat', 'Video Calls', 'In-person'];
            if (type === 'radio' && i === 2) options = ['Lack of clarity', 'Poor tools', 'Low engagement', 'Siloed work'];
            return {
              id: `q${i + 1}`,
              type: type as 'radio' | 'checkbox' | 'text',
              question: q.title,
              ...(options ? { options } : {})
            };
          })}
          onComplete={() => { }}
        />
      </FloatingDrawer>
      </Suspense>
    </>
  );
}

export default App;
