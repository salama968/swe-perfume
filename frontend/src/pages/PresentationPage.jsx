import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const PresentationPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Interactive widget state
  const [topNote, setTopNote] = useState('Bergamot');
  const [heartNote, setHeartNote] = useState('Cardamom');
  const [baseNote, setBaseNote] = useState('Ambergris');
  const [isFormulating, setIsFormulating] = useState(false);
  const [formulatedName, setFormulatedName] = useState("L'Ambre Sauvage");
  const [formulatedDesc, setFormulatedDesc] = useState("A luxurious blend opening with bright Bergamot, transitioning into warm Cardamom, and settling into a base of rich Ambergris. Best suited for: Velvet evenings.");

  const totalSlides = 7;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(totalSlides - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  // Generate perfume profile based on selections
  useEffect(() => {
    setIsFormulating(true);
    const timer = setTimeout(() => {
      const names = {
        'Bergamot-Cardamom-Ambergris': {
          name: "L'Ambre Sauvage",
          desc: "A luxurious blend opening with bright Bergamot, transitioning into warm Cardamom, and settling into a base of rich Ambergris. Best suited for: Velvet evenings."
        },
        'Bergamot-Cardamom-Sandalwood': {
          name: "Santal Céleste",
          desc: "A sophisticated fusion starting with sparkling Bergamot and spicy Cardamom, resting on a creamy, milky Sandalwood base. Best suited for: Autumn mornings."
        },
        'Bergamot-Cardamom-Bourbon Vanilla': {
          name: "Varanasi Gold",
          desc: "An exotic gourmand experience where zesty Bergamot meets sweet, smoky Bourbon Vanilla, balanced by spicy Cardamom. Best suited for: Festive gatherings."
        },
        'Bergamot-Damask Rose-Ambergris': {
          name: "Nectar Noir",
          desc: "A romantic, mineral-floral scent. The brightness of Bergamot enhances the velvet petals of Damask Rose over a sensual Ambergris drydown. Best suited for: Candlelit dinners."
        },
        'Bergamot-Damask Rose-Sandalwood': {
          name: "Rose de Mysore",
          desc: "A classic oriental floral. Fresh Bergamot yields to a rich Damask Rose heart, wrapped in the smooth, warm embrace of Mysore Sandalwood. Best suited for: Formal galas."
        },
        'Bergamot-Damask Rose-Bourbon Vanilla': {
          name: "Satin D'Or",
          desc: "A dreamy, powdery floral gourmand. Bright citrus gives way to sweet Damask Rose, finishing with rich, comforting Bourbon Vanilla. Best suited for: Cosy afternoons."
        },
        'Bergamot-Oud-Ambergris': {
          name: "Royal Mystère",
          desc: "A powerful, regal fragrance. Bergamot provides a brilliant counterpoint to deep, smoky Oud, anchored by mineral Ambergris. Best suited for: Signature wear."
        },
        'Bergamot-Oud-Sandalwood': {
          name: "Bois Impérial",
          desc: "A noble woody harmony. Zesty Bergamot cuts through the dense complexity of Oud, mellowed by warm, soothing Sandalwood. Best suited for: Business negotiations."
        },
        'Bergamot-Oud-Bourbon Vanilla': {
          name: "Oud Vanille",
          desc: "A decadent, dark-sweet contrast. Fresh Bergamot, deep resinous Oud, and sweet Bourbon Vanilla create an intoxicating trail. Best suited for: Winter nights."
        },
        'Saffron-Cardamom-Ambergris': {
          name: "Epice Royale",
          desc: "A warm, dry spice masterpiece. Golden Saffron and Cardamom dance over a marine-ambery base of refined Ambergris. Best suited for: Executive lounges."
        },
        'Saffron-Cardamom-Sandalwood': {
          name: "Sutra Rouge",
          desc: "An elegant, meditative perfume. Exotic Saffron and Cardamom lead into a rich, creamy base of sacred Sandalwood. Best suited for: Yoga and mindfulness."
        },
        'Saffron-Cardamom-Bourbon Vanilla': {
          name: "Kashmir Gold",
          desc: "A sumptuous, comforting oriental spice blend. Saffron and Cardamom blend beautifully with the warm sweetness of Bourbon Vanilla. Best suited for: Cold weather."
        },
        'Saffron-Damask Rose-Ambergris': {
          name: "Rose et Or",
          desc: "A highly prestigious combination. Velvet Damask Rose spiked with Saffron, supported by the ocean-warmed depth of Ambergris. Best suited for: Red carpet events."
        },
        'Saffron-Damask Rose-Sandalwood': {
          name: "Santal Majestueux",
          desc: "A rich, woody floral. Saffron gives a dry, leathery edge to Damask Rose, sitting on a base of luxurious Sandalwood. Best suited for: Theatre visits."
        },
        'Saffron-Damask Rose-Bourbon Vanilla': {
          name: "Saffron Elixir",
          desc: "A warm, enveloping scent. Floral Rose and exotic Saffron are rounded off by a sweet, luxurious Bourbon Vanilla finish. Best suited for: High tea."
        },
        'Saffron-Oud-Ambergris': {
          name: "Desert Silk",
          desc: "A mesmerizing, high-contrast oriental perfume. Golden Saffron, dark animalic Oud, and salty, warm Ambergris. Best suited for: Desert adventures."
        },
        'Saffron-Oud-Sandalwood': {
          name: "Oud Orientale",
          desc: "A traditional, majestic blend of Saffron, precious Oud wood, and smooth Sandalwood. Deeply complex and sophisticated. Best suited for: Collectors."
        },
        'Saffron-Oud-Bourbon Vanilla': {
          name: "Saffron Oud Imperial",
          desc: "A modern take on traditional Oud. Spicy Saffron and dark Oud are sweetened by a creamy, luxury Bourbon Vanilla note. Best suited for: Evening events."
        },
        'Neroli-Cardamom-Ambergris': {
          name: "Orangerie Marine",
          desc: "A refreshing yet warm breeze. Sun-drenched Neroli and green Cardamom settle on a warm, salty Ambergris base. Best suited for: Yacht excursions."
        },
        'Neroli-Cardamom-Sandalwood': {
          name: "Neroli Blanc",
          desc: "A bright, clean floral wood. Citrusy Neroli and spicy Cardamom are balanced by the creamy depth of Sandalwood. Best suited for: Spring days."
        },
        'Neroli-Cardamom-Bourbon Vanilla': {
          name: "Neroli Gourmand",
          desc: "A delightful, bright-sweet mix. Neroli blossoms and warm Cardamom wrapped in the sweet comfort of Bourbon Vanilla. Best suited for: Casual luxury."
        },
        'Neroli-Damask Rose-Ambergris': {
          name: "Bouquet Divin",
          desc: "A radiant, multi-faceted floral. Sparkling Neroli and romantic Damask Rose supported by clean, oceanic Ambergris. Best suited for: Garden parties."
        },
        'Neroli-Damask Rose-Sandalwood': {
          name: "Fleur de Mysore",
          desc: "A gorgeous white and red floral harmony, grounded by the creamy warmth of authentic Sandalwood. Best suited for: Daytime elegance."
        },
        'Neroli-Damask Rose-Bourbon Vanilla': {
          name: "Fleur Sweet",
          desc: "A youthful yet elegant floral-sweet scent, blending fresh Neroli, deep Rose, and rich, creamy Bourbon Vanilla. Best suited for: Weekend brunch."
        },
        'Neroli-Oud-Ambergris': {
          name: "Oud Lumineux",
          desc: "An avant-garde composition. The bright, clean floralcy of Neroli cuts through the dark, animalic smoke of Oud and Ambergris. Best suited for: Artistic gallery openings."
        },
        'Neroli-Oud-Sandalwood': {
          name: "Bois de Fleur",
          desc: "A balanced, clean woody scent. Neroli lends a fresh floral top, Oud brings a resinous body, and Sandalwood smooths the drydown. Best suited for: Everyday luxury."
        },
        'Neroli-Oud-Bourbon Vanilla': {
          name: "Nuit Blanche",
          desc: "A contrasting fragrance where luminous Neroli meets mysterious Oud and sweet, seductive Bourbon Vanilla. Best suited for: Night clubbing."
        }
      };

      const key = `${topNote}-${heartNote}-${baseNote}`;
      const formulated = names[key] || {
        name: "L'Essence Signature",
        desc: `A beautiful custom formulation featuring top notes of ${topNote}, a heart of ${heartNote}, and a lingering base of ${baseNote}.`
      };
      
      setFormulatedName(formulated.name);
      setFormulatedDesc(formulated.desc);
      setIsFormulating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [topNote, heartNote, baseNote]);

  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#fbf9f9] text-[#1b1c1c] font-['Manrope'] relative flex flex-col select-none">
      {/* Header Bar */}
      <header className="absolute top-0 left-0 w-full z-30 px-10 py-6 flex justify-between items-center bg-gradient-to-b from-[#fbf9f9] to-transparent">
        <div className="flex items-center gap-3">
          <span className="font-['Noto_Serif'] text-xl font-medium tracking-widest text-black">L'ESSENCE</span>
          <span className="h-4 w-[1px] bg-stone-300"></span>
          <span className="font-['Manrope'] text-xs tracking-widest uppercase text-stone-500">Marketplace Presentation</span>
        </div>
        <Link 
          to="/" 
          className="flex items-center gap-2 font-['Manrope'] text-xs tracking-widest uppercase text-stone-600 hover:text-black transition-colors px-4 py-2 border border-stone-200 hover:border-black rounded-full"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Back to Store
        </Link>
      </header>

      {/* Main Slides Container */}
      <div 
        className="flex-1 flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* Slide 1: Welcome & Hero */}
        <section className="w-screen h-full flex-none relative flex items-center justify-center bg-black overflow-hidden">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
            <img 
              src="/presentation-hero.png" 
              alt="L'Essence Luxury Bottle"
              className="w-full h-full object-cover scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 z-10"></div>
          
          <div className="relative z-20 text-center max-w-4xl px-8 flex flex-col items-center">
            <span className="text-[#e0c29b] font-['Manrope'] text-xs tracking-[0.25em] uppercase mb-4 animate-pulse">
              Welcome to the Future of Fragrance Commerce
            </span>
            <h1 className="font-['Noto_Serif'] text-5xl md:text-7xl lg:text-8xl text-white font-light tracking-tight mb-8">
              L'ESSENCE
            </h1>
            <p className="text-stone-300 font-['Manrope'] text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-12">
              A premium, decentralized marketplace uniting artisan perfumers with discerning perfume collectors around the world.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleNext}
                className="bg-[#e0c29b] text-black font-semibold text-xs tracking-widest uppercase px-8 py-4 hover:bg-white transition-all rounded-full flex items-center gap-2"
              >
                Begin Presentation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Slide 2: The Vision */}
        <section className="w-screen h-full flex-none flex items-center justify-center bg-[#fbf9f9] px-10">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-[#715b3b] font-['Manrope'] text-xs tracking-[0.2em] uppercase font-semibold">
                01 / THE VISION
              </span>
              <h2 className="font-['Noto_Serif'] text-4xl md:text-5xl text-black font-light leading-tight">
                Curating Luxury &amp; Heritage
              </h2>
              <p className="text-stone-600 font-['Manrope'] text-base md:text-lg leading-relaxed">
                Finding a signature fragrance is a deeply intimate, artistic journey. L'Essence bridges the gap between high-end niche perfumeries and discerning collectors who seek more than just a scent—they seek an identity.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#fddeb5] flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs text-[#715b3b] font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Curated Authenticity</h3>
                    <p className="text-sm text-stone-500">Only verified boutique and heritage brands allowed on our platform.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#fddeb5] flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs text-[#715b3b] font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Empowering Independent Perfumers</h3>
                    <p className="text-sm text-stone-500">A direct-to-consumer model that gives artisans full pricing control.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#fddeb5] flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs text-[#715b3b] font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Notes-First Discovery</h3>
                    <p className="text-sm text-stone-500">Innovative digital profiling designed around the olfactory pyramid.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-xl hidden md:block">
              <img 
                src="/presentation-hero.png" 
                alt="Minimalist design aesthetic"
                className="w-full h-full object-cover grayscale opacity-90"
              />
              <div className="absolute inset-0 bg-[#715b3b]/10 mix-blend-overlay"></div>
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur px-6 py-5 border border-stone-100 rounded-xl">
                <p className="font-['Noto_Serif'] italic text-stone-700 text-sm">
                  "Perfume is the art that makes memory speak."
                </p>
                <p className="text-xs tracking-widest text-[#715b3b] uppercase mt-2 font-semibold">
                  — L'ESSENCE PHILOSOPHY
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: Interactive Demo */}
        <section className="w-screen h-full flex-none flex items-center justify-center bg-[#f5f3f3] px-6">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            
            {/* Left intro panel */}
            <div className="lg:col-span-2 space-y-6">
              <span className="text-[#715b3b] font-['Manrope'] text-xs tracking-[0.2em] uppercase font-semibold">
                02 / LIVE DEMO
              </span>
              <h2 className="font-['Noto_Serif'] text-4xl text-black font-light leading-tight">
                The Olfactory Profile Builder
              </h2>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                Experience our unique discovery mechanism. Mix note levels below to formulate a luxury fragrance concept. The system matches top, heart, and base notes to create bespoke profiles.
              </p>
              
              <div className="p-4 bg-white/80 border border-stone-200 rounded-xl space-y-2">
                <h4 className="text-xs uppercase tracking-widest text-stone-500 font-bold">The Olfactory Pyramid</h4>
                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#fddeb5] w-[30%]" title="Top Note (30%)"></div>
                  <div className="h-full bg-[#e0c29b] w-[45%]" title="Heart Note (45%)"></div>
                  <div className="h-full bg-[#715b3b] w-[25%]" title="Base Note (25%)"></div>
                </div>
                <div className="flex justify-between text-[10px] uppercase text-stone-400 tracking-wider">
                  <span>Top Note (Fresh)</span>
                  <span>Heart (Core)</span>
                  <span>Base (Tenacity)</span>
                </div>
              </div>
            </div>

            {/* Right interactive panel */}
            <div className="lg:col-span-3 bg-white border border-stone-200 p-8 rounded-2xl shadow-xl space-y-6">
              <h3 className="font-['Noto_Serif'] text-xl text-black font-medium border-b border-stone-100 pb-4">
                Formulate Custom Scent
              </h3>

              {/* Selector Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Top Note */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-[#715b3b]">Top Note (First Impression)</label>
                  <div className="flex flex-col gap-2">
                    {['Bergamot', 'Saffron', 'Neroli'].map((note) => (
                      <button
                        key={note}
                        onClick={() => setTopNote(note)}
                        className={`text-left text-xs font-semibold px-4 py-3 rounded-lg border transition-all ${
                          topNote === note
                            ? 'bg-[#fddeb5] border-[#715b3b] text-black shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Heart Note */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-[#715b3b]">Heart Note (Personality)</label>
                  <div className="flex flex-col gap-2">
                    {['Cardamom', 'Damask Rose', 'Oud'].map((note) => (
                      <button
                        key={note}
                        onClick={() => setHeartNote(note)}
                        className={`text-left text-xs font-semibold px-4 py-3 rounded-lg border transition-all ${
                          heartNote === note
                            ? 'bg-[#fddeb5] border-[#715b3b] text-black shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Base Note */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-[#715b3b]">Base Note (Drydown/Trail)</label>
                  <div className="flex flex-col gap-2">
                    {['Ambergris', 'Sandalwood', 'Bourbon Vanilla'].map((note) => (
                      <button
                        key={note}
                        onClick={() => setBaseNote(note)}
                        className={`text-left text-xs font-semibold px-4 py-3 rounded-lg border transition-all ${
                          baseNote === note
                            ? 'bg-[#fddeb5] border-[#715b3b] text-black shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Formulation Output Panel */}
              <div className="bg-[#fbf9f9] border border-stone-100 rounded-xl p-5 relative overflow-hidden min-h-[140px] flex flex-col justify-center">
                {isFormulating ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-2 border-stone-200 border-t-[#715b3b] rounded-full animate-spin"></div>
                    <span className="text-[11px] tracking-widest uppercase text-stone-500">Distilling Olfactory Notes...</span>
                  </div>
                ) : (
                  <div className="space-y-2 animate-[fadeIn_0.5s_ease-out]">
                    <span className="text-[10px] tracking-widest uppercase text-[#715b3b] font-bold">
                      FORMULATED FRAGRANCE CONCEPT
                    </span>
                    <h4 className="font-['Noto_Serif'] text-2xl text-black font-semibold">
                      {formulatedName}
                    </h4>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
                      {formulatedDesc}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Slide 4: Platform Features */}
        <section className="w-screen h-full flex-none flex items-center justify-center bg-[#fbf9f9] px-10">
          <div className="max-w-6xl w-full space-y-10">
            <div className="text-center space-y-3">
              <span className="text-[#715b3b] font-['Manrope'] text-xs tracking-[0.2em] uppercase font-semibold">
                03 / MARKETPLACE ROLES
              </span>
              <h2 className="font-['Noto_Serif'] text-4xl text-black font-light">
                A Unified Perfume Ecosystem
              </h2>
              <p className="text-stone-500 text-sm max-w-2xl mx-auto font-light">
                Our architecture handles three primary user classes, providing customized tools for customers, artisan suppliers, and marketplace moderators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Collectors */}
              <div className="bg-white border border-stone-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center text-[#715b3b]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                <h3 className="font-['Noto_Serif'] text-xl text-black">For Collectors</h3>
                <ul className="space-y-2 text-stone-500 text-xs md:text-sm">
                  <li>• Dynamic browsing of niche scent profiles</li>
                  <li>• Intuitive shopping bag &amp; instant checkout</li>
                  <li>• Order histories with real-time tracking</li>
                  <li>• Interactive fragrance review profiles</li>
                </ul>
              </div>

              {/* Vendors */}
              <div className="bg-white border border-stone-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center text-[#715b3b]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/>
                  </svg>
                </div>
                <h3 className="font-['Noto_Serif'] text-xl text-black">For Vendors</h3>
                <ul className="space-y-2 text-stone-500 text-xs md:text-sm">
                  <li>• Simplified vendor onboarding process</li>
                  <li>• Full-featured inventory management</li>
                  <li>• Sales analytics, income charts &amp; data export</li>
                  <li>• Real-time order fulfillment pipeline</li>
                </ul>
              </div>

              {/* Admins */}
              <div className="bg-white border border-stone-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center text-[#715b3b]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h3 className="font-['Noto_Serif'] text-xl text-black">For Administrators</h3>
                <ul className="space-y-2 text-stone-500 text-xs md:text-sm">
                  <li>• Instant vendor application review &amp; activation</li>
                  <li>• Platform-wide volume metrics &amp; dashboard</li>
                  <li>• Secure database moderation &amp; user control</li>
                  <li>• Global product curation and spotlight options</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 5: Tech Stack & Architecture */}
        <section className="w-screen h-full flex-none flex items-center justify-center bg-[#f5f3f3] px-10">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[#715b3b] font-['Manrope'] text-xs tracking-[0.2em] uppercase font-semibold">
                04 / TECHNOLOGY
              </span>
              <h2 className="font-['Noto_Serif'] text-4xl text-black font-light leading-tight">
                Modern &amp; Secure Architecture
              </h2>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                L'Essence is built on a highly performant and secure stack designed for fluid animations, offline reliability, and fast transaction handling.
              </p>
              
              <ul className="space-y-3 font-['Manrope'] text-xs md:text-sm text-stone-500">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#715b3b] rounded-full"></span>
                  <strong>Client UI:</strong> Vite + React with Tailwind CSS v4 for ultra-fast, responsive styling.
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#715b3b] rounded-full"></span>
                  <strong>Backend:</strong> Node.js and Express server hosting clean REST endpoints.
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#715b3b] rounded-full"></span>
                  <strong>Security:</strong> JSON Web Tokens (JWT) for stateless session authorization.
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#715b3b] rounded-full"></span>
                  <strong>Database:</strong> MongoDB for scalable product documentation and notes indexing.
                </li>
              </ul>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="bg-white border border-stone-200 p-8 rounded-2xl shadow-lg flex flex-col justify-center gap-6">
              <h4 className="text-xs uppercase tracking-widest text-[#715b3b] font-bold">Request Flow Diagram</h4>
              
              <div className="space-y-4">
                {/* Client Box */}
                <div className="border border-stone-200 bg-stone-50 p-3 rounded-lg text-center">
                  <span className="text-xs font-bold text-black block">React Web App (Client)</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Vite Dev Server / Vercel Bundle</span>
                </div>
                
                <div className="flex justify-center">
                  <div className="h-6 w-[1px] bg-stone-300 relative">
                    <span className="absolute bottom-0 -left-1 text-[8px] text-stone-400">▼</span>
                  </div>
                </div>

                {/* API Box */}
                <div className="border border-[#715b3b]/30 bg-[#fddeb5]/10 p-3 rounded-lg text-center relative">
                  <span className="text-xs font-bold text-[#715b3b] block">Node/Express API Server</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">JWT Auth &amp; Role-based Middlewares</span>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-2 py-0.5 border border-stone-100 rounded text-[8px] uppercase tracking-wider font-bold shadow-sm">
                    Port 4000
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="h-6 w-[1px] bg-stone-300 relative">
                    <span className="absolute bottom-0 -left-1 text-[8px] text-stone-400">▼</span>
                  </div>
                </div>

                {/* DB Box */}
                <div className="border border-stone-200 bg-stone-50 p-3 rounded-lg text-center">
                  <span className="text-xs font-bold text-black block">MongoDB Database</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Mongoose Schemas (User, Product, Order)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 6: Metrics & Growth */}
        <section className="w-screen h-full flex-none flex items-center justify-center bg-[#fbf9f9] px-10">
          <div className="max-w-6xl w-full space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[#715b3b] font-['Manrope'] text-xs tracking-[0.2em] uppercase font-semibold">
                05 / STATISTICS
              </span>
              <h2 className="font-['Noto_Serif'] text-4xl text-black font-light">
                Platform Traction &amp; Scale
              </h2>
              <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
                Our marketplace metrics demonstrate strong engagement and a healthy, premium average order value.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#f5f3f3] border border-stone-200 p-8 rounded-xl text-center space-y-2">
                <span className="block font-['Noto_Serif'] text-4xl md:text-5xl text-black font-light">12K+</span>
                <span className="block text-xs uppercase tracking-widest text-[#715b3b] font-semibold">Active Collectors</span>
              </div>
              
              <div className="bg-[#f5f3f3] border border-stone-200 p-8 rounded-xl text-center space-y-2">
                <span className="block font-['Noto_Serif'] text-4xl md:text-5xl text-black font-light">150+</span>
                <span className="block text-xs uppercase tracking-widest text-[#715b3b] font-semibold">Artisan Brands</span>
              </div>

              <div className="bg-[#f5f3f3] border border-stone-200 p-8 rounded-xl text-center space-y-2">
                <span className="block font-['Noto_Serif'] text-4xl md:text-5xl text-black font-light">$320</span>
                <span className="block text-xs uppercase tracking-widest text-[#715b3b] font-semibold">Average Ticket</span>
              </div>

              <div className="bg-[#f5f3f3] border border-stone-200 p-8 rounded-xl text-center space-y-2">
                <span className="block font-['Noto_Serif'] text-4xl md:text-5xl text-black font-light">4.9★</span>
                <span className="block text-xs uppercase tracking-widest text-[#715b3b] font-semibold">User Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 7: Roadmap & Closing */}
        <section className="w-screen h-full flex-none flex items-center justify-center bg-black text-white px-10 relative overflow-hidden">
          {/* Subtle logo background */}
          <div className="absolute -bottom-24 -right-24 text-stone-900/40 text-[20vw] font-['Noto_Serif'] select-none font-bold">
            LE
          </div>

          <div className="max-w-4xl w-full text-center space-y-10 relative z-10">
            <span className="text-[#e0c29b] font-['Manrope'] text-xs tracking-[0.25em] uppercase font-semibold">
              06 / ROADMAP
            </span>
            <h2 className="font-['Noto_Serif'] text-4xl md:text-6xl text-white font-light tracking-tight leading-tight">
              Crafting the Future of Fine Scent Commerce
            </h2>
            <p className="text-stone-400 font-['Manrope'] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              We are constantly refining the platform experience. Upcoming additions include an AI Fragrance Sommelier matching mood states to perfume notes, monthly discovery subscription lines, and concierge styling portals.
            </p>

            <div className="pt-6">
              <Link
                to="/"
                className="bg-[#e0c29b] text-black font-semibold text-xs tracking-widest uppercase px-10 py-5 hover:bg-white transition-all rounded-full inline-flex items-center gap-3"
              >
                Enter the Marketplace
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Navigation Overlay */}
      <footer className="absolute bottom-0 left-0 w-full z-30 px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-t from-[#fbf9f9] via-[#fbf9f9]/90 to-transparent">
        {/* Progress Bar & Indicators */}
        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Nav Dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-8 bg-[#715b3b]' 
                    : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold shrink-0">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
        </div>

        {/* Progress percent indicator */}
        <div className="absolute top-0 left-0 h-1 bg-[#fddeb5] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}>
          <div className="h-full bg-[#715b3b]"></div>
        </div>

        {/* Prev / Next buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`p-3 border rounded-full transition-colors flex items-center justify-center ${
              currentSlide === 0
                ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                : 'border-stone-300 text-black hover:border-black'
            }`}
            title="Previous Slide (Left Arrow)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className={`p-3 border rounded-full transition-colors flex items-center justify-center ${
              currentSlide === totalSlides - 1
                ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                : 'border-stone-300 text-black hover:border-black'
            }`}
            title="Next Slide (Right Arrow / Spacebar)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PresentationPage;
