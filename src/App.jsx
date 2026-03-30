import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  BotMessageSquare, Music, Server, Terminal as TerminalIcon, Heart, 
  ShieldCheck, Zap, Globe, Code, ShieldAlert, Rocket, 
  ChevronDown, Menu, X, Bell, Gamepad2, Swords, Lock, Users, Shield, ShoppingCart, BadgeCheck, Ban
} from 'lucide-react';
import { FaGithub, FaInstagram, FaTelegramPlane } from 'react-icons/fa';
import Background from './components/Background';

// --- CUSTOM CURSOR ---
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-purple-400 pointer-events-none z-[100] hidden xl:block shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? "rgba(168, 85, 247, 0.1)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[100] hidden xl:block shadow-[0_0_10px_white]"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.1 }}
      />
    </>
  );
};

// --- TERMINAL WIDGET (EXTRA FEATURE) ---
const TerminalWidget = () => {
  const lines = [
    "[SYS] Initializing NEX Core Engine...",
    "[NEX] Bypass firewalls: SUCCESS",
    "[WARN] Unauthorized layers detected. Intercepting...",
    "[NEX] Overwriting root access... DONE",
    "[OK] All systems online. Ready for command.",
  ];
  
  const [displayedLine, setDisplayedLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedLine((prev) => (prev + 1) % lines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute left-6 top-1/4 max-w-[300px] hidden 2xl:block bg-[#050505]/80 backdrop-blur-xl border border-purple-500/30 p-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden z-20"
    >
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        <span className="text-[10px] text-gray-500 font-bold ml-2 uppercase tracking-widest">NEX Shell</span>
      </div>
      <div className="font-mono text-xs text-green-400 min-h-[40px] flex items-center">
        <span className="mr-2 text-purple-500">$</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={displayedLine}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {lines[displayedLine]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


// --- 3D TILT WRAPPER COMPONENT ---
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  // Convert mouse position to rotation values (tweak the 15 and -15 for more/less extreme tilt)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d", // Extremely important for nested 3D elements
      }}
      className={`relative w-full h-full perspective-1000 ${className}`}
    >
      {/* Glow highlight that follows the mouse - Adds to the 3D shiny effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          transform: "translateZ(30px)",
        }}
      />
      {children}
    </motion.div>
  );
};


// --- ANIMATIONS CONFIG ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeInUp = {
  hidden: { y: 60, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.8, type: "spring", bounce: 0.4 } },
};


// --- COMPONENTS ---

// 1. Floating Glass Navbar
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.nav 
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, type: "spring", stiffness: 50 }}
      className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-[1400px] z-[90]"
    >
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full px-8 py-4 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative z-[90]">
        <div className="text-white font-extrabold text-2xl tracking-widest flex items-center gap-2">
          <Zap className="text-purple-500 w-6 h-6 animate-pulse" /> NEX<span className="text-purple-500">.</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex gap-10 text-sm font-bold text-gray-400 tracking-widest uppercase">
          <a href="#hero" className="hover:text-white transition-colors">Home</a>
          <a href="#bots" className="hover:text-purple-400 transition-colors">Arsenal</a>
          <a href="#network" className="hover:text-red-400 transition-colors">Network</a>
          <a href="#web" className="hover:text-blue-400 transition-colors">Websites</a>
        </div>

        <a href="https://t.me/NEX_FUCKR" target="_blank" rel="noreferrer" className="hidden lg:flex bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:scale-105">
          <FaTelegramPlane size={18} /> Join NEX
        </a>

        {/* Mobile Menu Toggle Button */}
        <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute top-full left-0 w-full mt-4 bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl lg:hidden z-40"
          >
            <a href="#hero" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white font-bold text-lg border-b border-white/5 pb-3">Home</a>
            <a href="#bots" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-purple-400 font-bold text-lg border-b border-white/5 pb-3">Arsenal</a>
            <a href="#network" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-red-400 font-bold text-lg border-b border-white/5 pb-3">Network</a>
            <a href="#web" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-blue-400 font-bold text-lg border-b border-white/5 pb-3">Websites</a>
            <a href="https://t.me/NEX_FUCKR" target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-4 shadow-lg shadow-purple-500/30">
              <FaTelegramPlane size={20} /> Join NEX Group
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// 2. Extreme 3D Bot Card
const BotCard = ({ name, description, icon: Icon, tag, link, comingSoon }) => (
  <motion.div variants={fadeInUp} className="h-full">
    <TiltCard className="group">
      {/* 3D Deep Background Glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${comingSoon ? 'from-gray-600 to-gray-800' : 'from-purple-600 via-pink-500 to-red-500'} rounded-[2rem] blur-[30px] opacity-0 group-hover:opacity-60 transition-opacity duration-700 -z-10`}
        style={{ transform: "translateZ(-50px)" }} // Physically pushing the glow backwards in 3D space
      ></div>
      
      {/* The Actual Physical Card */}
      <div 
        className={`relative h-full bg-gradient-to-b from-[#111] to-[#050505] p-8 lg:p-10 rounded-[2rem] border border-white/10 ${comingSoon ? 'group-hover:border-gray-500/50' : 'group-hover:border-pink-500/70'} flex flex-col transition-all duration-300 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}
        style={{ transform: "translateZ(30px)" }} // Pushing the card forward
      >
        {/* Floating Tag */}
        {tag && (
            <span 
              className={`absolute top-6 right-6 bg-black/50 border border-white/10 ${comingSoon ? 'text-gray-400' : 'text-white'} text-xs uppercase tracking-[0.2em] font-black px-4 py-2 rounded-full z-10 shadow-lg`}
              style={{ transform: "translateZ(60px)" }} // Tag floats above everything
            >
              {tag}
            </span>
        )}
        
        {/* Popping Icon */}
        <div className="flex items-center gap-5 mb-8 z-10">
          <div 
            className={`bg-gradient-to-br ${comingSoon ? 'from-gray-500/20' : 'from-purple-500/30'} to-transparent p-4 sm:p-5 rounded-2xl border ${comingSoon ? 'border-gray-500/30' : 'border-purple-400/50'} shadow-[0_0_20px_rgba(168,85,247,0.2)]`}
            style={{ transform: "translateZ(40px)" }}
          >
            <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${comingSoon ? 'text-gray-500' : 'text-purple-300'}`} />
          </div>
          <h3 
            className={`text-2xl sm:text-3xl font-black ${comingSoon ? 'text-gray-400' : 'text-white'} tracking-tight`}
            style={{ transform: "translateZ(50px)" }}
          >
            {name}
          </h3>
        </div>
        
        {/* Description */}
        <p 
          className="text-gray-400 text-sm lg:text-base leading-relaxed mb-10 flex-grow z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          {description}
        </p>
        
        {/* Animated Button */}
        {comingSoon ? (
          <button 
            disabled 
            style={{ transform: "translateZ(40px)" }}
            className="w-full text-center bg-black/50 text-gray-500 border border-white/10 font-bold px-6 py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 text-base z-10 transition-all font-mono"
          >
            <Lock size={18} /> Compiling System...
          </button>
        ) : (
          <a 
            href={link} target="_blank" rel="noopener noreferrer" 
            style={{ transform: "translateZ(50px)" }}
            className="relative w-full text-center bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-gray-300 hover:text-white border border-white/20 hover:border-transparent font-black px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group/btn text-base z-10 shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            <FaTelegramPlane size={20} className="relative z-10 group-hover/btn:scale-125 transition-transform" /> 
            <span className="relative z-10 uppercase tracking-widest text-sm">Launch Target</span>
          </a>
        )}
      </div>
    </TiltCard>
  </motion.div>
);


// 3. Extruded Web Card
const WebCard = ({ name, type, link }) => (
  <motion.div variants={fadeInUp} className="h-full">
    <TiltCard className="group h-full">
      <div 
        className="relative overflow-hidden flex items-center gap-5 sm:gap-6 p-6 lg:p-8 rounded-[2rem] bg-[#0c1222] border-t-2 border-l-2 border-white/5 border-b-2 border-r-2 border-black/50 group-hover:border-blue-400 transition-all duration-300 h-full shadow-[20px_20px_60px_#04080e,-20px_-20px_60px_#141c30]"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="absolute right-[-10%] top-[-20%] w-40 h-40 bg-blue-500/20 blur-3xl rounded-full transition-all duration-700"></div>
        
        {/* Floating Icon */}
        <div 
          className="bg-blue-500/10 p-5 rounded-2xl border border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          style={{ transform: "translateZ(50px)" }}
        >
          <Globe size={28} className="sm:w-8 sm:h-8 animate-pulse" />
        </div>
        
        <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
          <h4 className="text-white font-black text-xl sm:text-2xl mb-1 drop-shadow-lg">{name}</h4>
          <p className="text-blue-500 text-xs sm:text-sm uppercase tracking-[0.2em] font-black">{type}</p>
        </div>
      </div>
    </TiltCard>
  </motion.div>
);


// 4. Heavy 3D Fighter Box
const FighterBox = ({ title, desc, icon: Icon, link }) => (
  <motion.div variants={fadeInUp}>
    <TiltCard className="group">
      <a 
        href={link} target="_blank" rel="noopener noreferrer"
        className="block bg-gradient-to-br from-[#111] to-black border-t-4 border-l border-r border-b border-white/5 border-t-red-600/50 hover:border-t-red-500 p-8 rounded-[2rem] flex flex-col items-center text-center transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        style={{ transform: "translateZ(20px)" }}
      >
        <div 
          className="bg-red-950/50 p-5 rounded-[1.5rem] mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.3)]"
          style={{ transform: "translateZ(40px)" }}
        >
          <Icon className="text-red-500 w-10 h-10 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 tracking-wide uppercase" style={{ transform: "translateZ(30px)" }}>{title}</h3>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest" style={{ transform: "translateZ(20px)" }}>{desc}</p>
      </a>
    </TiltCard>
  </motion.div>
);


// --- MAIN APP ---
export default function App() {
  return (
    <div className="text-gray-200 min-h-screen w-full overflow-x-hidden font-sans relative selection:bg-purple-500/30 scroll-smooth bg-[#030303]">
      <CustomCursor />
      
      {/* EXTREME 3D BACKGROUND (Animated Perspective Grid) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30 perspective-1000">
        <div className="absolute inset-x-0 bottom-[-50%] h-[150%] bg-[linear-gradient(transparent_90%,rgba(168,85,247,0.5)_100%),linear-gradient(90deg,transparent_90%,rgba(168,85,247,0.5)_100%)] bg-[length:50px_50px] [transform:rotateX(75deg)] origin-bottom animate-grid-flow"></div>
        {/* Vignette effect to fade out the edges of the grid */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#030303]/80 to-[#030303]"></div>
        <div className="absolute inset-0 bg-radial-vignette"></div>
      </div>
      
      <Background />
      <Navbar />

      <div className="relative z-10 w-full pt-20">
        
        {/* 🚀 HERO SECTION (3D PREMIUM DESKTOP) */}
        <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center p-6 lg:p-12 relative">
          
          <TerminalWidget />

          {/* Central 3D Interactive Core */}
          <TiltCard className="max-w-6xl mx-auto flex flex-col justify-center items-center pb-20">
            <motion.div
              className="mb-10 flex items-center gap-3 bg-black/80 border border-purple-500/40 text-purple-300 px-6 py-3 rounded-full text-xs uppercase tracking-[0.3em] font-black shadow-[0_0_50px_rgba(168,85,247,0.3)] z-10"
              initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.6, duration: 1 }}
              style={{ transform: "translateZ(50px)" }}
            >
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
               </span>
               NEX CORE OS VER. 0.9.4
            </motion.div>
            
            <motion.h1 
              className="text-7xl sm:text-8xl md:text-9xl lg:text-[14rem] 2xl:text-[16rem] font-black text-white mb-6 tracking-tighter leading-[0.8] z-10"
              initial={{ opacity: 0, scale: 0.5, rotateX: 45 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              style={{ transform: "translateZ(100px)", textShadow: "0 20px 50px rgba(0,0,0,1)" }}
            >
              NEX<motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 1, duration: 0.5 }} 
                className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-pink-600"
              >.</motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-3xl text-gray-400 max-w-4xl mb-16 font-bold px-4 leading-relaxed z-10 uppercase tracking-widest"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
              style={{ transform: "translateZ(70px)" }}
            >
              Building the Future of <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">Telegram Deployments</span> & Cyber Automation.
            </motion.p>
            
            {/* 3D Hero Buttons */}
            <motion.div className="flex flex-col sm:flex-row justify-center w-full gap-6 px-4 z-10" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
              <a href="#bots" style={{ transform: "translateZ(80px)" }} className="relative group/btn cursor-pointer">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-[20px] opacity-50 group-hover/btn:opacity-100 transition-opacity"></div>
                <div className="relative bg-white text-black font-black px-10 py-5 rounded-full flex items-center gap-3 text-lg uppercase tracking-widest hover:scale-105 transition-transform overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                  <Zap size={24}/> Boot Sequence
                </div>
              </a>
              <a href="#network" style={{ transform: "translateZ(60px)" }} className="relative bg-[#050505] border border-white/20 hover:border-white/50 text-white font-black px-10 py-5 rounded-full flex items-center justify-center gap-3 text-lg uppercase tracking-widest hover:scale-105 hover:bg-white/10 transition-all shadow-2xl">
                 Terminal Access
              </a>
            </motion.div>
          </TiltCard>
        </section>

        {/* 🤖 BOTS ECOSYSTEM */}
        <motion.section id="bots" className="py-24 sm:py-32 p-6 lg:p-12 2xl:p-24 max-w-[1600px] mx-auto relative z-10 bg-[#020202]/80 backdrop-blur-3xl border-t border-white/5" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeInUp} className="mb-20 2xl:text-center flex flex-col 2xl:items-center">
              <span className="bg-gradient-to-r from-purple-500/20 to-transparent border-l border-purple-500 text-purple-400 px-6 py-3 font-black text-sm uppercase tracking-[0.4em] flex items-center gap-3 w-fit mb-8"><TerminalIcon size={20}/> Weapons Cache</span>
              <h2 className="text-5xl sm:text-7xl md:text-9xl font-black text-white uppercase tracking-tighter">Bot <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">Arsenal</span></h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            <BotCard name="HOIiSTING" description="Deploy your code into the matrix for absolutely zero cost." icon={Server} tag="Free" link="http://t.me/HOIiSTING_BOT" />
            <BotCard name="Yuki Music" description="Flawless zero-latency audio streaming for elite supergroups." icon={Music} tag="Pro" link="http://t.me/YUKIMUSiICBOT" />
            <BotCard name="Aniya Music" description="Advanced algorithmic music curation and deep VC controls." icon={Heart} tag="Beta" link="http://t.me/ANIYA_MUSIC_BOT" />
            <BotCard name="Session Genii" description="Military encryption grade Pyrogram string generation tool." icon={Code} tag="Dev" link="http://t.me/SESSIONGENIIBOT" />
            <BotCard name="Wafuuu" description="The ultimate anime-verse interaction and gacha simulator." icon={BotMessageSquare} tag="Anime" link="http://t.me/Wafuuuubot" />
            <BotCard name="NEX Core" description="Unbreakable server moderation and raid mitigation firewall." icon={ShieldAlert} tag="Core" link="https://t.me/NEX_FUCKR" />
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
               <BotCard name="Copyright Shield" description="Automated DMCA obliteration. Currently in deep compilation mode." icon={ShieldCheck} tag="Soon" comingSoon={true} />
            </div>
          </div>
        </motion.section>

        {/* ⚔️ THE NETWORK (Fighters) */}
        <motion.section id="network" className="py-24 sm:py-32 p-6 lg:p-12 max-w-[1600px] mx-auto bg-black relative z-10 border-t border-purple-900/50" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            
          <motion.div variants={fadeInUp} className="mb-16">
              <span className="text-red-600 px-4 font-black text-sm uppercase tracking-[0.4em] flex items-center gap-3 mb-6"><Swords size={20}/> Combat Infrastructure</span>
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter">The <span className="text-red-600">Vanguard</span></h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <FighterBox title="Main HQ" desc="Strategic Command" icon={ShieldAlert} link="#" />
            <FighterBox title="Bhaichara" desc="Frontline Division" icon={Users} link="https://t.me/ll_BHAICHARA_ON_TOP_ll" />
            <FighterBox title="Moderators" desc="Elite Guards" icon={Shield} link="#" />
            <FighterBox title="Ban Unit" desc="Executioners" icon={Ban} link="https://nexbanig.vercel.app/" />
          </div>

        </motion.section>

        {/* 🌐 WEB CARDS */}
        <motion.section id="web" className="py-24 sm:py-32 p-6 lg:p-12 2xl:p-24 max-w-[1600px] mx-auto bg-[#030303] relative z-10 border-t border-white/5 text-center" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={fadeInUp} className="mb-20">
              <h2 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter mb-4">Web <span className="text-blue-500">Matrix</span></h2>
              <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-sm md:text-xl">External Interface Endpoints</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WebCard name="YukiTones" type="Music Web Platform" link="https://yukitones.vercel.app/" />
            <WebCard name="Nex Audio" type="Music Interface" link="https://muisc-website.vercel.app/" />
            <WebCard name="YukiAPI" type="Central Neural Hub" link="https://Yukiapi.site" />
          </div>
        </motion.section>
        
        {/* FOOTER */}
        <footer className="border-t-4 border-purple-600 bg-black pt-32 pb-16 px-6 relative z-30 overflow-hidden">
          <div className="absolute top-0 right-[-10%] w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div>
              <h2 className="text-7xl sm:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">NEX<span className="text-purple-600">.</span></h2>
              <p className="text-gray-400 max-w-xl text-lg lg:text-2xl font-bold uppercase tracking-widest text-[#555]">Engineered by HellfireDevs. Deploying the future.</p>
            </div>
            <div className="flex gap-6 z-10">
              <a href="https://github.com/HellfireDevs" target="_blank" rel="noreferrer" className="p-6 bg-[#111] border border-white/10 rounded-full hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"><FaGithub size={30}/></a>
              <a href="https://t.me/NEX_FUCKR" target="_blank" rel="noreferrer" className="p-6 bg-[#111] border border-white/10 rounded-full hover:bg-[#0088cc] hover:text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"><FaTelegramPlane size={30}/></a>
            </div>
          </div>
        </footer>

      </div>
      
      {/* Global CSS injections for new animations if index.css is untouched */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes grid-flow {
          0% { transform: rotateX(75deg) translateY(0); }
          100% { transform: rotateX(75deg) translateY(50px); }
        }
        .animate-grid-flow {
          animation: grid-flow 2s linear infinite;
        }
        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 30%, #030303 80%);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
}
