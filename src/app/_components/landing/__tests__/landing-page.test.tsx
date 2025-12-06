import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';
import { LanguageProvider } from '@/context/LanguageContext';

// All mocks are in vitest.setup.ts

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  );
};

describe('Landing Page Structure', () => {
  it('renders all required sections in correct order', () => {
    renderWithProviders(<LandingPage />);

    // Check section IDs exist
    expect(document.getElementById('activities-preview')).toBeInTheDocument();
    expect(document.getElementById('what-is-mutqin')).toBeInTheDocument();
    expect(document.getElementById('how-it-works')).toBeInTheDocument();
    expect(document.getElementById('who-we-serve')).toBeInTheDocument();
    expect(document.getElementById('why-it-matters')).toBeInTheDocument();
    expect(document.getElementById('demo')).toBeInTheDocument();
  });

  it('renders activities preview section with correct ID', () => {
    renderWithProviders(<LandingPage />);
    
    const section = document.getElementById('activities-preview');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders what-is-mutqin section with correct ID', () => {
    renderWithProviders(<LandingPage />);
    
    const section = document.getElementById('what-is-mutqin');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders how-it-works section with correct ID', () => {
    renderWithProviders(<LandingPage />);
    
    const section = document.getElementById('how-it-works');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders who-we-serve section with correct ID', () => {
    renderWithProviders(<LandingPage />);
    
    const section = document.getElementById('who-we-serve');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders why-it-matters section with correct ID', () => {
    renderWithProviders(<LandingPage />);
    
    const section = document.getElementById('why-it-matters');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders demo section with correct ID', () => {
    renderWithProviders(<LandingPage />);
    
    const section = document.getElementById('demo');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });
});

describe('Landing Page Headings', () => {
  it('displays statement-based heading for What Mutqin Is', () => {
    renderWithProviders(<LandingPage />);
    
    const heading = screen.getByText(/Mutqin is the digital home for CME\/CPD activities/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays statement-based heading for How It Works', () => {
    renderWithProviders(<LandingPage />);
    
    const heading = screen.getByText(/Mutqin runs each CME\/CPD activity as part of a connected network/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays statement-based heading for Who We Serve', () => {
    renderWithProviders(<LandingPage />);
    
    const heading = screen.getByText(/Mutqin supports every role in the CME\/CPD ecosystem/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays statement-based heading for Why It Matters', () => {
    renderWithProviders(<LandingPage />);
    
    const heading = screen.getByText(/Mutqin elevates how organisations manage CME\/CPD/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays statement-based heading for Join section', () => {
    renderWithProviders(<LandingPage />);
    
    const heading = screen.getByText(/Join the founding network for digital CME\/CPD activities/i);
    expect(heading).toBeInTheDocument();
  });
});

describe('Landing Page CTAs', () => {
  it('Hero primary CTA says "Join the founding network"', () => {
    renderWithProviders(<LandingPage />);
    
    const buttons = screen.getAllByRole('button');
    const heroPrimary = buttons.find(btn => 
      btn.textContent?.includes('Join the founding network')
    );
    expect(heroPrimary).toBeInTheDocument();
  });

  it('Hero secondary CTA says "Explore activity journeys"', () => {
    renderWithProviders(<LandingPage />);
    
    const buttons = screen.getAllByRole('button');
    const heroSecondary = buttons.find(btn => 
      btn.textContent?.includes('Explore activity journeys')
    );
    expect(heroSecondary).toBeInTheDocument();
  });

  it('Join section primary CTA says "Join us"', () => {
    renderWithProviders(<LandingPage />);
    
    const buttons = screen.getAllByRole('button');
    const joinPrimary = buttons.find(btn => 
      btn.textContent?.includes('Join us')
    );
    expect(joinPrimary).toBeInTheDocument();
  });

  it('Join section secondary CTA says "Review activity journeys"', () => {
    renderWithProviders(<LandingPage />);
    
    const link = screen.getByText(/Review activity journeys/i);
    expect(link).toBeInTheDocument();
  });
});

describe('How It Works - Step 0', () => {
  it('includes Step 0 in the steps', () => {
    renderWithProviders(<LandingPage />);
    
    // Use getAllByText since this text might appear in multiple places
    const step0Elements = screen.getAllByText(/Activities flow in from trusted sources/i);
    expect(step0Elements.length).toBeGreaterThan(0);
    expect(step0Elements[0]).toBeInTheDocument();
  });

  it('Step 0 has correct description', () => {
    renderWithProviders(<LandingPage />);
    
    // Use getAllByText since this text might appear in multiple places
    const descriptions = screen.getAllByText(/CME\/CPD activities are created and submitted by accredited providers/i);
    expect(descriptions.length).toBeGreaterThan(0);
    expect(descriptions[0]).toBeInTheDocument();
  });
});

describe('Activities Preview Section', () => {
  it('displays activities preview title', () => {
    renderWithProviders(<LandingPage />);
    
    // Title comes from i18n, so check for either English or Arabic version
    const title = screen.getByText(/A single view of CME\/CPD activities|     /i);
    expect(title).toBeInTheDocument();
  });

  it('displays explore link that scrolls to how-it-works', () => {
    renderWithProviders(<LandingPage />);
    
    // Use getAllByText since this text appears in multiple places
    const links = screen.getAllByText(/Explore activity journeys/i);
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toBeInTheDocument();
  });

  it('renders mock activity cards', () => {
    renderWithProviders(<LandingPage />);
    
    // Check for at least one activity name from mock data (may appear multiple times)
    const activityNames = screen.getAllByText(/Advanced Cardiology Conference/i);
    expect(activityNames.length).toBeGreaterThan(0);
    expect(activityNames[0]).toBeInTheDocument();
  });
});

describe('No Demo Language', () => {
  it('does not contain "Book a demo" in headings', () => {
    renderWithProviders(<LandingPage />);
    
    const headings = screen.queryAllByRole('heading');
    const demoHeadings = headings.filter(h => 
      h.textContent?.toLowerCase().includes('book a demo')
    );
    expect(demoHeadings.length).toBe(0);
  });

  it('does not contain "Book a demo" in CTAs', () => {
    renderWithProviders(<LandingPage />);
    
    const buttons = screen.getAllByRole('button');
    const demoButton = buttons.find(btn => 
      btn.textContent?.toLowerCase().includes('book a demo')
    );
    expect(demoButton).toBeUndefined();
  });
});

