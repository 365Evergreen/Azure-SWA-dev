import { useState, lazy, Suspense, useEffect, type ComponentProps, type ComponentType } from 'react';
import { Header } from './components/Header/Header';
import { BreadcrumbProvider } from './components/BreadcrumbContext';
import { Hero } from './components/Hero/Hero';
// import { CTA } from './components/CTA';
import { Features } from './components/Features/Features';
import LatestPosts from './components/LatestPosts/LatestPosts';
import { ContactForm } from './components/ContactForm/ContactForm';
import Pillars from './components/Pillars/Pillars';
import { Footer } from './components/Footer/Footer';
import { CookieConsent } from './components/CookieConsent/CookieConsent';
import { getConsent, subscribe } from './lib/cookieConsent';
import { initAnalytics, teardownAnalytics } from './lib/analytics';
import { CopilotChat } from './components/CopilotChat/CopilotChat';
import { ChatBubble } from './components/ChatBubble/ChatBubble';
import { FloatingDrawer } from './components/FloatingDrawer/FloatingDrawer';
import { JourneySurvey } from './components/JourneySurvey/JourneySurvey';
import questionsData from '../CTAJourneyQuestions.json';
// import Carousel from './components/Carousel';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeVariants } from './components/motionPresets';
import { Routes, Route } from 'react-router-dom';
import './HomeSectionLayout.css';
import RouteLoader from './components/RouteLoader/RouteLoader';
import HowWeDoItStatic from './components/HowWeDoIt/HowWeDoItStatic';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

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
    return () => unsub();
  }, []);
  return (
    <>
      <Header /><main>
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
                    <Pillars />
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
                        <Features />
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
                      <LatestPosts />
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
                      <ContactForm />
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
          <CopilotChat open={chatOpen} onClose={() => setChatOpen(false)} />

        </BreadcrumbProvider> </main>
      <CookieConsent />
      {/* Initialize analytics based on saved consent */}
      <script>
        {`/* consent-init placeholder - handled in React lifecycle */`}
      </script>
      <Footer />
      {!chatOpen && <ChatBubble onClick={() => setChatOpen(true)} />}
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
    </>
  );
}

export default App;
