import carouselStyles from '../Carousel/Carousel.module.css';
import localCarouselItems from '../../../docs/carousel-items.json';
import * as React from "react";
import { useNavigate } from "react-router-dom";

import {
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselSlider,
  CarouselViewport,
  makeStyles,
  tokens,
  typographyStyles,
} from '../../lib/localFluent';
import type { CarouselAnnouncerFunction } from '../../lib/localFluent';

const useClasses = makeStyles({
  bannerCard: {
    alignContent: "center",
    height: "450px",
    textAlign: "left",
    position: "relative",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "absolute",
    left: "7vw",
    top: "18%",
    background: tokens.colorNeutralBackground1,
    padding: "38px 44px 38px 44px",
    maxWidth: "440px",
    width: "48%",
    minHeight: "260px",
    boxShadow: tokens.shadow28,
    borderRadius: tokens.borderRadiusLarge,
  },
  title: {
    ...typographyStyles.title1,
  },
  subtext: {
    ...typographyStyles.body1,
  },
});

// Remote blob URL for carousel items (primary source)
const CAROUSEL_BLOB_URL = 'https://365evergreendev.blob.core.windows.net/365evergreen/carousel-items.json';

type RawCarouselItem = {
  Title: string;
  Blurb?: string | null;
  image?: string | null;
  CTA?: string | null;
  btnText?: string | null;
  display?: boolean | null;
};

type Slide = {
  title: string;
  blurb?: string;
  image: string;
  cta?: string;
  btnText?: string;
};

function isRawCarouselItem(value: unknown): value is RawCarouselItem {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<RawCarouselItem>;
  return typeof candidate.Title === 'string';
}

function normalizeRawItems(items: unknown): Slide[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter(isRawCarouselItem)
    .filter(item => item.display === true)
    .map(item => ({
      title: item.Title,
      blurb: item.Blurb ?? undefined,
      image: (item.image || '').replace(/^[\s"]+|[\s",]+$/g, ''),
      cta: item.CTA ?? undefined,
      btnText: item.btnText ?? undefined,
    }));
}

// Initialize with local JSON as a fallback and attempt to fetch remote blob on mount
const initialSlides = normalizeRawItems(localCarouselItems);

const useSlides = () => {
  const [slides, setSlides] = React.useState<Slide[]>(initialSlides);

  React.useEffect(() => {
    let cancelled = false;
    fetch(CAROUSEL_BLOB_URL)
      .then(res => res.json())
      .then(data => {
        let items: unknown = [];
        if (Array.isArray(data)) items = data;
        else if (data && typeof data === 'object' && Array.isArray((data as { body?: unknown }).body)) {
          items = (data as { body: unknown[] }).body;
        } else if (isRawCarouselItem(data)) {
          items = [data];
        }
        const normalized = normalizeRawItems(items);
        if (!cancelled && normalized.length > 0) {
          setSlides(normalized);
        }
      })
      .catch(() => {
        // Keep fallback local slides on error; do not throw UI errors here
      });
    return () => { cancelled = true; };
  }, []);

  return slides;
};



interface BannerCardProps {
  image: string;
  title: string;
  blurb?: string;
  cta?: string;
}

const BannerCard: React.FC<BannerCardProps & { slug?: string }> = ({ image, title, blurb, cta, slug }) => {
  const classes = useClasses();
  const navigate = useNavigate();
  return (
    <CarouselCard className={classes.bannerCard}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: tokens.borderRadiusMedium,
        zIndex: 0,
      }} aria-hidden="true" />
      <div className={classes.cardContainer}>
        <div className={classes.title}>{title}</div>
        {blurb && <div className={classes.subtext}>{blurb}</div>}
        {cta && slug && (
          <a
            href={`/CTA/${slug}`}
            className="features-link"
            style={{ textDecoration: 'none', marginTop: '1em', display: 'inline-block' }}
            tabIndex={0}
            onClick={e => {
              e.preventDefault();
              navigate(`/CTA/${slug}`);
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', fontSize: '1rem' }}>
              {cta}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '0.1em' }}>
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        )}
      </div>
    </CarouselCard>
  );
};

const getAnnouncement: CarouselAnnouncerFunction = (
  index: number,
  totalSlides: number
) => {
  return `Elevated carousel slide ${index + 1} of ${totalSlides}`;
};
const FluentCarousel: React.FC = () => {
  const slides = useSlides();

  return (
    <section className={`${carouselStyles.carouselRoot} home-section`}>
      <h2 className={`fluent-title2 home-section-heading ${carouselStyles.carouselHeading}`}>
        Evergreen transformations in action
      </h2>
      <Carousel
        className={carouselStyles.carouselContainer}
        style={{ padding: 0, margin: 0 }}
        appearance="elevated"
        groupSize={1}
        circular
        announcement={getAnnouncement}
      >
        <CarouselViewport>
          <CarouselSlider>
            {slides.map((slide, idx) => {
              // Extract slug from CTA field
              const slug = slide.cta ? slide.cta.replace(/^\//, '') : undefined;
              return (
                <BannerCard
                  key={`slide-${idx}`}
                  image={slide.image}
                  title={slide.title}
                  blurb={slide.blurb}
                  cta={slide.btnText}
                  slug={slug}
                />
              );
            })}
          </CarouselSlider>
        </CarouselViewport>
        <CarouselNavContainer
          layout="inline"
          autoplayTooltip={{ content: "Autoplay", relationship: "label" }}
          nextTooltip={{ content: "Go to next", relationship: "label" }}
          prevTooltip={{ content: "Go to prev", relationship: "label" }}
        >
          <CarouselNav>
            {(index: number) => {
              return <CarouselNavButton aria-label={`Carousel Nav Button ${index}`} />;
            }}
          </CarouselNav>
        </CarouselNavContainer>
      </Carousel>
    </section>
  );
};

export default FluentCarousel;
