import { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatter?: (val: number) => string;
}

export function AnimatedCounter({ value, duration = 2, formatter = (v) => v.toLocaleString() }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;

    const end = value;
    if (end === 0) return;

    const totalMilSecDur = duration * 1000;
    const incrementTime = 16;
    const totalSteps = Math.ceil(totalMilSecDur / incrementTime);
    let step = 0;

    const easeOutQuad = (t: number) => t * (2 - t);

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const currentCount = Math.round(end * easeOutQuad(progress));

      if (step >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentCount);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, inView]);

  return <span ref={ref}>{formatter(count)}</span>;
}

export function FadeInUp({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
