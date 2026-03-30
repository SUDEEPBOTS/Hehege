import React from 'react';

const Background = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#050505] overflow-hidden">
      
      {/* 🔮 Center Main Halo Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-700/40 rounded-full blur-[120px] animate-blob"></div>
      
      {/* 🔮 Secondary Glowing Orbs for Depth */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-700/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-700/30 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      
      {/* 🕸️ Hacker Style Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:30px_30px]"></div>
    </div>
  );
};

export default Background;
