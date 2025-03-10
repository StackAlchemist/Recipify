import React from "react";
import { images } from "../assets/assets";
import { motion } from "framer-motion";
import { Drumstick, ForkKnife, LucideIceCreamBowl, Snail } from "lucide-react";

const Hero = () => {
  const ball = {
    borderRadius: "50%",
    background: "var(--accent)",
}
  return (
    <div className=" text-emerald-600 flex justify-center relative h-screen overflow-hidden md:pt-10 pt-2 ">
      <img src={images.leaf1} className="w-[600px] absolute -z-20 left-0 bottom-[2px]" alt="" />
      <img src={images.pill} className="w-[900px] absolute -z-20 -right-[150px] md:top-[220px] top-[300px] rotate-0" alt="" />
      
      <div className="items-center justify-center flex flex-col relative">
        <h1 className="text-4xl font-bold text-center space-grotesk">
          It’s just social media, but for people and{" "}
          <span className="underline decoration-wavy decoration-green-500 prata-regular text-amber-300">
            food
          </span>
        </h1>
        <motion.div 
    style={ball}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
    }}
>
    <img 
        src={images.chickenBowl} 
        alt="" 
    />
</motion.div>

        <motion.div
        animate={{y: [0, 18, 0]}}
        transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
        className="backdrop-blur-lg bg-white/47 border border-white/20 shadow-lg text-slate-500 rounded-r-full rounded-t-full md:p-8 p-3 max-w-2xl text-center absolute right-0 md:top-[240px] top-[300px] flex">
          I love Chicken Bowl <Drumstick/>
        </motion.div>
        <motion.div 
                animate={{y: [0, 18, 0]}}
                transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}} className="backdrop-blur-lg bg-white/47 border border-white/20 shadow-lg text-slate-500 rounded-l-full rounded-t-full md:p-8 p-3 max-w-2xl text-center absolute left-0 md:top-[150px] top-[220px] flex">
        <ForkKnife/>  Have you tried cous-cous?
        </motion.div>
        <motion.div
                animate={{y: [0, 18, 0]}}
                transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
        className="backdrop-blur-lg bg-white/47 border border-white/20 shadow-lg text-slate-500 rounded-full md:p-8 p-3 max-w-2xl text-center absolute  md:top-[470px] top-[450px] flex">
          <Snail />
          Peppered Snail is so hmm..
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
