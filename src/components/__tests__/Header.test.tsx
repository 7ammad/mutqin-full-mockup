import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { LanguageProvider } from '@/context/LanguageContext';

// All mocks are in vitest.setup.ts

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  );
};

describe('Header Navigation', () => {
  beforeEach(() => {
    // Reset DOM between tests
    document.body.innerHTML = '';
  });

  it('renders all required navigation links', () => {
    renderWithProviders(<Header />);

    // Check by href instead of text (works for both languages)
    expect(screen.getByRole('link', { name: /الأنشطة|Activities/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ما هو متقن|What is Mutqin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /كيف يعمل|How It Works/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /من نخدم|Who We Serve/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /لماذا يهم|Why It Matters/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /انضم|Join/i })).toBeInTheDocument();
  });

  it('navigation links have correct hrefs', () => {
    renderWithProviders(<Header />);

    // Check by href (language-agnostic)
    const activitiesLink = screen.getByRole('link', { name: /الأنشطة|Activities/i });
    expect(activitiesLink).toHaveAttribute('href', '#activities-preview');

    const whatIsLink = screen.getByRole('link', { name: /ما هو متقن|What is Mutqin/i });
    expect(whatIsLink).toHaveAttribute('href', '#what-is-mutqin');

    const howItWorksLink = screen.getByRole('link', { name: /كيف يعمل|How It Works/i });
    expect(howItWorksLink).toHaveAttribute('href', '#how-it-works');

    const whoWeServeLink = screen.getByRole('link', { name: /من نخدم|Who We Serve/i });
    expect(whoWeServeLink).toHaveAttribute('href', '#who-we-serve');

    const whyItMattersLink = screen.getByRole('link', { name: /لماذا يهم|Why It Matters/i });
    expect(whyItMattersLink).toHaveAttribute('href', '#why-it-matters');

    const joinLink = screen.getByRole('link', { name: /انضم|Join/i });
    expect(joinLink).toHaveAttribute('href', '#demo');
  });

  it('does not contain old section IDs in navigation', () => {
    renderWithProviders(<Header />);

    const allLinks = screen.getAllByRole('link');
    
    // Should not have "Demo" as label, should have "Join"
    const demoLink = allLinks.find(link => 
      link.getAttribute('href') === '#demo' && 
      link.textContent?.toLowerCase().trim() === 'demo'
    );
    expect(demoLink).toBeUndefined();
  });
});

