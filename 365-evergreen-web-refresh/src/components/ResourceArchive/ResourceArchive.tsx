import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import heroConfig from '../../../page-components.json';
import { useE365Resources } from './useE365Resources';
import type { ResourceItem } from './useE365Resources';
import styles from './ResourceArchive.module.css';

type HeroEntry = {
  page?: string | null;
  title?: string | null;
  blurb?: string | null;
  backgroundImage?: string | null;
  backgroundColour?: string | null;
};

type ResourceCategory = {
  value: string;
  label: string;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

function normalise(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, '');
}

function truncate(value: string, length: number): string {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length).trimEnd()}…`;
}

const ResourceArchive: React.FC = () => {
  const heroEntries = Array.isArray((heroConfig as { body?: HeroEntry[] }).body)
    ? (heroConfig as { body: HeroEntry[] }).body
    : [];
  const hero = heroEntries.find(entry => entry?.page === 'resources');

  const { resources, loading, error } = useE365Resources();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition>({ top: 0, left: 0, width: 220 });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dropdownOpen) {
      return undefined;
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return;
      }
      if (dropdownTriggerRef.current && dropdownTriggerRef.current.contains(target)) {
        return;
      }
      setDropdownOpen(false);
    }

    if (dropdownTriggerRef.current) {
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const categoryOptions = useMemo<ResourceCategory[]>(() => {
    const unique = new Map<string, string>();
    resources.forEach((resource: ResourceItem) => {
      const typeKey = normalise(resource.resourceType);
      const labelKey = normalise(resource.label);
      if (typeKey) {
        unique.set(typeKey, resource.resourceType ?? resource.label ?? 'Resource');
      } else if (labelKey) {
        unique.set(labelKey, resource.label ?? 'Resource');
      }
    });
    return Array.from(unique.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [resources]);

  const filteredResources = useMemo(() => {
    const searchTerm = normalise(search);
    return resources.filter((resource: ResourceItem) => {
      const categoryKeys = [resource.resourceType, resource.label]
        .map(normalise)
        .filter(Boolean);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(category => categoryKeys.includes(category));
      if (!matchesCategory) {
        return false;
      }
      if (!searchTerm) {
        return true;
      }
      const text = `${resource.title} ${stripHtml(resource.excerpt)}`.toLowerCase();
      return text.includes(searchTerm);
    });
  }, [resources, search, selectedCategories]);

  if (!hero) {
    return null;
  }

  const heroStyle: CSSProperties = {
    background: hero.backgroundImage
      ? `url(${hero.backgroundImage}) center/cover no-repeat, ${hero.backgroundColour || '#222'}`
      : hero.backgroundColour || '#222'
  };

  const limitedResources = filteredResources.slice(0, 15);

  return (
    <>
      <section className={styles.resourceHeroRoot} style={heroStyle}>
        <div className={styles.resourceHeroGradient} aria-hidden="true" />
        <div className={styles.resourceHeroContent}>
          <h1 className={styles.resourceHeroTitle}>{hero.title ?? 'Evergreen resources'}</h1>
          {hero.blurb && <p className={styles.resourceHeroDesc}>{hero.blurb}</p>}
          <div className={styles.filtersRow}>
            <div className={styles.filterGroup}>
              <input
                type="text"
                className={styles.searchBox}
                placeholder="Search resources..."
                value={search}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
              />
            </div>
            <div className={`${styles.filterGroup} ${styles.categoryGroup}`}>
              <div
                ref={dropdownTriggerRef}
                className={styles.categorySelect}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(value => !value)}
              >
                <span className={styles.categorySelectLabel}>
                  {selectedCategories.length === 0
                    ? 'All resource types'
                    : `${selectedCategories.length} selected`}
                </span>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={styles.archiveViewToggleIcon} aria-hidden="true">
                  <path d="M6 8L10 12L14 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {dropdownOpen && typeof window !== 'undefined' && ReactDOM.createPortal(
                <div
                  ref={dropdownRef}
                  className={styles.categoryDropdown}
                  style={{
                    position: 'absolute',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    minWidth: dropdownPos.width
                  }}
                  role="listbox"
                >
                  {categoryOptions.length === 0 && <span style={{ padding: '0.5em 1em' }}>No resource types available</span>}
                  {categoryOptions.map(option => {
                    const selected = selectedCategories.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className={`${styles.categoryOption}${selected ? ` ${styles.categoryOptionSelected}` : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const { checked } = event.target;
                            setSelectedCategories(prev => (
                              checked
                                ? [...prev, option.value]
                                : prev.filter(value => value !== option.value)
                            ));
                          }}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>,
                document.body
              )}
            </div>
            <div className={styles.filterGroup}>
              <button
                type="button"
                className={styles.clearFilters}
                onClick={() => {
                  setSearch('');
                  setSelectedCategories([]);
                }}
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedCategories.length > 0 && (
        <div className={styles.tagsRow}>
          {selectedCategories.map(categoryValue => {
            const label = categoryOptions.find(option => option.value === categoryValue)?.label ?? categoryValue;
            return (
              <span key={categoryValue} className={styles.tag}>
                {label}
                <button
                  type="button"
                  className={styles.tagRemove}
                  aria-label={`Remove ${label}`}
                  onClick={() => setSelectedCategories(prev => prev.filter(value => value !== categoryValue))}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className={styles.archiveOptions}>
        <div className={styles.archiveOptionsTags} />
        <div className={`${styles.archiveOptionsToggle} ${styles.desktopOnly}`}>
          <button
            type="button"
            className={styles.archiveViewToggle}
            onClick={() => setViewMode(previous => (previous === 'grid' ? 'list' : 'grid'))}
            aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          >
            <img
              src={viewMode === 'grid'
                ? 'https://365evergreen.com/wp-content/uploads/2026/01/ic_fluent_apps_list_24_regular-1.png'
                : 'https://365evergreen.com/wp-content/uploads/2026/01/ic_fluent_grid_24_regular-1.png'}
              alt={viewMode === 'grid' ? 'List view icon' : 'Grid view icon'}
              width={22}
              height={22}
              className={styles.archiveViewToggleIcon}
            />
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.statusMessage} role="status">
          <div className={styles.statusBar}>
            <span className={styles.loadingSpinner} aria-hidden="true" />
            <span>Loading resources…</span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className={styles.statusMessage} role="alert">
          {error}
        </div>
      )}

      {!loading && !error && limitedResources.length === 0 && (
        <div className={styles.emptyState} role="status">
          No resources matched your filters. Try adjusting your search or resource types.
        </div>
      )}

      {!loading && !error && limitedResources.length > 0 && (
        <div className={viewMode === 'grid' ? styles.resourceGrid : styles.resourceList}>
          {limitedResources.map((resource: ResourceItem) => {
            const plainExcerpt = stripHtml(resource.excerpt);
            const excerptPreview = truncate(plainExcerpt, viewMode === 'grid' ? 175 : 220);
            const badgeLabel = resource.resourceType ?? resource.label ?? 'Resource';

            if (viewMode === 'list') {
              return (
                <article key={resource.id} className={`${styles.resourceListCard} ${styles.resourceCardSelectable}`}>
                  <div className={styles.resourceListMeta}>
                    <span>{badgeLabel}</span>
                    {resource.relatedPostIds.length > 0 && <span>{resource.relatedPostIds.length} related post(s)</span>}
                  </div>
                  <h2 className={styles.resourceTitle}>{resource.title}</h2>
                  <p className={styles.resourceExcerpt}>{excerptPreview}</p>
                </article>
              );
            }

            return (
              <article key={resource.id} className={`${styles.resourceCard} ${styles.resourceCardSelectable}`}>
                {resource.featuredImageUrl && (
                  <Link to={`/e365-page/${resource.slug ?? resource.id}`} aria-label={resource.title}>
                    <img
                      src={resource.featuredImageUrl}
                      alt={resource.title}
                      className={styles.resourceImage}
                      loading="lazy"
                    />
                  </Link>
                )}
                <span className={styles.resourceBadge}>{badgeLabel}</span>
                <Link to={`/e365-page/${resource.slug ?? resource.id}`} className={styles.resourceLink} aria-label={resource.title}>
                  <span className={styles.resourceTitle}>{resource.title}</span>
                </Link>
                <p className={styles.resourceExcerpt}>{excerptPreview}</p>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ResourceArchive;
