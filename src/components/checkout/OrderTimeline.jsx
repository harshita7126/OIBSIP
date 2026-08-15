import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flame, ChefHat, Bike, Home, Clock } from 'lucide-react';

export const OrderTimeline = ({ timeline = [], currentStatus = 'received' }) => {
  const steps = [
    { key: 'received', label: 'Order Confirmed', icon: CheckCircle2, desc: 'Order details sent to woodfire kitchen' },
    { key: 'preparing', label: 'Chef Kneading Crust', icon: ChefHat, desc: 'Fresh sourdough stretched & toppings assembled' },
    { key: 'in_oven', label: 'Woodfire Baking', icon: Flame, desc: 'Baked at 450°C until crust bubbles golden' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, desc: 'Driver en route in insulated thermal bag' },
    { key: 'delivered', label: 'Hot & Fresh Delivered', icon: Home, desc: 'Bon Appetit!' }
  ];

  const getStepState = (stepIndex) => {
    const status = (currentStatus || '').toLowerCase();

    let isCompleted = false;
    let isCurrent = false;

    if (status === 'delivered') {
      isCompleted = true;
    } else if (status === 'out_for_delivery' || status === 'out for delivery') {
      if (stepIndex < 3) isCompleted = true;
      else if (stepIndex === 3) isCurrent = true;
    } else if (status === 'in_oven' || status === 'in oven' || status === 'woodfire oven' || status === 'woodfire_oven') {
      if (stepIndex < 2) isCompleted = true;
      else if (stepIndex === 2) isCurrent = true;
    } else if (status === 'preparing') {
      if (stepIndex === 0) isCompleted = true;
      else if (stepIndex === 1) isCurrent = true;
    } else {
      // Placed / received / default
      if (stepIndex === 0) isCompleted = true;
    }

    let statusText = 'Pending';
    if (isCurrent) {
      statusText = 'In Progress';
    } else if (isCompleted) {
      statusText = 'Completed';
    }

    return { isCompleted, isCurrent, statusText };
  };

  return (
    <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-gray-900">Live Status Tracker</h3>
          <p className="text-xs text-gray-400">Updates sync in real-time from store kitchen</p>
        </div>
        <span className="px-3 py-1 text-xs font-bold text-brand-orange bg-orange-50 rounded-full border border-brand-orange/20 flex items-center gap-1.5 animate-pulse">
          <Clock className="w-3.5 h-3.5" /> Live Kitchen Feed
        </span>
      </div>

      {/* Stepper Progress */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
        {steps.map((step, idx) => {
          const { isCompleted, isCurrent, statusText } = getStepState(idx);
          const StepIcon = step.icon;
          const timelineEntry = timeline.find(t => t.step === step.key);

          const timeDisplay =
            timelineEntry?.time && !['Completed', 'Pending', 'In Progress'].includes(timelineEntry.time)
              ? timelineEntry.time
              : statusText;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Icon Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all z-10 ${
                  isCurrent
                    ? 'bg-brand-orange text-white ring-4 ring-orange-100 shadow-orange-glow scale-110'
                    : isCompleted
                    ? 'bg-emerald-500 text-white shadow-soft-sm'
                    : 'bg-white text-gray-300 border-2 border-gray-200'
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${isCurrent ? 'text-brand-orange' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </h4>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                    {timeDisplay}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
