import { useEffect, useMemo, useState } from 'react';
import bttfPoster from './assets/BTTFImage.jpg';
import gooniesPoster from './assets/GooniesImage.jpg';
import etPoster from './assets/ETImage.jpg';
import twistersPoster from './assets/TwistersImage.jpg';
import heroMarqueeImage from './assets/x61xdhve.png';
import hollywoodHatImage from './assets/hollywoodhat.jpg';
import hollywoodHoodieImage from './assets/hoodie.jpg';
import hollywoodMugImage from './assets/Mug.jpg';
import hollywoodShirtImage from './assets/Shirt.jpg';
import gatsbyFringeImage from './assets/beaded-flapper.jpg';

const movies = [
  {
    title: 'Back to the Future',
    year: 1985,
    genre: 'Sci‑Fi Adventure',
    rating: 'PG',
    poster: bttfPoster,
    trailer: 'https://youtu.be/qvsgGtivCgs?si=YrSFyKqSxqNB7mma',
    showtimes: ['Thursday · 7:40 PM', 'Friday · 8:15 PM', 'Saturday · 8:50 PM'],
  },
  {
    title: 'The Goonies',
    year: 1985,
    genre: 'Adventure Comedy',
    rating: 'PG',
    poster: gooniesPoster,
    trailer: 'https://www.youtube.com/watch?v=hJ2j4oWdQtU',
    showtimes: ['Friday · 7:20 PM', 'Saturday · 7:35 PM', 'Sunday · 7:10 PM'],
  },
  {
    title: 'E.T. the Extra-Terrestrial',
    year: 1982,
    genre: 'Family Sci‑Fi',
    rating: 'PG',
    poster: etPoster,
    trailer: 'https://youtu.be/qYAETtIIClk?si=eCwUPW82iJKmaPtF',
    showtimes: ['Wednesday · 7:10 PM', 'Saturday · 9:10 PM'],
  },
  {
    title: 'Twisters',
    year: 2024,
    genre: 'Action Thriller',
    rating: 'PG-13',
    poster: twistersPoster,
    trailer: 'https://youtu.be/wdok0rZdmx4?si=O4_JdVyD67oBWDTQ',
    showtimes: ['Thursday · 9:35 PM', 'Friday · 10:05 PM'],
  },
];

const comingSoon = [
  {
    title: 'Beetlejuice Beetlejuice',
    window: 'Opening May 17',
    genre: 'Fantasy Comedy',
    note: 'A neon-soaked late-night crowd favorite returns to the big screen.',
  },
  {
    title: 'Grease',
    window: 'Opening May 24',
    genre: 'Musical Romance',
    note: 'Classic sing-along nights with chrome, convertibles, and soda-pop energy.',
  },
  {
    title: 'Jaws',
    window: 'Opening May 31',
    genre: 'Thriller',
    note: 'A summer scream event paired with midnight creature-feature vibes.',
  },
];

const events = [
  {
    name: 'Gator Night at the Drive-In',
    audience: 'University of Florida faculty and students',
    date: 'April 26 · 6:30 PM',
    details: 'Discounted entry, campus spirit prizes, and a double feature under the stars.',
  },
  {
    name: 'Retro Romance Weekend',
    audience: 'Couples and date-night guests',
    date: 'May 3 · 7:00 PM',
    details: 'Classic love stories, themed desserts, and vintage photo booth backdrops.',
  },
  {
    name: 'Saturday Creature Feature',
    audience: 'Horror and cult-film fans',
    date: 'May 10 · 9:15 PM',
    details: 'Late-night throwback monsters, costume contest, and sponsor giveaways.',
  },
];

const sponsors = [
  { name: 'Crybabys', url: 'https://order.toasttab.com/online/crybabys' },
  { name: 'Afternoon', url: 'https://www.afternoonrestaurant.com/' },
  { name: 'Flashbacks', url: 'https://flashbacksrecycledfashions.com/' },
  { name: 'Evans Thrift Finds', url: 'https://www.instagram.com/greatwightsatan?igsh=ZHNwampqYnQyaTUy' },
];

const merchandise = [
  {
    name: 'Hollywood-Themed Shirt',
    price: '$28',
    description: 'Soft cotton shirt with a retro neon marquee print.',
    image: hollywoodShirtImage,
  },
  {
    name: 'Hollywood-Themed Hat',
    price: '$24',
    description: 'Vintage washed baseball cap with gold stitched emblem.',
    image: hollywoodHatImage,
  },
  {
    name: 'Hollywood-Themed Coffee Mug',
    price: '$18',
    description: 'Ceramic coffee mug inspired by classic silver-screen posters.',
    image: hollywoodMugImage,
  },
  {
    name: 'Hollywood-Themed Hoodie',
    price: '$52',
    description: 'Cozy pullover made for late Gainesville movie nights.',
    image: hollywoodHoodieImage,
  },
  {
    name: '1920s Gatsby Style Silver Fringe',
    price: '$36',
    description: 'Silver fringe accessory with roaring-twenties glamour for themed movie nights.',
    image: gatsbyFringeImage,
  },
];

const membershipPlan = {
  name: 'Moonlight Members Club',
  monthlyLabel: '$50/month',
  freeLabel: '$0/month',
  perks: ['Unlimited drive-in admission', '25% off food and drinks', 'Early access to themed event tickets'],
};

const reservationDates = [
  {
    value: '2026-04-20',
    label: 'Monday · April 20',
    dayType: 'Weekday',
    basePrice: 20,
    times: ['7:00 PM', '9:30 PM'],
  },
  {
    value: '2026-04-24',
    label: 'Friday · April 24',
    dayType: 'Weekend',
    basePrice: 25,
    times: ['7:30 PM', '10:00 PM'],
  },
  {
    value: '2026-04-25',
    label: 'Saturday · April 25',
    dayType: 'Weekend',
    basePrice: 25,
    times: ['7:30 PM', '10:15 PM'],
  },
  {
    value: '2026-04-28',
    label: 'Tuesday · April 28',
    dayType: 'Weekday',
    basePrice: 20,
    times: ['7:15 PM', '9:45 PM'],
  },
];

const reservationCapacities = {
  '2026-04-20|7:00 PM': 24,
  '2026-04-20|9:30 PM': 18,
  '2026-04-24|7:30 PM': 70,
  '2026-04-24|10:00 PM': 68,
  '2026-04-25|7:30 PM': 75,
  '2026-04-25|10:15 PM': 52,
  '2026-04-28|7:15 PM': 12,
  '2026-04-28|9:45 PM': 35,
};

const maxCarsPerShowtime = 75;
const initialProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const initialBilling = {
  provider: 'Stripe',
  status: 'No active subscription',
  plan: 'Free Membership',
  charges: [],
  customerPortalAvailable: true,
};

const mockCharges = [
  { id: 'inv_2026_001', date: '2026-03-01', amount: '$50.00', status: 'Paid' },
  { id: 'inv_2026_002', date: '2026-04-01', amount: '$50.00', status: 'Paid' },
];

function App() {
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const [ticketCount, setTicketCount] = useState(2);
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(reservationDates[0].value);
  const [selectedTime, setSelectedTime] = useState(reservationDates[0].times[0]);
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 'home';
  });
  const [authMode, setAuthMode] = useState('signup');
  const [authStatus, setAuthStatus] = useState('signed-out');
  const [membershipStatus, setMembershipStatus] = useState('free');
  const [authMessage, setAuthMessage] = useState('Connect Supabase to replace this local demo flow with live authentication.');
  const [profileMessage, setProfileMessage] = useState('');
  const [billingMessage, setBillingMessage] = useState('Stripe billing is scaffolded and ready to connect to live endpoints.');
  const [profile, setProfile] = useState(initialProfile);
  const [billing, setBilling] = useState(initialBilling);

  const selectedDateDetails = useMemo(
    () => reservationDates.find((entry) => entry.value === selectedDate) ?? reservationDates[0],
    [selectedDate],
  );

  const selectedSlotKey = `${selectedDate}|${selectedTime}`;
  const reservedCars = reservationCapacities[selectedSlotKey] ?? 0;
  const remainingCars = Math.max(maxCarsPerShowtime - reservedCars, 0);
  const baseTicketPrice = selectedDateDetails.basePrice;
  const isPaidMember = membershipStatus === 'paid';
  const membershipTierName = isPaidMember ? membershipPlan.name : 'Free Membership';

  const ticketTotal = useMemo(() => {
    const subtotal = baseTicketPrice * ticketCount;
    return isPaidMember ? (subtotal * 0.9).toFixed(2) : subtotal.toFixed(2);
  }, [baseTicketPrice, ticketCount, isPaidMember]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2),
    [cartItems],
  );

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentPage(params.get('page') || 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openPage = (page) => {
    const nextUrl = page === 'home' ? window.location.pathname : `${window.location.pathname}?page=${page}`;
    window.history.pushState({ page }, '', nextUrl);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (sectionId) => {
    if (currentPage !== 'home') {
      window.history.pushState({ page: 'home' }, '', window.location.pathname);
      setCurrentPage('home');
    }

    window.requestAnimationFrame(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const addToCart = (item) => {
    setCartItems((currentItems) => [...currentItems, item]);
    setCartMessage(`${item.name} added to cart.`);
  };

  const handleTicketPurchase = (event) => {
    event.preventDefault();

    if (remainingCars <= 0) {
      setTicketMessage(`Sorry, ${selectedDateDetails.label} at ${selectedTime} is sold out.`);
      return;
    }

    addToCart({
      id: `reservation-${Date.now()}`,
      type: 'Reservation',
      name: `${selectedMovie.title} Reservation`,
      details: `${selectedDateDetails.label} · ${selectedTime} · ${ticketCount} ticket(s)`,
      price: ticketTotal,
    });

    setTicketMessage(
      `Reservation added to cart for ${selectedMovie.title} on ${selectedDateDetails.label} at ${selectedTime}. ${remainingCars} of ${maxCarsPerShowtime} car spots currently remain.`,
    );
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextProfile = {
      firstName: String(formData.get('firstName') || '').trim(),
      lastName: String(formData.get('lastName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
    };

    setProfile(nextProfile);
    setAuthStatus('signed-in');
    setMembershipStatus('free');
    setBilling(initialBilling);
    setProfileMessage('');

    if (authMode === 'signup') {
      setAuthMessage(
        `Demo signup complete for ${nextProfile.firstName || 'member'}. Connect [src/lib/supabase.js](src/lib/supabase.js) to replace this with real Supabase auth.`,
      );
    } else {
      setAuthMessage(
        `Demo sign-in complete for ${nextProfile.email || 'your account'}. Replace this local state flow with Supabase session handling.`,
      );
    }
  };

  const handleProfileSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setProfile({
      firstName: String(formData.get('firstName') || '').trim(),
      lastName: String(formData.get('lastName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
    });

    setProfileMessage('Profile changes saved in the local UI. Connect this form to Supabase profile persistence next.');
  };

  const handleUpgrade = async () => {
    setBillingMessage('Upgrade flow placeholder triggered. Connect this button to [/api/create-checkout-session.js](api/create-checkout-session.js) after adding live keys.');
    setMembershipStatus('paid');
    setBilling({
      provider: 'Stripe',
      status: 'Active',
      plan: membershipPlan.name,
      charges: mockCharges,
      customerPortalAvailable: true,
    });
  };

  const handleManageBilling = async () => {
    setBillingMessage('Customer portal placeholder triggered. Connect this button to [/api/create-customer-portal-session.js](api/create-customer-portal-session.js) when Stripe is configured.');
  };

  const handleSignOut = () => {
    setAuthStatus('signed-out');
    setMembershipStatus('free');
    setProfile(initialProfile);
    setBilling(initialBilling);
    setAuthMessage('Signed out of the local demo session. Replace this with Supabase signOut in production.');
    setProfileMessage('');
  };

  const topNavigation = (
    <nav className="topbar page-topbar">
      <div>
        <p className="eyebrow">Gainesville, Florida</p>
        <h1>Starlite Drive-In</h1>
      </div>
      <div className="topbar-links">
        <button type="button" onClick={() => navigateToSection('showings')}>
          Now Showing
        </button>
        <button type="button" onClick={() => navigateToSection('coming-soon')}>
          Coming Soon
        </button>
        <button type="button" onClick={() => navigateToSection('events')}>
          Events
        </button>
        <button type="button" onClick={() => openPage('merch')}>
          Merch
        </button>
        <button type="button" onClick={() => openPage('membership')}>
          Membership
        </button>
        <button type="button" onClick={() => openPage('cart')}>
          Cart ({cartItems.length})
        </button>
      </div>
    </nav>
  );

  if (currentPage === 'contact') {
    return (
      <div className="app-shell">
        <div className="contact-page">
          {topNavigation}
          <p className="eyebrow">Contact Us</p>
          <h2>Get in touch with Starlite Drive-In</h2>
          <p>Reach out for business partnerships, membership questions, or general support.</p>

          <div className="contact-grid">
            <article className="contact-card">
              <p className="card-label">Business Inquiries</p>
              <h3>Partnerships and operations</h3>
              <p>
                Cell: <a href="tel:3522248167">352-224-8167</a>
              </p>
              <p>
                Email: <a href="mailto:starlightmovies@gmail.com">starlightmovies@gmail.com</a>
              </p>
            </article>

            <article className="contact-card">
              <p className="card-label">Membership Inquiries</p>
              <h3>Subscriptions and account help</h3>
              <p>
                Cell: <a href="tel:3523589189">352-358-9189</a>
              </p>
              <p>
                Email: <a href="mailto:starlightmovies@gmail.com">starlightmovies@gmail.com</a>
              </p>
            </article>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'merch') {
    return (
      <div className="app-shell">
        <div className="contact-page">
          {topNavigation}
          <p className="eyebrow">Merchandise</p>
          <h2>Old Hollywood tribute apparel and keepsakes</h2>
          <p>Bring the golden-age atmosphere home with branded pieces designed for film lovers.</p>

          <div className="merch-grid merch-page-grid">
            {merchandise.map((item) => (
              <article className="merch-card marquee-card" key={item.name}>
                <img className="merch-image" src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="merch-footer">
                  <strong>{item.price}</strong>
                  <button className="button secondary small" type="button" onClick={() => addToCart({ id: `merch-${item.name}`, type: 'Merch', name: item.name, details: item.description, price: item.price.replace('$', '') })}>
                    Add to Bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'cart') {
    return (
      <div className="app-shell">
        <div className="contact-page">
          {topNavigation}
          <p className="eyebrow">Cart</p>
          <h2>Your current selections</h2>
          <p>Memberships, merch, and reservations added from the site appear here.</p>

          {cartItems.length === 0 ? (
            <div className="account-preview">
              <h3>Your cart is empty</h3>
              <p>Add a membership, product, or movie slot to see it here.</p>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {cartItems.map((item) => (
                  <article className="info-card" key={item.id}>
                    <p className="card-label">{item.type}</p>
                    <h3>{item.name}</h3>
                    <p>{item.details}</p>
                    <strong>${item.price}</strong>
                  </article>
                ))}
              </div>
              <div className="ticket-summary cart-total-bar">
                <span>Cart total</span>
                <strong>${cartTotal}</strong>
              </div>
            </>
          )}

          <p className="feedback">{cartMessage}</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'membership') {
    return (
      <div className="app-shell">
        <div className="contact-page membership-page">
          {topNavigation}
          <p className="eyebrow">Membership</p>
          <h2>Your account and membership details</h2>
          <p>Review your profile, membership tier, and billing management entry points.</p>

          <div className="contact-grid membership-grid">
            <article className="contact-card">
              <p className="card-label">Authentication</p>
              <h3>{authStatus === 'signed-in' ? 'Signed in' : 'Signed out'}</h3>
              <p>
                <strong>Email:</strong> {profile.email || 'No account connected'}
              </p>
              <p>
                <strong>Password:</strong> Managed by Supabase Auth once connected
              </p>
            </article>

            <article className="contact-card">
              <p className="card-label">Current Tier</p>
              <h3>{membershipTierName}</h3>
              <p>
                <strong>Status:</strong> {isPaidMember ? 'Paid member active' : 'Free membership active'}
              </p>
              <p>
                <strong>Plan price:</strong> {isPaidMember ? membershipPlan.monthlyLabel : membershipPlan.freeLabel}
              </p>
            </article>
          </div>

          <div className="ticket-panel membership-summary-panel">
            <p className="card-label">Billing summary</p>
            <h3>{billing.plan}</h3>
            <p className="member-note">
              Billing provider: {billing.provider} · Status: {billing.status}
            </p>
            {billing.charges.length > 0 ? (
              <div className="charge-history">
                {billing.charges.map((charge) => (
                  <article className="info-card" key={charge.id}>
                    <p className="card-label">Previous charge</p>
                    <h3>{charge.amount}</h3>
                    <p>{charge.date}</p>
                    <p>{charge.status}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="member-note">Previous charges will appear here after Stripe portal and billing sync are connected.</p>
            )}
            <div className="membership-actions-row">
              {!isPaidMember ? (
                <button className="button primary" type="button" onClick={handleUpgrade}>
                  Upgrade with Stripe
                </button>
              ) : null}
              <button className="button secondary" type="button" onClick={handleManageBilling}>
                Manage Billing
              </button>
              {authStatus === 'signed-in' ? (
                <button className="button secondary" type="button" onClick={handleSignOut}>
                  Sign Out
                </button>
              ) : null}
            </div>
            <p className="feedback">{billingMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="topbar">
          <div>
            <p className="eyebrow">Gainesville, Florida</p>
            <h1>Starlite Drive-In</h1>
          </div>
          <div className="topbar-links">
            <button type="button" onClick={() => navigateToSection('showings')}>
              Now Showing
            </button>
            <button type="button" onClick={() => navigateToSection('coming-soon')}>
              Coming Soon
            </button>
            <button type="button" onClick={() => navigateToSection('events')}>
              Events
            </button>
            <button type="button" onClick={() => openPage('merch')}>
              Merch
            </button>
            <button type="button" onClick={() => openPage('membership')}>
              Membership
            </button>
            <button type="button" onClick={() => openPage('cart')}>
              Cart ({cartItems.length})
            </button>
          </div>
        </nav>

        <div className="hero-marquee">
          <img src={heroMarqueeImage} alt="Starlite Drive-In marquee" />
        </div>

        <div className="hero-grid">
          <section>
            <p className="eyebrow">Old Hollywood. Open skies. Double features.</p>
            <h2>Classic movie nights under the stars.</h2>
            <p className="lead">
              Discover current showings, reserve tickets, create a free account, upgrade to a paid membership, and manage billing through a modern Supabase and Stripe-ready experience.
            </p>
            <div className="hero-actions">
              <button className="button primary" type="button" onClick={() => navigateToSection('showings')}>
                Browse Movies
              </button>
              <button className="button secondary" type="button" onClick={() => navigateToSection('account')}>
                Create Account
              </button>
            </div>
            <div className="location-card">
              <strong>Location</strong>
              <p>1523 NW 39th Terr, Gainesville, FL 32605</p>
            </div>
          </section>

          <aside className="membership-card">
            <p className="eyebrow">Member Feature</p>
            <h3>{membershipPlan.name}</h3>
            <p className="price-tag">{membershipPlan.monthlyLabel}</p>
            <ul>
              {membershipPlan.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <p className="member-note">Free accounts are supported immediately. Paid membership upgrades route through Stripe Checkout after backend setup.</p>
            <div className="membership-actions-row">
              <button className="button primary small" type="button" onClick={() => openPage('membership')}>
                View Membership
              </button>
              <button className="button secondary small" type="button" onClick={handleUpgrade}>
                Preview Upgrade
              </button>
            </div>
            <p className="feedback">{billingMessage}</p>
          </aside>
        </div>
      </header>

      <main>
        <section className="section featured-banner-section">
          <div className="featured-banner">
            <div>
              <p className="eyebrow">Tonight at Starlite</p>
              <h2>Double-feature energy, hot popcorn, and neon under the Florida sky.</h2>
              <p>Gates open at 6:30 PM · First feature at 7:40 PM · Snack bar specials all night long.</p>
            </div>
            <div className="featured-banner-meta">
              <span>Tonight's Spotlight</span>
              <strong>{movies[0].title}</strong>
              <p>{movies[0].showtimes[0]}</p>
            </div>
          </div>
        </section>

        <section className="section" id="showings">
          <div className="section-header marquee-header">
            <div>
              <p className="eyebrow">Now Showing</p>
              <h2>Current movies under the stars</h2>
            </div>
            <p>Featuring beloved 80s classics with a few newer crowd-pleasers for all-night programming.</p>
          </div>

          <div className="movie-grid">
            {movies.map((movie) => (
              <article className="movie-card marquee-card" key={movie.title}>
                <div className="movie-poster-frame">
                  <img src={movie.poster} alt={`${movie.title} poster`} />
                </div>
                <div className="movie-content">
                  <div className="movie-heading">
                    <div>
                      <h3>{movie.title}</h3>
                      <p>
                        {movie.year} · {movie.genre}
                      </p>
                    </div>
                    <span>{movie.rating}</span>
                  </div>
                  <ul className="showtime-list">
                    {movie.showtimes.map((showtime) => (
                      <li key={showtime}>{showtime}</li>
                    ))}
                  </ul>
                  <div className="movie-footer movie-actions">
                    <strong>${baseTicketPrice}</strong>
                    <div className="movie-action-buttons">
                      <a className="button secondary small" href={movie.trailer} target="_blank" rel="noreferrer">
                        Trailer
                      </a>
                      <button
                        className="button primary small centered-button"
                        type="button"
                        onClick={() => {
                          setSelectedMovie(movie);
                          navigateToSection('reserve-ticket');
                        }}
                      >
                        Reserve Spot
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="coming-soon">
          <div className="section-header marquee-header">
            <div>
              <p className="eyebrow">Coming Soon</p>
              <h2>Big-screen favorites arriving next</h2>
            </div>
            <p>Fresh theme nights, cult classics, and crowd-pleasers queued up for the next wave of drive-in weekends.</p>
          </div>

          <div className="coming-soon-grid">
            {comingSoon.map((movie) => (
              <article className="info-card coming-soon-card" key={movie.title}>
                <p className="card-label">{movie.window}</p>
                <h3>{movie.title}</h3>
                <p className="coming-soon-genre">{movie.genre}</p>
                <p>{movie.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section ticket-section" id="reserve-ticket">
          <div className="ticket-panel marquee-panel">
            <div>
              <p className="eyebrow">Ticket Reservation</p>
              <h2>Reserve your parking spot</h2>
              <p>Pick a movie, choose a date and time, and see live weekday or weekend pricing before adding it to your cart.</p>
            </div>

            <form className="ticket-form" onSubmit={handleTicketPurchase}>
              <label>
                Selected movie
                <select
                  value={selectedMovie.title}
                  onChange={(event) => {
                    const movie = movies.find((entry) => entry.title === event.target.value);
                    if (movie) setSelectedMovie(movie);
                  }}
                >
                  {movies.map((movie) => (
                    <option key={movie.title} value={movie.title}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Date
                <select
                  value={selectedDate}
                  onChange={(event) => {
                    const nextDate = event.target.value;
                    const nextDateDetails = reservationDates.find((entry) => entry.value === nextDate) ?? reservationDates[0];
                    setSelectedDate(nextDate);
                    setSelectedTime(nextDateDetails.times[0]);
                  }}
                >
                  {reservationDates.map((dateOption) => (
                    <option key={dateOption.value} value={dateOption.value}>
                      {dateOption.label} · {dateOption.dayType}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Time
                <select value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)}>
                  {selectedDateDetails.times.map((timeOption) => (
                    <option key={timeOption} value={timeOption}>
                      {timeOption}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Tickets
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={ticketCount}
                  onChange={(event) => setTicketCount(Number(event.target.value))}
                />
              </label>

              <label className="checkbox-row">
                <input type="checkbox" checked={isPaidMember} readOnly />
                Apply live paid-member pricing after account upgrade
              </label>

              <div className="ticket-meta-grid">
                <div className="ticket-stat-card">
                  <span>Price per ticket</span>
                  <strong>${baseTicketPrice}</strong>
                  <small>{selectedDateDetails.dayType} pricing</small>
                </div>
                <div className="ticket-stat-card">
                  <span>Cars remaining</span>
                  <strong>{remainingCars}</strong>
                  <small>{maxCarsPerShowtime} max per showtime</small>
                </div>
              </div>

              <div className="ticket-summary">
                <span>Estimated total</span>
                <strong>${ticketTotal}</strong>
              </div>

              <button className="button primary centered-button" type="submit" disabled={remainingCars <= 0}>
                Reserve Movie Ticket
              </button>
              <p className="feedback">{ticketMessage}</p>
            </form>
          </div>
        </section>

        <section className="section two-column-layout" id="events">
          <div>
            <div className="section-header left marquee-header">
              <div>
                <p className="eyebrow">Upcoming Events</p>
                <h2>Themed nights and local community programs</h2>
              </div>
            </div>
            <div className="event-list">
              {events.map((eventItem) => (
                <article className="info-card marquee-card" key={eventItem.name}>
                  <p className="card-date">{eventItem.date}</p>
                  <h3>{eventItem.name}</h3>
                  <p className="card-label">{eventItem.audience}</p>
                  <p>{eventItem.details}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="section-header left marquee-header">
              <div>
                <p className="eyebrow">Local Sponsors</p>
                <h2>Neighborhood partners lighting up the lot</h2>
              </div>
            </div>
            <div className="sponsor-grid">
              {sponsors.map((sponsor) => (
                <a className="sponsor-card marquee-card" key={sponsor.name} href={sponsor.url} target="_blank" rel="noreferrer">
                  {sponsor.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section account-section" id="account">
          <div className="account-card marquee-panel auth-account-card">
            <div>
              <div className="section-header left marquee-header">
                <div>
                  <p className="eyebrow">Account & Membership</p>
                  <h2>{authMode === 'signup' ? 'Create your account' : 'Sign in to your account'}</h2>
                </div>
                <p>Users can choose a free membership or upgrade to a paid plan that is billed through Stripe.</p>
              </div>

              <div className="tab-row">
                <button className={`tab-button ${authMode === 'signup' ? 'active' : ''}`} type="button" onClick={() => setAuthMode('signup')}>
                  Sign Up
                </button>
                <button className={`tab-button ${authMode === 'signin' ? 'active' : ''}`} type="button" onClick={() => setAuthMode('signin')}>
                  Sign In
                </button>
              </div>

              <form className="account-form" onSubmit={handleAuthSubmit}>
                {authMode === 'signup' ? (
                  <div className="split-form-grid">
                    <label>
                      First name
                      <input name="firstName" type="text" placeholder="Jamie" required />
                    </label>
                    <label>
                      Last name
                      <input name="lastName" type="text" placeholder="Monroe" required />
                    </label>
                  </div>
                ) : null}

                <div className={authMode === 'signup' ? 'split-form-grid' : 'single-column-grid'}>
                  <label>
                    Email address
                    <input name="email" type="email" placeholder="jamie@example.com" required />
                  </label>
                  {authMode === 'signup' ? (
                    <label>
                      Phone number
                      <input name="phone" type="tel" placeholder="(352) 555-0147" />
                    </label>
                  ) : null}
                </div>

                <label>
                  Password
                  <input name="password" type="password" placeholder="Create a secure password" required />
                </label>

                <button className="button primary" type="submit">
                  {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
                <p className="feedback">{authMessage}</p>
              </form>
            </div>

            <div className="account-preview auth-preview-panel">
              <h3>Infrastructure status</h3>
              <p>
                <strong>Auth provider:</strong> Supabase Auth
              </p>
              <p>
                <strong>Database:</strong> Supabase Postgres for profiles and membership data
              </p>
              <p>
                <strong>Billing:</strong> Stripe Checkout and Customer Portal
              </p>
              <p>
                <strong>Hosting:</strong> Vercel frontend plus API routes
              </p>
              <p>
                <strong>Current UI state:</strong> {authStatus}
              </p>
            </div>
          </div>
        </section>

        {authStatus === 'signed-in' ? (
          <section className="section account-section">
            <div className="account-card marquee-panel auth-account-card">
              <div>
                <div className="section-header left marquee-header">
                  <div>
                    <p className="eyebrow">Profile Management</p>
                    <h2>Update account details</h2>
                  </div>
                  <p>These fields map directly to the planned [profiles](plans/supabase-stripe-vercel-plan.md) table structure.</p>
                </div>

                <form className="account-form" onSubmit={handleProfileSave}>
                  <div className="split-form-grid">
                    <label>
                      First name
                      <input name="firstName" type="text" defaultValue={profile.firstName} required />
                    </label>
                    <label>
                      Last name
                      <input name="lastName" type="text" defaultValue={profile.lastName} required />
                    </label>
                  </div>
                  <div className="split-form-grid">
                    <label>
                      Email
                      <input name="email" type="email" defaultValue={profile.email} required />
                    </label>
                    <label>
                      Phone
                      <input name="phone" type="tel" defaultValue={profile.phone} />
                    </label>
                  </div>
                  <button className="button primary" type="submit">
                    Save Profile
                  </button>
                  <p className="feedback">{profileMessage}</p>
                </form>
              </div>

              <div className="account-preview auth-preview-panel">
                <h3>Member snapshot</h3>
                <p>
                  <strong>Name:</strong> {[profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Not provided'}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email || 'Not provided'}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone || 'Not provided'}
                </p>
                <p>
                  <strong>Membership:</strong> {membershipTierName}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="section account-section">
          <div className="ticket-panel marquee-panel">
            <div className="section-header left marquee-header">
              <div>
                <p className="eyebrow">Contact Us</p>
                <h2>Need help or want to partner with us?</h2>
              </div>
              <p>Open our contact page for business and membership support details.</p>
            </div>
            <button className="button secondary" type="button" onClick={() => openPage('contact')}>
              Open Contact Page
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
